  import { Component } from '@angular/core';
  import { RouterOutlet } from '@angular/router';
  import { FnFooter } from '../fn-footer/fn-footer';
  import { Sidebar } from '../sidebar/sidebar';

  @Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [FnFooter, Sidebar, RouterOutlet],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css'
  })
  export class Dashboard {
    constructor() {}
  }
