import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public ui: UiService) {}

  public hide = true;
  public email = ''
  public password = ''

  public login() {
    this.ui.tryLogin(this.email, this.password)
  }
}
