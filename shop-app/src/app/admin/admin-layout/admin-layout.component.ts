import { Component, ViewEncapsulation  } from '@angular/core';
import {SidebarComponent} from '../sidebar/sidebar.component'
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css',
  encapsulation: ViewEncapsulation.ShadowDom  
})
export class AdminLayoutComponent {

}
