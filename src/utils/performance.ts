// Performance optimization utilities for lazy loading and image handling

/**
 * Lazy load an element when it comes into view
 * @param selector CSS selector for the element to lazy load
 * @param threshold Visibility threshold (0-1)
 */
export const lazyLoadElement = (selector: string, threshold = 0.1) => {
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported');
    return;
  }

  const elements = document.querySelectorAll(selector);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLImageElement | HTMLIFrameElement;
        
        if (element.dataset.src) {
          element.src = element.dataset.src;
          delete element.dataset.src;
        }
        if (element.dataset.srcset && 'srcset' in element) {
          (element as HTMLImageElement).srcset = element.dataset.srcset;
          delete element.dataset.srcset;
        }
        
        observer.unobserve(element);
      }
    });
  }, { threshold });

  elements.forEach((el) => observer.observe(el));
};

/**
 * Preload resources for faster loading
 * @param urls Array of URLs to preload
 */
export const preloadResources = (urls: string[]) => {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'fetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

/**
 * Convert image URL to WebP format (if available)
 * @param url Original image URL
 * @returns WebP URL or original URL
 */
export const getWebPImage = (url: string): string => {
  // This is a placeholder - actual implementation would need WebP versions
  // For now, return the original URL
  return url;
};

/**
 * Get responsive image srcset for different screen sizes
 * @param basePath Base path without extension
 * @returns srcset string for lazy loading
 */
export const getResponsiveImageSrcset = (basePath: string): string => {
  return `${basePath}-sm.webp 480w, ${basePath}-md.webp 768w, ${basePath}-lg.webp 1024w, ${basePath}-xl.webp 1280w`;
};



/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  // Core Web Vitals monitoring
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', (lastEntry as any).renderTime || (lastEntry as any).loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP observer not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('FID:', (entry as any).processingDuration);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID observer not supported');
    }

    // Cumulative Layout Shift
    try {
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log('CLS:', (entry as any).value);
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS observer not supported');
    }
  }
};
