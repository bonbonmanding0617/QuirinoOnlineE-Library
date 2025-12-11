// Performance Optimization Guide for Quirino Online Library

// 1. LAZY LOADING FOR IMAGES
// Add in HTML: <img src="image.jpg" loading="lazy" alt="description">
// Or use JavaScript Intersection Observer:

function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// 2. DEBOUNCE AND THROTTLE FOR EVENT HANDLERS
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage: Apply to search, scroll, resize events
const handleSearch = debounce((query) => {
    advancedSearch(query);
}, 300);

const handleScroll = throttle(() => {
    checkIfLoadMore();
}, 1000);

// 3. CACHING AND LOCAL STORAGE OPTIMIZATION
class CacheManager {
    static set(key, value, expirationMinutes = 60) {
        const data = {
            value: value,
            timestamp: Date.now(),
            expiration: expirationMinutes * 60 * 1000
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(data));
    }
    
    static get(key) {
        const cached = localStorage.getItem(`cache_${key}`);
        if (!cached) return null;
        
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp > data.expiration) {
            localStorage.removeItem(`cache_${key}`);
            return null;
        }
        return data.value;
    }
    
    static clear(key) {
        localStorage.removeItem(`cache_${key}`);
    }
    
    static clearAll() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Usage
const cachedBooks = CacheManager.get('books');
if (!cachedBooks) {
    const books = loadBooksData();
    CacheManager.set('books', books, 30); // 30 minute cache
}

// 4. CODE SPLITTING AND LAZY LOADING MODULES
async function loadDashboardModules() {
    const modules = {
        charts: import('./modules/charts.js'),
        analytics: import('./modules/analytics.js'),
        reports: import('./modules/reports.js')
    };
    
    return Promise.all(Object.entries(modules).map(async ([name, module]) => {
        return [name, await module];
    }));
}

// 5. MINIMIZE REPAINTS AND REFLOWS
class BatchDOMUpdates {
    constructor() {
        this.updates = [];
    }
    
    add(element, property, value) {
        this.updates.push(() => {
            element.style[property] = value;
        });
    }
    
    execute() {
        // All updates happen in one batch
        requestAnimationFrame(() => {
            this.updates.forEach(update => update());
            this.updates = [];
        });
    }
}

// Usage
const batchUpdates = new BatchDOMUpdates();
document.querySelectorAll('.book-card').forEach((card, index) => {
    batchUpdates.add(card, 'opacity', '1');
    batchUpdates.add(card, 'transform', 'translateY(0)');
});
batchUpdates.execute();

// 6. OPTIMIZE DATA PROCESSING
// Use Web Workers for heavy computations
class DataProcessor {
    static processLargeDataset(data, callback) {
        const worker = new Worker('./js/workers/data-processor.js');
        worker.postMessage(data);
        worker.onmessage = (e) => {
            callback(e.data);
            worker.terminate();
        };
    }
}

// Worker file (js/workers/data-processor.js):
/*
self.onmessage = (e) => {
    const data = e.data;
    const processed = data.map(item => ({
        ...item,
        processed: true,
        timestamp: new Date().toISOString()
    }));
    self.postMessage(processed);
};
*/

// 7. OPTIMIZE NETWORK REQUESTS
class NetworkOptimizer {
    static async fetchWithCache(url, options = {}) {
        const cacheKey = `fetch_${url}`;
        const cached = CacheManager.get(cacheKey);
        
        if (cached && options.cache !== false) {
            return cached;
        }
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        CacheManager.set(cacheKey, data, options.cacheDuration || 30);
        return data;
    }
    
    static async fetchMultiple(urls) {
        // Batch multiple requests
        return Promise.all(urls.map(url => this.fetchWithCache(url)));
    }
}

// 8. MEMORY LEAK PREVENTION
class EventListenerManager {
    constructor() {
        this.listeners = [];
    }
    
    addEventListener(element, event, handler, options = false) {
        element.addEventListener(event, handler, options);
        this.listeners.push({ element, event, handler, options });
    }
    
