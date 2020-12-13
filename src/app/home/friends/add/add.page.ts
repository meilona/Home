import { Component, OnInit } from '@angular/core';
import {UserService} from '../../../services/user.service';
import {map} from 'rxjs/operators';
import {AuthService} from '../../../services/auth.service';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';

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

  constructor(
      private authService: AuthService,
      private userService: UserService,
      private navCtrl: NavController,
      private router: Router,
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

    // get all users
    // this.userService.getUsers().snapshotChanges().pipe(
    //     map(changes =>
    //         changes.map(c => c.payload.doc.data())
    //     )
    // ).subscribe(data => {
    //   this.userData = [ ];
    //   // this.contacts = data;
    //   this.tempUser = data;
    //   for (this.i = 0; this.i < this.tempUser.length ; this.i++) {
    //     this.loadedUser = this.tempUser[this.i];
    //     const user = {
    //       id: this.loadedUser.id,
    //       nama: this.loadedUser.fName + ' ' + this.loadedUser.lName
    //     };
    //     this.userData.push(user);
    //   }
    //   console.log(this.userData);
    // });
    this.userData = this.router.getCurrentNavigation().extras.state.notFriends;
    this.friendList = this.router.getCurrentNavigation().extras.state.friendList;
    console.log(this.userData);
  }

  add(friendId) {
    // console.log(friendId);
    this.friendList.push(friendId);
    this.userService.updateFriends(this.userId, this.friendList.toString());
  }

}
