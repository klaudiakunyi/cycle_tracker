import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Settings } from '../interfaces/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  collectionName = 'Settings';

  constructor(private afs: AngularFirestore) { }

  addSettings(settings: Settings){
    return this.afs.collection<Settings>(this.collectionName).doc(settings.userId).set(settings);
  }

  getSettingsById(id: string){
    return this.afs.collection<Settings>(this.collectionName).doc(id).valueChanges();
  }
}
