import { NgZone, ɵNoopNgZone } from '@angular/core'; // Make sure to import NgZone

import { AppComponent as App } from './app/app';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// Bootstrap with no Zone.js
bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    { provide: NgZone, useClass: ɵNoopNgZone } // ✅ This is the key line
  ]
}).catch(err => console.error(err));
