import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userName = '';
  password = '';
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logIn(){
    this.authService.login(this.userName, this.password).then(cred =>{
      console.log(cred);
    });
  }

}
