import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core'; 
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'; 
import { AuthInterceptor } from './app/services/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(),
    importProvidersFrom(HttpClientModule), 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    ...appConfig.providers,

  ]
}).catch((err) => console.error(err));
