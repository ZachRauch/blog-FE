import { Component } from '@angular/core';
import { Likes } from 'src/app/data/Likes';
import { UiService } from 'src/app/services/ui.service';
import { Comment } from 'src/app/data/Comment';

@Component({
  selector: 'app-blogpost',
  templateUrl: './blogpost.component.html',
  styleUrls: ['./blogpost.component.css']
})
export class BlogpostComponent {

  public user: any
  panelOpenState = false;
  public value = ''

  constructor(public ui: UiService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}').userId
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  findLikesCount(id: number) {
    return this.ui.likes.filter(element => element.postId === id).length
  }

  findCommentsCount(id: number) {
    return this.ui.comments.filter(each => each.postId === id).length
  }

  addOrDeleteLike(postId: number, userIdVar: number) {
    let releventLikes = this.ui.likes.filter(element => element.postId === postId)
    if (releventLikes.filter(each => each.userId === userIdVar).length > 0) {
      this.ui.deleteLike(releventLikes.filter(each => each.userId === userIdVar)[0].id)
    }
    else if (releventLikes.filter(each => each.userId === userIdVar).length === 0) {
      let like = new Likes(-1, userIdVar, postId)
      this.ui.addLike(like)
    }
  }

  findComments(id: number) {
    let releventComments = this.ui.comments.filter(each => each.postId === id)
    return releventComments
  }

  createAndAddComment(commenterId: number, comment: string, postId: number) {
    let newComment = new Comment(-1, commenterId, postId, comment)
    this.ui.addComment(newComment)
    this.value = ''
  }
}
