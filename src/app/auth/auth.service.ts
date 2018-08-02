import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators'
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore'
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from './user'

import * as firebase from 'firebase/app'

const userCollectionName:string='users'

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy{
  private subscriptions:Map<string,Subscription>=new Map<string,Subscription>()
  // private loggedIn = new BehaviorSubject<boolean>(false)
  private currentUser:User|null=null
  private userDocRef:AngularFirestoreDocument<User>;
  private user$:BehaviorSubject<User|null>= new BehaviorSubject<User|null>(this.currentUser)
  get user():Observable<User|null> {return this.user$.asObservable()}
  get isLoggedIn():Observable<boolean> {
    return this.afAuth.authState.pipe(
      map((user:firebase.User)=>{return (user)?(!user.isAnonymous):false})
    )
  }

  constructor(
    private router: Router,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    this.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    this.subscriptions.set('authState',afAuth.authState.pipe(
      tap((user:firebase.User)=>{this.setCurrentUser(user)}),
      tap((user:firebase.User)=>{this.changeUser(user)})
    ).subscribe())
  }

  ngOnDestroy(){
    this.subscriptions.forEach(x=>x.unsubscribe())
  }

  private async setPersistence(persistance:firebase.auth.Auth.Persistence){
    try{
      await this.afAuth.auth.setPersistence(persistance)
      console.log('Set persistence to LOCAL')
    }catch(error){
      console.error(error)
    }
  }
  private setCurrentUser(user:firebase.User){
    if(user){
      if((!(this.currentUser))||(this.currentUser.uid!=user.uid)){
        if (this.subscriptions.has('userDocRef')){
          this.subscriptions.get('userDocRef').unsubscribe()
          this.subscriptions.delete('userDocRef')
        }
        if(this.afAuth.auth.currentUser){
          this.userDocRef = this.afs.doc(`${userCollectionName}/${this.afAuth.auth.currentUser.uid}`)
          console.log('Assign new userDocRef')
          this.subscriptions.set('userDocRef',this.userDocRef.valueChanges().pipe(
            tap(user=>{
              this.currentUser=user
              this.user$.next(this.currentUser)
            })
          ).subscribe())
        }else{
          this.user$.next(null)
        }
      }
    }else{
      if (this.subscriptions.has('userDocRef')){
        this.subscriptions.get('userDocRef').unsubscribe()
        this.subscriptions.delete('userDocRef')
      }
      this.currentUser=user
      this.user$.next(this.currentUser)
      this.userDocRef=null
    }
  }

  private async changeUser(user:firebase.User){
    if(user){
      if((this.currentUser)&&(this.currentUser.uid==user.uid)){
        //TODO compare and update currentUser
        if('email' in user){ this.currentUser.email=user.email }
        else if('email' in this.currentUser){ delete this.currentUser.email }
        if('displayName' in user){ this.currentUser.displayName=user.displayName }
        else if('displayName' in this.currentUser){ delete this.currentUser.displayName }
        if('photoURL' in user){ this.currentUser.photoURL=user.photoURL }
        else if('photoURL' in this.currentUser){ delete this.currentUser.photoURL }
      }else{
        this.currentUser={ uid:user.uid }
        if('email' in user){ this.currentUser.email=user.email }
        if('displayName' in user){ this.currentUser.displayName=user.displayName }
        if('photoURL' in user){ this.currentUser.photoURL=user.photoURL }
        //TODO update currentUser
      }
      try{
        await this.userDocRef.set(this.currentUser,{merge:true})
      }catch(error){
        console.error(error)
      }
      // this.user$.next(this.currentUser)
    }else{
      this.currentUser=null
    }
  }

  async mergeAnonymousUser(credential){
    const anonymous:User = this.currentUser
    const afAnonymous:firebase.User = this.afAuth.auth.currentUser
    if((afAnonymous)&&(afAnonymous.isAnonymous)){
      try{
        await this.userDocRef.delete() // delete anonymous user's data in firestore
        console.log("Document was successfully deleted!");
        await afAnonymous.delete() // signs out and delete anonymous user in firebase
        console.log("Anonymous was successfully signed out and deleted!");
        const user:firebase.User = await this.afAuth.auth.signInWithCredential(credential)
        console.log("Signed in to new user: "+user.uid);
        if((user.uid==this.currentUser.uid)&&(this.currentUser.uid==this.afAuth.auth.currentUser.uid)){
          this.userDocRef.update({merged:('merged' in this.currentUser)?[anonymous].concat(this.currentUser.merged):[anonymous]})
          // await this.userDocRef.update({merged:('merged' in this.currentUser)?[anonymous].concat(this.currentUser.merged):[anonymous]})
          // console.log('Updated user data')
        }else{
          console.error('Cannot update user')
          //TODO retrive new user data from firestore and merge data into it
        }
      }catch(error){
        if(error.code=='auth/requires-recent-login'){
          console.error('auth/requires-recent-login error please sign-in again')
        }else{
          console.error(error);

        }
      }
    }
  }

  async logout(){
    if(this.afAuth.auth.currentUser){
      if(this.afAuth.auth.currentUser.isAnonymous){
        //TODO do nothing
      }else{
        // signout the current user and sign in as anonymous
        try{
          await this.afAuth.auth.signOut()
          const userCredential:firebase.auth.UserCredential = await this.afAuth.auth.signInAnonymously()
          console.log('Anonymously sign in as: '+userCredential.user.uid)
          // this.loggedIn.next(false);
          // this.router.navigate(['/login']);
        }catch(error){
          if(error){
            if (error.code === 'auth/operation-not-allowed') {
              alert('You must enable Anonymous auth in the Firebase Console.');
            } else {
              console.error(error);
            }
          }else{
            console.error(error)
          }
        }
      }
    }else{
      //TODO do nothing
    }
  }
}
