import { Component, OnInit, OnDestroy, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NotificationComponent } from '../../client/components/common/notification/notification.component';
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, CommonModule, NotificationComponent, SidebarComponent],
  styleUrls: ['./layout.component.css'],
  standalone: true
})
export class LayoutComponent implements OnInit, OnDestroy {
  private scripts: string[] = [
      "/assets/admin/js/jquery.min.js",
      "/assets/admin/js/bootstrap.min.js",
      "/assets/admin/js/bootstrap-select.min.js",
      "/assets/admin/js/sweetalert.min.js",
      "/assets/admin/js/apexcharts/apexcharts.js",
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

  private loadClientStyles() {
    const styles = [
      '/assets/admin/css/animate.min.css',
      '/assets/admin/css/animation.css',
      '/assets/admin/css/bootstrap.css',
      '/assets/admin/css/bootstrap-select.min.css',
      '/assets/admin/css/style.css',
      '/assets/admin/css/custom.css',
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
