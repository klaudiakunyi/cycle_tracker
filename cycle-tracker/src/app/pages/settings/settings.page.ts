import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Settings } from 'src/app/interfaces/settings';
import { AuthService } from 'src/app/services/auth.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  userId = '';
  settings: Settings = { userId: '', symptoms: { temperature: false, mood: false, blood: false, cervicalMucus: false, sexualActivity: false, pain: false, contraceptionUsage: false}};
  
  temperature = false;
  mood =  false;
  blood = false;
  cervicalMucus =  false;
  sexualActivity = false;
  pain = false;
  contraceptionUsage = false;

  loadFinished = false;
  modalName: string;


  constructor(
    private settingsService: SettingsService, 
    private authService: AuthService,
    public toastController: ToastController,
    private router: Router) { }

  ngOnInit() {
    this.authService.isUserLoggedIn().subscribe(user =>{
      this.userId = user?.uid;
      this.settingsService.getSettingsById(this.userId).subscribe(res=>{
        this.settings = res;
        
        this.temperature = this.settings.symptoms.temperature;
        this.mood = this.settings.symptoms.mood;
        this.blood = this.settings.symptoms.blood;
        this.cervicalMucus = this.settings.symptoms.cervicalMucus;
        this.contraceptionUsage = this.settings.symptoms.contraceptionUsage;
        this.pain = this.settings.symptoms.pain;
        this.sexualActivity = this.settings.symptoms.sexualActivity;

        this.loadFinished = true;
      })
    })
  }

  saveSettings(){
    this.settingsService.addSettings(this.settings).then(()=>{
    }).catch(()=>{
      this.presentToast('Sikertelen mentés :(');
    });
  }
  
  bloodChanged($event){
    this.settings.symptoms.blood = $event.detail.checked;
    this.saveSettings();
  }
  temperatureChanged($event){
    this.settings.symptoms.temperature = $event.detail.checked;
    this.saveSettings();
  }
  mucusChanged($event){
    this.settings.symptoms.cervicalMucus = $event.detail.checked;
    this.saveSettings();
  }
  moodChanged($event){
    this.settings.symptoms.mood = $event.detail.checked;
    this.saveSettings();
  }
  painChanged($event){
    this.settings.symptoms.pain = $event.detail.checked;
    this.saveSettings();
  }
  sexualActivityChanged($event){
    this.settings.symptoms.sexualActivity = $event.detail.checked;
    this.saveSettings();
  }
  contraceptionUsageChanged($event){
    this.settings.symptoms.contraceptionUsage = $event.detail.checked;
    this.saveSettings();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }

  logOut(){
    this.authService.logout().then(()=>{
      this.router.navigateByUrl('/login');
    })
  }
}
