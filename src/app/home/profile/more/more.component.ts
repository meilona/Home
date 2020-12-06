import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NavController, PopoverController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.scss'],
})
export class MoreComponent implements OnInit {

  constructor(
      public popoverCtrl: PopoverController,
      private navCtrl: NavController,
      private authService: AuthService,
  ) { }

  ngOnInit() {}

  logout(){
    this.authService.logoutUser()
        .then(res => {
          console.log(res);
          this.navCtrl.navigateForward(['/login']);
        })
        .catch(error => {
          console.log(error);
        });
    this.popoverCtrl.dismiss();
  }

}
