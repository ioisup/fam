import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-headerless-layout',
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class HeaderlessLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
