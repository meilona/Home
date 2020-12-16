import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      private navCtrl: NavController,
      private afAuth: AngularFireAuth,
      private authService: AuthService,
      private formBuilder: FormBuilder

  ) { }

  validationForm: FormGroup;
  errorMessage = '';

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', ),
    });
  }

  loginUser(value) {
    this.authService.loginUser(value)
        .then(res => {
          // console.log(res);
          this.errorMessage = '';
          this.validationForm.reset();
          this.navCtrl.navigateForward('/home');
        }, err => {
          console.dir(err);
          if (err.code === 'auth/user-not-found') {
            // console.log('User not found');
          }
          this.errorMessage = 'email or password is incorrect';
        });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }
}
