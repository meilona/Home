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

  constructor(
      private userService: UserService,
      private router: Router,
      private authService: AuthService,
      private navCtrl: NavController,
  ) { }

  ngOnInit() {

    // untuk dapetin id nya
    this.userService.getUser('ocHkKUGuMWVeegL8HNnuw2osKvj2').snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({data: c.payload.doc.data()}))
        )
    ).subscribe(data => {
      this.userFriends = data[0].data.friendList.split(',');
      console.log(this.userFriends);
      this.getFriendsData();
    });
  }

  getFriendsData() {
    console.log(this.userFriends);
    // get all users data (except user)
    this.userService.getUsers('ocHkKUGuMWVeegL8HNnuw2osKvj2').snapshotChanges().pipe(
        map(changes =>
            changes.map(c => c.payload.doc.data())
        )
    ).subscribe(data => {
      this.loadedFriends = [ ];
      this.tempUser = data;
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
    });
  }

  searchPeople(){
    console.log('search people.');
    this.router.navigate(['home/friends/add'], {
      state: { notFriends: this.tempUser , friendList : this.userFriends}
    });
  }

  removeFriend(event, contactId, slidingItem: IonItemSliding){
    console.log('remove friend.');
  }

}
