import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-head',
  template: ''
})
export class HeadComponent implements OnInit {
  @Input() title: string = 'Silver Shop';

  constructor(
    private titleService: Title, 
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`${this.title} | Silver Shop`);

    this.metaService.addTags([
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' },
      { name: 'author', content: 'Silver Shop' }
    ]);

    // Only add link tags in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.addLinkTag('shortcut icon', '/assets/app/images/nar-eys1.jpeg', 'image/x-icon');
      this.addLinkTag('preconnect', 'https://fonts.gstatic.com/');
      this.addLinkTag('stylesheet', 'https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600;700;800;900&display=swap');
      this.addLinkTag('stylesheet', 'https://fonts.googleapis.com/css2?family=Allura&display=swap');
    }
  }

  private addLinkTag(rel: string, href: string, type?: string) {
    const link: HTMLLinkElement = this.document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (type) link.type = type;
    this.document.head.appendChild(link);
  }
}