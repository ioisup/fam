import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-layout',
  template: `
  <app-header></app-header>
  <router-outlet></router-outlet>
  `,
  styles: []
})
export class HeaderLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
