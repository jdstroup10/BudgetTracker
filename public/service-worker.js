//Boiler plate code

const FILES_TO_CACHE = ["/", "index.html","/icons/icon-192x192.png","/icons/icon-512x512.png", "db.js", "index.js", "styles.css","manifest.webmanifest"];
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


//Install and register service worker

self.addEventListener('install', function(evt) {
    evt.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );

    self.skipWaiting();
  });

  //Activate service worker and remove old data from cache

  self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );

    self.clients.claim();
  });

//Let service worker intercept network requests

self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
  }
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
        return response || fetch(evt.request);
    })
);
//evt.respondWith(
  //  caches.open(CACHE_NAME).then(cache => {
    //  return cache.match(evt.request).then(response => {
      //  return response || fetch(evt.request);
      //});
    //})
  //);

});