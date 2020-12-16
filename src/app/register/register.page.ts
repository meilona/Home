import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
      private navCtrl: NavController,
      private authSrv: AuthService,
      private formBuilder: FormBuilder,
  ) { }

  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';

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
    });
  }

  tryRegister(value) {
    this.authSrv.registerUser(value)
        .then(res => {
          // console.log(res);
          this.errorMessage = '';
          this.successMessage = 'Your account has been created.';
          this.validationsForm.reset();
          this.authSrv.loginUser(value).then(() => {
            this.navCtrl.navigateForward('/home');
          });
        }, err => {
          // console.log(err);
          this.errorMessage = err.message;
          this.successMessage = '';
        });
  }

  goLoginPage() {
    this.navCtrl.navigateBack('/login');
  }

}
