import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private dbPath = 'user';
  userRef: AngularFirestoreCollection<any> = null;
  private storageRef: any;

  constructor(
      private db: AngularFirestore,
      private fireStorage: AngularFireStorage,
  ) {
    this.storageRef = this.fireStorage.ref('user');
  }

  getUsers(userId: string): AngularFirestoreCollection<any>{
    this.userRef = this.db.collection<any>(this.dbPath, ref => ref.where('id', '!=', userId));
    return this.userRef;
  }

  getUser(userId: string): AngularFirestoreCollection<any>{
    this.userRef = this.db.collection<any>(this.dbPath, ref => ref.where('id', '==', userId));
    console.log(this.userRef);
    return this.userRef;
  }

  updateProfile(idu: string, value: any){
    this.db.doc(this.dbPath + '/' + idu).update({fName: value.fName});
    this.db.doc(this.dbPath + '/' + idu).update({lName: value.lName});
  }

  updateFriends(idu: string, friendId: string){
    this.db.doc(this.dbPath + '/' + idu).update({friendList: friendId});
  }

  updateLocations(idu: string, value: any){
    this.db.doc(this.dbPath + '/' + idu).update({locations: value});
  }
}
