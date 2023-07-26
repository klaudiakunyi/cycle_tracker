import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    rePassword: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
  });

  constructor(private authService: AuthService, 
              private location: Location, 
              private alertController: AlertController, 
              private userService: UserService,
              private settingsService: SettingsService,
              private router: Router ) { }

  ngOnInit() {
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Figyelmeztetés',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  onSubmit(){
    if(this.signUpForm.get('password').value !== this.signUpForm.get('rePassword').value){
      this.presentAlert('A Jelszó és Jelszó újra mezők nem egyeznek');
    } else if(!this.signUpForm.valid){
      this.presentAlert('A regisztráció mező adatait kötelező helyesen kitölteni.');
    }
    else if(this.signUpForm.valid){
      this.authService.signup(this.signUpForm.get('email')?.value, this.signUpForm.get('password')?.value).then(cred =>{
        this.userService.addUser({
          id: cred.user?.uid as string,
          email: this.signUpForm.get('email')?.value,
          name: this.signUpForm.get('name')?.value,
        })
        this.settingsService.addSettings({
          userId: cred.user?.uid as string,
          symptoms:{
              temperature: true,
              mood: true,
              blood: true,
              pain: true,
              cervicalMucus: true,
              contraceptionUsage: true,
              sexualActivity: true
          }
        })
        this.router.navigate(['/login']);
      }).catch(error =>{
        this.presentAlert('Sikertelen regisztráció!');
      })
    }
  }



  goBack(){
    this.location.back();
  }

}
