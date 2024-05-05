import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EMPTY, observable, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = new FormControl('test@test.com', Validators.required);
  password = new FormControl('testing', Validators.required);

  constructor(private authService: AuthService, 
              private alertController: AlertController,
              private router: Router) { }

  ngOnInit() {
  }

  logIn(){
    this.authService.login(this.email.value, this.password.value).then(cred =>{
      this.router.navigateByUrl('cycle');
    }).catch(error => {
      this.presentAlert('Incorrect email address and / or password');
      return EMPTY;
    });
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Warning',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
 