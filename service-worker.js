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
    caches.open( 'name_your_cache_container' )
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

self.addEventListener( 'fetch', function( event ) {
  event.respondWith(
    caches.match( event.request )
      .then(function( response ) {
        if ( response ) {
          return response;
        }
        return fetch( event.request );
      })
      .then( function( resp ) {
        return caches.open( 'name_your_cache_container' )
          .then( function( cache ) {
            cache.put( event.request, resp.clone( ));
              return resp;
          });
      });
});

