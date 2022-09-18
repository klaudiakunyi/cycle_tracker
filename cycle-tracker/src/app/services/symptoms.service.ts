import { Injectable } from '@angular/core';
import { Symptom } from '../interfaces/symptom';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class SymptomsService {

  collectionName = 'Symptoms';

  constructor(private afs: AngularFirestore) { }

  addSymptoms(symptoms: Symptom){
    this.afs.collection<Symptom>(this.collectionName).add(symptoms);
  }

  updateSymptoms(symptoms: Symptom){

  }

  getSymptoms(){

  }

  deleteSymptoms(){

  }

}
