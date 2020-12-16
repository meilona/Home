import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {map} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {AlertController, NavController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  userId: string;
  friendList: any;
  notFriends: any;
  notFriendsListBackup: any;
  loadedFriends: any;
  userFriends: any;
  private i: number;
  private j: number;

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private navCtrl: NavController,
      private router: Router,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    document.getElementById('searchResult').classList.add('ion-hide');
    this.authService.userDetails().subscribe(res => {
      // console.log('res', res);
      if (res !== null) {
        // console.log(res.uid);
        this.userId = res.uid;
        this.getUsers();
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      // console.log('err', err);
    });
  }

  getUsers(){
    this.userService.getUser(this.userId).snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({data: c.payload.doc.data()}))
        )
    ).subscribe(data => {
      if (data[0].data.friendList && data[0].data.friendList[0] !== ''){
        this.userFriends = data[0].data.friendList.split(',');
        // console.log(this.userFriends);
        this.getNotFriendsData(1);
      } else {
        this.userFriends = [];
        this.loadedFriends = null;
        this.getNotFriendsData(0);
      }
    });
  }

  getNotFriendsData(hasFriend) {
    // console.log('punya temen :' + hasFriend);
    // get all users data (except user)
    this.userService.getUsers(this.userId).snapshotChanges().pipe(
        map(changes =>
            changes.map(c => c.payload.doc.data())
        )
    ).subscribe(data => {
      this.notFriends = data;
      if (hasFriend === 1){
        this.loadedFriends = [ ];
        for (this.j = 0; this.j < this.userFriends.length ; this.j++) {
          for (this.i = 0; this.i < this.notFriends.length ; this.i++) {
            if (this.userFriends[this.j] === this.notFriends[this.i].id ) {
              // make friend list arr
              this.loadedFriends.push(this.notFriends[this.i]);
              // remove from temp if friend
              this.notFriends.splice(this.i, 1);
            }
          }
        }
      }
      this.notFriendsListBackup = this.notFriends;
    });
  }

  async presentAlert(friendId, idx, fName, lName) {
    const alert = await this.alertCtrl.create({
      header: 'Add Friend',
      message: 'Tambahkan ' + fName + ' ' + lName + ' menjadi teman anda?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler:  () => this.addFriend(friendId, idx)
        }
      ]
    });
    await  alert.present();
  }

  addFriend(friendId, idx) {
    // console.log(idx);
    this.userFriends.push(friendId);
    this.notFriends.splice(idx, 1);
    this.notFriendsListBackup.splice(idx, 1);
    this.userService.updateFriends(this.userId, this.userFriends.toString());
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Friend Added.',
      color: 'success',
      duration: 2000
    });
    await toast.present();
    this.ionViewWillEnter();
  }

  async filterSearch(ev){
    this.notFriends = this.notFriendsListBackup;
    const searchTerm = ev.target.value;
    // console.log(searchTerm);
    // console.log(this.notFriends);
    if (!searchTerm) {
      document.getElementById('searchResult').classList.add('ion-hide');
      return;
    }
    this.notFriends = this.notFriends.filter(currentName => {
      if ((currentName.fName + ' ' + currentName.lName) && searchTerm) {
        document.getElementById('searchResult').classList.remove('ion-hide');
        return ((currentName.fName + ' ' + currentName.lName).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
      }
    });
  }

}
