import { Component, OnInit } from '@angular/core';
import {IonItemSliding, NavController} from '@ionic/angular';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  // userData: any;
  // loadedUser: any;
  tempUser: any;
  private i: number;
  private j: number;
  // private k = 0;
  loadedFriends: any;
  userFriends: any;
  userId: any;
  friendListBackup: any;

  constructor(
      private userService: UserService,
      private router: Router,
      private authService: AuthService,
      private navCtrl: NavController,
  ) { }

  ngOnInit() {
    // get user logged id
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        // console.log(res.uid);
        this.userId = res.uid;
        this.getUsers();
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
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
        console.log(this.userFriends);
        this.getFriendsData(1);
      } else {
        this.userFriends = [];
        this.getFriendsData(0);
      }
    });
  }

  getFriendsData(hasFriend) {
    // get all users data (except user)
    this.userService.getUsers(this.userId).snapshotChanges().pipe(
        map(changes =>
            changes.map(c => c.payload.doc.data())
        )
    ).subscribe(data => {
      this.loadedFriends = [ ];
      this.friendListBackup = [ ];
      this.tempUser = data;
      if (hasFriend === 1){
        for (this.j = 0; this.j < this.userFriends.length ; this.j++) {
          for (this.i = 0; this.i < this.tempUser.length ; this.i++) {
            if (this.userFriends[this.j] === this.tempUser[this.i].id ) {
              // make friend list arr
              this.loadedFriends.push(this.tempUser[this.i]);
              // remove from temp if friend
              this.tempUser.splice(this.i, 1);
            }
          }
        }
        this.friendListBackup = this.loadedFriends;
      }
    });
  }

  addFriends(){
    console.log('search people.');
    this.router.navigate(['home/friends/add'], {
      state: { notFriends: this.tempUser , friendList : this.userFriends}
    });
  }

  async filterSearch(ev){
    this.loadedFriends = this.friendListBackup;
    const searchTerm = ev.target.value;
    console.log(searchTerm);
    if (!searchTerm) {
      return;
    }
    this.loadedFriends = this.loadedFriends.filter(currentName => {
      if ((currentName.fName + ' ' + currentName.lName) && searchTerm) {
        return ((currentName.fName + ' ' + currentName.lName).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 );
      }
    });
  }

  removeFriend(idx, friendId, slidingItem: IonItemSliding){
    this.userFriends.splice(idx, 1);
    this.loadedFriends.splice(idx, 1);
    this.userService.updateFriends(this.userId, this.userFriends.toString());
  }

  goto(tab){
    if (tab !== 'home') {
      this.router.navigate(['home/' + tab]);
    } else {
      this.router.navigate([tab]);
    }
  }
}
