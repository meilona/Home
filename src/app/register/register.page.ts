import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isLoading = false;

  constructor(
      private navCtrl: NavController,
      private loadingCtrl: LoadingController,
      private authSrv: AuthService,
      private formBuilder: FormBuilder,
  ) { }

  validationsForm: FormGroup;
  errorMessage = '';

  validationMessages = {
    fName: [
      { type: 'required', message: 'First Name is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    re_password: [
      { type: 'required', message: 'Re-type Password is required.' }
    ]
  };

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      fName: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      lName: new FormControl(''),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      re_password: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  tryRegister(value) {
    this.presentLoading().then(res => {
      if (value.password !== value.re_password){
        this.loadingDismiss().then( a => {
          this.errorMessage = 'Password and Re-type password does not match';
        });
      } else {
        this.authSrv.registerUser(value)
            .then( result => {
              this.errorMessage = '';
              this.validationsForm.reset();
              this.authSrv.loginUser(value).then(() => {
                this.navCtrl.navigateForward('/home');
              });
            }, err => {
              this.errorMessage = err.message;
            });
      }
    });
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Please wait ...',
      spinner: 'circles',
      duration: 1000
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }

  goLoginPage() {
    this.navCtrl.navigateBack('/login');
  }

}
