import { Injectable } from '@angular/core';
import { User } from '../interfaces/user'
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  collectionName = 'Users';

  constructor(private afs: AngularFirestore) { }

  addUser(user: User){
    this.afs.collection<User>(this.collectionName).doc(user.id).set(user);
  }
}
