import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
      private router: Router,
      private afAuth: AngularFireAuth,
      private authService: AuthService,
      private formBuilder: FormBuilder

  ) { }

  validationForm: FormGroup;
  errorMessage = '';

  passwordType = 'password';

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    password: [
      { type: 'required', message: 'Password is required.' }
    ]
  };

  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  loginUser(value) {
    this.authService.loginUser(value)
        .then(res => {
          // console.log(res);
          this.errorMessage = '';
          this.validationForm.reset();
          this.router.navigate(['home']);
        }, err => {
          console.dir(err);
          if (err.code === 'auth/user-not-found') {
            // console.log('User not found');
          }
          this.errorMessage = 'email or password is incorrect';
        });
  }

  goToRegisterPage() {
    this.router.navigate(['register']);
  }
}
