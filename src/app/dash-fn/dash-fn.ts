import { Component } from '@angular/core';
import { FnFooter } from './fn-footer/fn-footer';

@Component({
  selector: 'app-dash-fn',
  standalone: true,
  imports: [FnFooter],
  templateUrl: './dash-fn.html',
  styleUrl: './dash-fn.css'
})
export class DashFn {}
