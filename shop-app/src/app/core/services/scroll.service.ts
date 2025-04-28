import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  scrollToTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0); // Đảm bảo thực hiện cuộn sau khi tất cả đã render
    }
  }
}
