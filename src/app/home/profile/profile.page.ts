import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {map} from 'rxjs/operators';
import {UserModel} from '../../models/user.model';
import {NgForm} from '@angular/forms';
import {MoreComponent} from './more/more.component';
import {NavController, PopoverController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: any;
  user: any;
  userLocations: any[] = [];
  private i: number;
  imageUrl: any;

  constructor(
      private activatedRoute: ActivatedRoute,
      private userService: UserService,
      private authService: AuthService,
      private router: Router,
      private navCtrl: NavController
  ) { }

  ngOnInit() {
    // get user logged id
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        // console.log(res.uid);
        this.userId = res.uid;
        this.getUser();
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });
  }

  getUser() {
    this.userService.getUser(this.userId).snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({data: c.payload.doc.data()}))
        )
    ).subscribe(data => {
      this.user = data[0].data;
      console.log(this.user);
      // if (this.user.storageRef != null){
      //   this.imageUrl = this.user.storageRef;
      //   console.log('imageurl : ' + this.imageUrl);
      // }
      // else{
      //   this.imageUrl = 'assets/icon/person.png';
      // }
      this.imageUrl = 'assets/icon/person.png';
      this.getMyFeed();
    });
  }

  getMyFeed() {
    if (this.user.locations) {
      this.userLocations = [];
      for (this.i = 0 ; this.i < this.user.locations.length ; this.i++){
        const timeStamp = this.user.locations[this.i].date;
        const formated = moment(timeStamp.toDate()).format('YYYYMMDD HH:mm:ss');
        const time = moment(formated, 'YYYYMMDD HH:mm:ss').fromNow();
        const newLocation: any = {
          place : this.user.locations[this.i].place,
          time
        };
        this.userLocations.push(newLocation);
      }
    }
  }

  ionViewDidEnter() {
  }

  logout(){
    this.authService.logoutUser()
        .then(res => {
          console.log(res);
          this.navCtrl.navigateForward(['/login']);
        })
        .catch(error => {
          console.log(error);
        });
  }

  goto(tab){
    if (tab !== 'home') {
      this.router.navigate(['home/' + tab]);
    } else {
      this.router.navigate([tab]);
    }
  }
}
