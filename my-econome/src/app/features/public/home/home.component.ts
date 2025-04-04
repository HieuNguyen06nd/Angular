import { Component } from '@angular/core';
import {FooterComponent } from '../com/footer/footer.component';
import {HeaderComponent } from '../com/header/header.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
