import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {map} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {AlertController, IonItemSliding, NavController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {log} from 'util';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  userData: any;
  loadedUser: any;
  tempUser: any;
  userId: string;
  private i: number;
  friendList: any;
  notFriendsListBackup: any;

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private navCtrl: NavController,
      private router: Router,
      private toastCtrl: ToastController,
      private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        // console.log(res.uid);
        this.userId = res.uid;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });

    this.userData = this.router.getCurrentNavigation().extras.state.notFriends;
    this.friendList = this.router.getCurrentNavigation().extras.state.friendList;
    this.notFriendsListBackup = this.userData;
    console.log(this.userData);
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
    console.log(idx);
    this.friendList.push(friendId);
    this.userData.splice(idx, 1);
    this.userService.updateFriends(this.userId, this.friendList.toString());
    this.presentToast();
  }


  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Friend Added.',
      color: 'success',
      duration: 2000
    });
    await toast.present();
  }

  async filterSearch(ev){
    this.userData = this.notFriendsListBackup;
    const searchTerm = ev.target.value;
    console.log(searchTerm);
    if (!searchTerm) {
      document.getElementById('searchResult').classList.add('ion-hide');
      return;
    }
    document.getElementById('searchResult').classList.remove('ion-hide');
    this.userData = this.userData.filter(currentName => {
      if ((currentName.fName + ' ' + currentName.lName) && searchTerm) {
        return ((currentName.fName + ' ' + currentName.lName).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
      }
    });
  }

}
