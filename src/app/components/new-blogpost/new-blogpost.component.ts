import { Component } from '@angular/core';
import { BlogPost } from 'src/app/data/BlogPosts';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-new-blogpost',
  templateUrl: './new-blogpost.component.html',
  styleUrls: ['./new-blogpost.component.css']
})
export class NewBlogpostComponent {

  constructor(public ui: UiService) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}').userId
  }

  public titleText = ''
  public bodyText = ''
  public user: any

  createPostAndAdd(userId: number, textTitle: string, textBody: string,) {
    let newPost = new BlogPost(-1, userId, textTitle, textBody, new Date(), null)
    this.ui.addBlogPost(newPost);
    this.ui.showPosts();
  }

}
