self.addEventListener('install', () => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Optional: Handle offline caching here
});
