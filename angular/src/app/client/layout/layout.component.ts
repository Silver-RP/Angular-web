import { Component, OnInit, OnDestroy, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NotificationComponent } from '../components/common/notification/notification.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule, NotificationComponent],
  styleUrls: ['./layout.component.css'],
  standalone: true
})
export class LayoutComponent implements OnInit, OnDestroy {
  private scripts: string[] = [
    '/assets/app/js/plugins/jquery.min.js',
    '/assets/app/js/plugins/bootstrap.bundle.min.js',
    '/assets/app/js/plugins/bootstrap-slider.min.js',
    '/assets/app/js/plugins/countdown.js',
    '/assets/app/js/plugins/swiper.min.js',
    '/assets/app/js/theme.js'
  ];

  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadClientStyles();
      this.loadClientScripts();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.cleanupScripts();
    }
  }

  /** 🖌 Load các file CSS */
  private loadClientStyles() {
    const styles = [
      '/assets/app/css/plugins/swiper.min.css',
      '/assets/app/css/style.css',
      '/assets/app/css/custom.css'
    ];

    styles.forEach(styleUrl => {
      if (!this.document.querySelector(`link[href="${styleUrl}"]`)) {
        const link = this.renderer.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleUrl;
        this.renderer.appendChild(this.document.head, link);
      }
    });
  }

  /** 📜 Load các file JavaScript */
  private loadClientScripts() {
    this.scripts.forEach(scriptUrl => {
      if (!this.document.querySelector(`script[src="${scriptUrl}"]`)) {
        const script = this.renderer.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        this.renderer.appendChild(this.document.body, script);
      }
    });
  }

  private cleanupScripts() {
    this.scripts.forEach(scriptUrl => {
      const script = this.document.querySelector(`script[src="${scriptUrl}"]`);
      if (script) {
        script.remove();
      }
    });
  }
}
