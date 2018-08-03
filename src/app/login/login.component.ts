import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseUISignInSuccessWithAuthResult } from 'firebaseui-angular';
import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-login',
  template: `<firebase-ui (signInSuccessWithAuthResult)="successCallback($event)" (signInFailure)="errorCallback($event)"></firebase-ui>`,
  styles: []
})
export class LoginComponent implements OnInit {
  private returnUrl: string;
  constructor(
    private afAuth:AngularFireAuth,
    private auth:AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    console.log('LoginComponent which will redirect to '+this.returnUrl)
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    // login successful so redirect to return url
    this.router.navigateByUrl(this.returnUrl);
  }
  async errorCallback(error:any) {
    if(error.code=='firebaseui/anonymous-upgrade-merge-conflict'){
      await this.auth.mergeAnonymousUser(error.credential)
      console.log('Merged user')
      // login and merged successful so redirect to return url
      this.router.navigateByUrl(this.returnUrl);
    }else{
      console.error('errorCallback:'+JSON.stringify(error));
    }
  }
}
