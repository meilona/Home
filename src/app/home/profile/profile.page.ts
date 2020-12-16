import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {map} from 'rxjs/operators';
import {ActionSheetController, AlertController, NavController, Platform, PopoverController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import * as moment from 'moment';
import {Camera, CameraResultType, CameraSource, Capacitor} from '@capacitor/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('filePicker', { static: false }) filePickerRef: ElementRef<HTMLInputElement>;
  userId: any;
  user: any;
  userLocations: any[] = [];
  userLocationsBackup: any[] = [];
  private i: number;
  imageUrl: any;
  photo: SafeResourceUrl;
  isDesktop: boolean;

  constructor(
      private activatedRoute: ActivatedRoute,
      private userService: UserService,
      private authService: AuthService,
      private router: Router,
      private navCtrl: NavController,
      private alertCtrl: AlertController,
      private platform: Platform,
      private sanitizer: DomSanitizer,
      private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    if ((this.platform.is('mobile') && this.platform.is('hybrid')) ||
        this.platform.is('desktop')){
      this.isDesktop = true;
    }

    // get user logged id
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        // console.log(res.uid);
        this.userId = res.uid;
        this.firstTimeLoad();
        this.getUser();
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });
  }

  firstTimeLoad() {
    // get photo from storage
    const ref = this.storage.ref('profilePhoto/' + this.userId + '.jpg');
    ref.getDownloadURL().subscribe(res => {
      console.log('res', res);
      if (res > 0) {
        this.photo = res;
      } else {
        // when no file uploaded yet
        this.photo = null;
      }
    });
  }

  async getPicture(type: string){
    if (!Capacitor.isPluginAvailable('Camera') || (this.isDesktop && type === 'gallery')){
      // console.log(type);
      this.filePickerRef.nativeElement.click();
      return;
    }

    const image = await Camera.getPhoto({
      quality: 100,
      width: 400,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    });
    console.log(image);
    this.photo = image.dataUrl;
    console.log('this.photo: ', this.photo);
    this.upload();
  }

  onFileChoose(event: Event){
    const file = (event.target as HTMLInputElement).files[0];
    const pattern = /image-*/;
    const reader = new FileReader();

    if (!file.type.match(pattern)){
      console.log('File Format not supported');
      return;
    }

    reader.onload = () => {
      this.photo = reader.result.toString();
    };
    reader.readAsDataURL(file);
  }

  upload() {
    const file = this.dataURLtoFile(this.photo, 'file');
    console.log('file:', file);
    const filepath = 'profilePhoto/' + this.userId + '.jpg';
    const ref = this.storage.ref(filepath);
    const task = ref.put(file);
  }

  dataURLtoFile(dataurl, filename) {

    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, {type: mime});
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
      this.userLocationsBackup = this.user.locations;
      this.userLocationsBackup.reverse();
      // console.log(this.userLocationsBackup);
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
      // this.userLocations.reverse();
    }
  }

  ionViewDidEnter() {
  }

  changePicture() {

  }

  async presentAlert(idx){
    const alert = await this.alertCtrl.create({
      header: 'Delete history lokasi ini?',
      message: 'Lokasi yang dihapus tidak dapat dikembalikan lagi.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => this.deleteLocation(idx)
        }
      ]
    });
    await alert.present();
  }

  deleteLocation(idx){
    if (idx >= 0) {
      this.userLocations.splice(idx, 1); // display to user
      this.userLocationsBackup.splice(idx, 1); // save to firestore
      this.userLocationsBackup.reverse();
      this.userService.updateLocations(this.userId, this.userLocationsBackup);
    }
  }

  itemPressed(idx) {
    console.log(idx);
    this.presentAlert(idx);
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
