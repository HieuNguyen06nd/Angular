import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { HomeComponent } from './app/home/home.component';

const bootstrap = () => bootstrapApplication(HomeComponent, config);

export default bootstrap;
