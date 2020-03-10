importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

console.log('Hello from service-worker.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  console.log(`cache name of precache is ${workbox.core.cacheNames.precache}`)
  console.log(`cache name of runtime is ${workbox.core.cacheNames.runtime}`)
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.core.skipWaiting();
workbox.core.clientsClaim();

const processedManifest = (self.__WB_MANIFEST || []).map(entry => {
  // return some transformation
});

workbox.precaching.precacheAndRoute(processedManifest);
