import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() currentView: string = 'users';
  @Output() viewChange = new EventEmitter<string>();

  navigateTo(view: string) {
    this.currentView = view;
    this.viewChange.emit(view);
  }
} 