importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

var urlsToCache = [ 'index.html',
                    'favicon.ico',  
                    'manifest.json' ];

self.addEventListener( 'install', function(){
  return self.skipWaiting( );
});

self.addEventListener( 'activate', function( event ) {
  event.waitUntil(
    caches.open('v1')
      .then( function( cache ) {
        return cache.addAll( urlsToCache );
      })
      .then( function() {
        return self.clients.claim() ;
      }) 
      .catch( function(e) {
        console.log("Error handling cache", e);
      })
  );
});

self.addEventListener( 'fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  ).then( (resp) => {
    return caches.open('v1').then( (cache) => {
      cache.put( event.request, resp.clone( ));
        return resp;
    });
  });
});

