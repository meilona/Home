import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../services/user.service';
import {AuthService} from '../services/auth.service';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import firebase from 'firebase';
import {interval, Subscription} from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private lat: number;
  private lng: number;
  private userMarker: any;
  private locationValue = '';
  private userLocations: any[] = [];
  private userId;
  userData: any;
  tempUser: any;
  private i: number;
  private j: number;
  loadedFriends: any;
  userFriends: any;
  private updateSubscription: Subscription;

  map: any;
  infoWindow: any = new google.maps.InfoWindow();
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;
  @ViewChild('refresherRef') refresherRef;
  umnPos: any = {
    lat: -6.256081,
    lng: 106.618755
  };

  constructor(
      private userService: UserService,
      private authService: AuthService,
      private navCtrl: NavController,
      private router: Router,
  ) { }

  ngOnInit() {
    // check logged in user
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        // console.log(res.uid);
        this.userId = res.uid;
        this.getUsers();
      } else {
        // when no one logged in, direct to login
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    });

    // subcribe auto update lokasi ke database setiap 10 menit
    // 1000 = 1 s, 10 minute = 1000s * 60 * 10
    this.updateSubscription = interval(600000).subscribe(
        (val) => {
          console.log('Update ke- ' + val);
          this.automaticUpdateLastLocation();
        }
    );
  }

  automaticUpdateLastLocation(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (this.userMarker){
          this.userMarker.setMap(null);
        }

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.lat = pos.lat;
        this.lng = pos.lng;

        this.userMarker = new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          map: this.map,
          icon: 'assets/icon/userMark.png'
        });

        console.log(pos);
        this.map.setCenter(pos);
        this.locationValue = 'AutoUpdate';
        this.checkIn();
      });
    }
  }

  getUsers(){
    this.userService.getUser(this.userId).snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({data: c.payload.doc.data()}))
        )
    ).subscribe(data => {
      this.userData = data[0].data;
      this.userLocations = [];
      this.userFriends = [];
      this.loadedFriends = [];
      if (data[0].data.locations) {
        this.userLocations = data[0].data.locations;
      }
      if (data[0].data.friendList && data[0].data.friendList[0] !== ''){
        this.userFriends = data[0].data.friendList.split(',');
        console.log(this.userFriends);
        this.getFriendsData();
      }
    });
  }

  getFriendsData() {
    console.log(this.userData); // user data
    // get all users data (except user)
    this.userService.getUsers(this.userId).snapshotChanges().pipe(
        map(changes =>
            changes.map(c => c.payload.doc.data())
        )
    ).subscribe(data => {
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
      this.markFriendsLocation();
    });
  }

  markFriendsLocation(){
    for (this.i = 0 ; this.i < this.loadedFriends.length; this.i++){
      if (this.loadedFriends[this.i].locations){
        const eachFriendLocation = this.loadedFriends[this.i].locations[this.loadedFriends[this.i].locations.length - 1];
        const location = new google.maps.LatLng(eachFriendLocation.lat, eachFriendLocation.lng);
        // console.log(location);
        const marker = new google.maps.Marker({
          position: location,
          map: this.map,
          icon: 'assets/icon/friendMark.png',
          clickable: true
        });
        marker.info = new google.maps.InfoWindow({
          content: this.loadedFriends[this.i].fName
        });
        google.maps.event.addListener(marker, 'click', function() {
          marker.info.open(map, marker);
        });
      }
    }
  }

  ionViewDidEnter() {
    this.showMap();
    if (this.loadedFriends.length > 0){
      this.markFriendsLocation();
    }
  }

  showCurrentLoc() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (this.userMarker){
          this.userMarker.setMap(null);
        }

        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        this.lat = pos.lat;
        this.lng = pos.lng;

        this.userMarker = new google.maps.Marker({
          position: new google.maps.LatLng(this.lat, this.lng),
          map: this.map,
          icon: 'assets/icon/userMark.png'
        });

        console.log(pos);
        this.map.setCenter(pos);
      });
    }
  }

  showMap() {
    // console.log('test', pos);
    const location = new google.maps.LatLng(this.umnPos.lat, this.umnPos.lng);
    const options = {
      center: location,
      zoom: 13,
      disableDefaultUI: true
    };
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    this.map.addListener('click', (mapsMouseEvent) => {
      if (this.userMarker){
        this.userMarker.setMap(null);
      }

      this.lat = mapsMouseEvent.latLng.toJSON().lat;
      this.lng = mapsMouseEvent.latLng.toJSON().lng;

      this.userMarker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: this.map,
        icon: 'assets/icon/userMark.png'
      });
    });
  }

  checkIn(){
    const date = firebase.firestore.Timestamp.fromDate(new Date());
    const newLocation: any = {
      lat: this.lat,
      lng: this.lng,
      place: this.locationValue,
      date
    };
    this.userLocations.push(newLocation);
    this.userService.updateLocations(this.userId, this.userLocations);
    this.locationValue = '';
    this.hideInputLocation();
    console.log('success');
  }

  showInputLocation(){
    if (this.userMarker != null){
      document.getElementById('transparentLayer').classList.remove('ion-hide');
      document.getElementById('modalLayer').classList.remove('ion-hide');
      document.getElementById('showCurrentLocation').classList.add('ion-hide');
      document.getElementById('manualModal').classList.add('ion-hide');
    }
    else{
      alert('Pin location sebelum check-in!');
    }
  }

  hideInputLocation(){
    document.getElementById('transparentLayer').classList.add('ion-hide');
    document.getElementById('modalLayer').classList.add('ion-hide');
    document.getElementById('showCurrentLocation').classList.remove('ion-hide');
    document.getElementById('manualModal').classList.remove('ion-hide');
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      this.refresherRef.complete();
    }, 2000);
  }

  goto(tab){
    if (tab !== 'home') {
      this.router.navigate(['home/' + tab]);
    } else {
      this.router.navigate([tab]);
    }
  }
}
