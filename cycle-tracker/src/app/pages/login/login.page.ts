import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = new FormControl('');
  password = new FormControl('');
  constructor(private authService: AuthService, ) { }

  ngOnInit() {
  }

  logIn(){
    this.authService.login(this.email.value, this.password.value).then(cred =>{
      console.log(cred);
      
    }).catch(error => {
      console.error(error);
    });
  }

}
 