import { Component, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet, Router  } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, MatButtonModule, RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { 
  isAdminPage = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.isAdminPage = this.router.url.startsWith('/admin');
    });
  }
}