    removeAllListeners() {
        this.listeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        this.listeners = [];
    }
}

// 9. OPTIMIZE LOOPS AND ITERATIONS
// Bad: Creating new objects in loops
// for (let i = 0; i < 1000; i++) {
//     const obj = new Object(); // Allocates memory
// }

// Good: Reuse objects
const obj = {};
for (let i = 0; i < 1000; i++) {
    obj.index = i;
    processObject(obj);
}

// Use Map instead of Object for frequent key changes
const cache = new Map();
cache.set('key1', 'value1');
cache.get('key1');

// 10. BUNDLE SIZE OPTIMIZATION
// Remove unused CSS and JavaScript
// Use minification in production
// Code splitting for different features
// Use tree-shaking to eliminate dead code

// 11. CRITICAL RENDERING PATH OPTIMIZATION
// 1. Minimize CSS blocking
// - Move CSS to inline or async load non-critical CSS
// 2. Defer JavaScript
// - Use async/defer attributes on scripts
// 3. Optimize images
// - Use WebP format with fallback
// - Use srcset for responsive images

function loadNonCriticalCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.media = 'print';
    link.onload = function() {
        this.media = 'all';
    };
    document.head.appendChild(link);
}

// 12. PERFORMANCE MONITORING
class PerformanceMonitor {
    static measureOperation(name, callback) {
        const start = performance.now();
        const result = callback();
        const duration = performance.now() - start;
        
        console.log(`${name} took ${duration.toFixed(2)}ms`);
        
        return result;
    }
    
    static logMetrics() {
        if (window.performance) {
            const metrics = {
                navigationTiming: performance.timing,
                navigationStart: performance.timing.navigationStart,
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart,
                resources: performance.getEntriesByType('resource')
            };
            
            console.table({
                'DOM Content Loaded': `${metrics.domContentLoaded}ms`,
                'Page Load Time': `${metrics.loadComplete}ms`,
                'Resource Count': metrics.resources.length
            });
        }
    }
    
    static reportWebVitals() {
        // Largest Contentful Paint (LCP)
        const paintEntries = performance.getEntriesByType('paint');
        console.log('Paint Entries:', paintEntries);
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`First Input Delay: ${entry.processingDuration}ms`);
            }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
    }
}

// 13. SERVICE WORKER FOR OFFLINE AND CACHING
// Create js/service-worker.js
/*
const CACHE_NAME = 'library-hub-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/js/utils.js',
    '/js/auth.js',
    '/index.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
*/

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./js/service-worker.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}

// 14. PERFORMANCE BEST PRACTICES
/*
✅ DO:
- Minimize HTTP requests by bundling files
- Use CDN for static assets
- Enable GZIP compression
- Minimize and uglify CSS/JS
- Optimize images (WebP, appropriate sizing)
- Use caching headers
- Implement lazy loading
- Use requestAnimationFrame for animations
- Batch DOM updates
- Use event delegation
- Optimize database queries
- Profile and monitor performance

❌ DON'T:
- Make synchronous XMLHttpRequest calls
- Block the main thread with heavy computations
- Create memory leaks with retained event listeners
- Use inefficient selectors in loops
- Load large libraries for small features
- Use global variables excessively
- Ignore mobile performance
- Skip compression
- Use outdated JavaScript patterns
- Ignore console warnings
*/

// 15. EXPORT AND USE IN OTHER FILES
window.CacheManager = CacheManager;
window.PerformanceMonitor = PerformanceMonitor;
window.NetworkOptimizer = NetworkOptimizer;
window.EventListenerManager = EventListenerManager;
window.BatchDOMUpdates = BatchDOMUpdates;
window.initLazyLoading = initLazyLoading;
window.debounce = debounce;
window.throttle = throttle;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    PerformanceMonitor.logMetrics();
});

// Log performance before unload
window.addEventListener('beforeunload', () => {
    PerformanceMonitor.reportWebVitals();
});
