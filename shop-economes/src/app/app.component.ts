import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';  // Cần thêm RouterModule

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],  // Thêm RouterModule vào imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shop-economes';
}
