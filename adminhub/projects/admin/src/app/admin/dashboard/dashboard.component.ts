// projects/admin/src/app/dashboard/dashboard.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="dashboard-container">
      <h2>Dashboard Overview</h2>
      <div class="stats-grid">
        <!-- Content -->
      </div>
    </div>
  `,
  styles: [
    `
    .dashboard-container {
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      
      h2 {
        color: var(--primary-color);
        margin-bottom: 1.5rem;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
    `
  ]
})
export class DashboardComponent {}