self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('chat-app-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/script.js',
                '/node_modules/emoji-picker-element/index.js', // Adjust the path accordingly
                '/icon.png' // Adjust the path accordingly
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
