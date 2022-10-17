import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

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
    weight: new FormControl()
  });

  birthDate = "";

  constructor(private authService: AuthService, private location: Location, private alertController: AlertController, private userService: UserService) { }

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
    } else if(!this.birthDate){
      this.presentAlert('A születési dátumot kötelező megadni.');
    } else if(!this.signUpForm.valid){
      this.presentAlert('A regisztráció mező adatait kötelező helyesen kitölteni.');
    }
    else if(this.signUpForm.valid){
      console.log(this.signUpForm.value);
      this.authService.signup(this.signUpForm.get('email')?.value, this.signUpForm.get('password')?.value).then(cred =>{
        console.log(cred);
        this.userService.addUser({
          id: cred.user?.uid as string,
          email: this.signUpForm.get('email')?.value,
          name: this.signUpForm.get('name')?.value,
          birthDate: this.birthDate,
          weight: this.signUpForm.get('weight')?.value
        })
      }).catch(error =>{
        //console.error(error);
        this.presentAlert('Sikertelen regisztráció!');
      })
    }
  }

  onDateChange($event){
    let changedDate = $event.detail.value.split("T")[0]
    this.birthDate = changedDate; 
  }

  goBack(){
    this.location.back();
  }

}
