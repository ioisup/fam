import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service'
import { Observable } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    '.header-icon {padding: 0 14px;}',
    '.header-spacer {flex: 1 1 auto;}'
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn:Observable<boolean>
  constructor(
    private auth:AuthService,
    private router:Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.isLoggedIn=this.auth.isLoggedIn
  }

  ngOnDestroy(){
    this.isLoggedIn=null
  }
  async onLogout(){
    await this.auth.logout()
    this.router.navigate(['./'],{ relativeTo: this.route })
  }
}
