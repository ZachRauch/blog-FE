import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, take } from 'rxjs';
import { BlogPost } from '../data/BlogPosts';
import { Likes } from '../data/Likes';
import { User } from '../data/User';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  public displayPosts = false
  public displayLogin = true
  public displayRegister = false


  public guestUser: User = new User(-1,'','','Guest','')
  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(this.guestUser)
  public blogPosts: BlogPost[] = []
  public likes: Likes[] = []

  constructor(private _snackBar: MatSnackBar, private http: HttpClient) { }

  public showError(message: string): void {
    this._snackBar.open(message, undefined, {duration: 10000})
  }

  tryLogin(email: string, password: string): void {
    let queryParams = new HttpParams()
    queryParams = queryParams.append("email", email)
    queryParams = queryParams.append("password", password)
    this.http.get<User>('http://localhost:8080/users', { params: queryParams })
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.successfulLogin(user)
        },
        error: (err) => {
          if(err.status === 404){
            this.showError("Invalid Username or Password.")
          } else {
            this.showError("Error logging in.")
          }
        }
      })

  }

  successfulLogin(user: User) {
    localStorage.setItem("user", JSON.stringify(user))
    this.currentUser.next(user)
    this.resetDisplays()
    this.displayPosts = true
  }

  resetDisplays() {
    this.displayPosts = false
    this.displayLogin = false
    this.displayRegister = false
  }

  showRegister() {
    this.resetDisplays()
    this.displayRegister = true
  }

  showLogin() {
    this.resetDisplays()
    this.displayLogin = true
  }

  registerUser(newUser: User): void {
    this.http.post<User>('http://localhost:8080/users', newUser)
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.successfulLogin(user)
        },
        error: (err) => {
          if(err.status === 400){
            this.showError("Username already taken.")
          } else {
            this.showError("Error registering.")
          }
        }
      })
  }

  getBlogPosts() {
    this.http.get<BlogPost[]>('http://localhost:8080/blogposts')
    .pipe(take(1)).subscribe({
      next: (posts) => {
        this.blogPosts = posts
      },
      error: () => {
        this.showError('Unable to get blogposts')
      }
    })
  }

  getLikes(blogPostId: number): Likes[] {
    let tempLikes: Likes[] = []
    this.http.get<Likes[]>(`http://localhost:8080/likes?postId=${blogPostId}`)
    .pipe(take(1)).subscribe({
      next: (likes) => {
        tempLikes = likes
      },
      error: () => {
        this.showError('Unable to get likes')
      }
    })
    return tempLikes
  }
  
}
