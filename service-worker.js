self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('tm-app-cache-v08').then(function(cache) {
            return cache.addAll([
                './',
                'index.html',
                'manifest.json',
                'css/styles.css',
                'js/main.js'
            ]);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});