import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private userCollection: AngularFirestoreCollection<any>;
    private users: Observable<any[]>;

    constructor(private fireAuth: AngularFireAuth,
                private db: AngularFirestore
    ) {
        this.userCollection = db.collection<any> ('user');
        this.users = this.userCollection.snapshotChanges().pipe(
            map (actions => {
                return actions.map (a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return {id, ... data};
                });
            })
        );
  }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {

      this.fireAuth.createUserWithEmailAndPassword(value.email, value.password)
          .then(
              res => {
                console.log('User id after reigstration = ' + res.user.uid);
                const user: any = {
                  id: res.user.uid,
                  email: value.email,
                  fName: value.fName,
                  lName: value.lName
                };
                this.userCollection.doc(res.user.uid).set(user);
                resolve(res);
              }, err => {
                reject(err);
              }
          );
    });

  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err)
          );
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.fireAuth.currentUser) {
        this.fireAuth.signOut()
            .then(() => {
              console.log('Log Out');
              resolve();
            }).catch((error) => {
          reject();
        });
      }
    });
  }

  userDetails() {
    return this.fireAuth.user;
  }

  getCurrentUser() {
      if (firebase.auth().currentUser) {
          return firebase.auth().currentUser;
      } else {
          return null;
      }
  }
}
