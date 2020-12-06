import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {map} from 'rxjs/operators';
import {UserModel} from '../../models/user.model';
import {NgForm} from '@angular/forms';
import {MoreComponent} from './more/more.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  key: any;
  user: UserModel;

  constructor(
      private activatedRoute: ActivatedRoute,
      private userService: UserService,
      public popoverController: PopoverController
  ) { }

  ngOnInit() {
    // untuk dapetin id nya
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userId')) { return; }

      const key = paramMap.get('userId');
      this.key = key;
      console.log(key);

      this.userService.getUser(this.key).snapshotChanges().pipe(
          map(changes =>
              changes.map(c => ({data: c.payload.doc.data()}))
          )
      ).subscribe(data => {
        this.user = data[0].data;
        console.log(this.user);
      });
    });
  }

  ionViewDidEnter() {
  }

  async showMore(event) {
    const popover = await this.popoverController.create({
      component: MoreComponent,
      event,
      translucent: true,
    });
    return await popover.present();
  }
}
