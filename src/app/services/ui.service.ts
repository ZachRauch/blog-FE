import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, take } from 'rxjs';
import { BlogPost } from '../data/BlogPosts';
import { Likes } from '../data/Likes';
import { User } from '../data/User';
import { Comment } from '../data/Comment';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public displayPosts = false;
  public displayLogin = true;
  public displayRegister = false;
  public displayNewPost = false;

  public guestUser: User = new User(-1, '', '', 'Guest', '');
  public currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    this.guestUser
  );
  public blogPosts: BlogPost[] = [];
  public likes: Likes[] = [];
  public comments: Comment[] = [];
  public isLoggedIn: boolean = false

  constructor(private _snackBar: MatSnackBar, private http: HttpClient) {

    this.isLoggedIn = Boolean(localStorage.getItem("isLoggedIn"))
    
    if(this.isLoggedIn){
      var userString = localStorage.getItem("user")
      if(userString){
        var user = JSON.parse(userString)
        this.tryLogin(user.email,user.password)
      }
    }
  }

  public showError(message: string): void {
    this._snackBar.open(message, undefined, { duration: 10000 });
  }

  tryLogin(email: string, password: string): void {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('email', email);
    queryParams = queryParams.append('password', password);
    this.http
      .get<User>('http://localhost:8080/users', { params: queryParams })
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.successfulLogin(user)
        },
        error: (err) => {
          if (err.status === 404) {
            this.showError('Invalid Username or Password.');
          } else {
            this.showError('Error logging in.');
          }
        },
      });
  }

  successfulLogin(user: User) {
    this.isLoggedIn = true
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.next(user);
    this.resetDisplays();
    this.displayPosts = true;
  }

  logoutUser() {
    localStorage.clear()
    this.isLoggedIn = false
    this.currentUser.next(this.guestUser)
    this.resetDisplays();
    this.displayLogin = true
  }

  resetDisplays() {
    this.displayPosts = false;
    this.displayLogin = false;
    this.displayRegister = false;
    this.displayNewPost = false;
  }

  showPosts() {
  this.resetDisplays();
  this.displayPosts = true;
  }

  showNewPost() {
    this.resetDisplays();
    this.displayNewPost = true;
  }

  showRegister() {
    this.resetDisplays();
    this.displayRegister = true;
  }

  showLogin() {
    this.resetDisplays();
    this.displayLogin = true;
  }

  registerUser(newUser: User): void {
    this.http
      .post<User>('http://localhost:8080/users', newUser)
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          this.successfulLogin(user);
        },
        error: (err) => {
          if (err.status === 400) {
            this.showError('Username already taken.');
          } else {
            this.showError('Error registering.');
          }
        },
      });
  }

  getBlogPosts() {
    this.http
      .get<BlogPost[]>('http://localhost:8080/blogposts')
      .pipe(take(1))
      .subscribe({
        next: (posts) => {
          this.blogPosts = posts;
        },
        error: () => {
          this.showError('Unable to get blogposts');
        },
      });
  }

  addBlogPost(newPost: BlogPost) {
    this.http
    .post<BlogPost>('http://localhost:8080/blogposts', newPost)
    .pipe(take(1))
    .subscribe({
      next: () => {
        this.getBlogPosts();
      },
      error: (err) => this.showError("Error adding blog post")
    });
  }

  getLikes(): Likes[] {
    this.http
      .get<Likes[]>(`http://localhost:8080/likes`)
      .pipe(take(1))
      .subscribe({
        next: (likes) => {
          this.likes = likes;
        },
        error: () => {
          this.showError('Unable to get likes');
        },
      });
    return this.likes;
  }

  addLike(newLike: Likes) {
    this.http
      .post<Likes>('http://localhost:8080/likes', newLike)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getLikes();
        },
        error: (err) => this.showError("Error adding Like")
      });
  }

  deleteLike(likeId: number) {
    this.http.delete(`http://localhost:8080/likes/${likeId}`)
    .pipe(take(1)).subscribe({
      next: () => {
        this.getLikes();
      },
      error: (err) => this.showError("Error deleting Like")
    })
  }

  getComments(): Comment[] {
    this.http
      .get<Comment[]>(`http://localhost:8080/comments`)
      .pipe(take(1))
      .subscribe({
        next: (comments) => {
          this.comments = comments;
        },
        error: () => {
          this.showError('Unable to get comments');
        },
      });
    return this.comments;
  }

  getAll() {
    this.getBlogPosts();
    this.getLikes();
    this.getComments();
  }

  addComment(newComment: Comment) {
    this.http
      .post<Comment>('http://localhost:8080/comments', newComment)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.getComments();
        },
        error: (err) => this.showError("Error adding Comment")
      });
  }
}
