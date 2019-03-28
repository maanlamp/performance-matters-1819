const cachename = "v1";

self.addEventListener("install", () =>
	console.log("SW: Installing"));

self.addEventListener("activate", event => {
	console.log("SW: Clearing old caches");
	event.waitUntil(caches
		.keys()
		.then(names => Promise.all(names
			.map(name => (name !== cachename)
				? caches.delete(name)
				: null))));
});

self.addEventListener("fetch", event => {
	event.respondWith(
		fetch(event.request)
			.then(res => {
				const clone = res.clone();
				caches
					.open(cachename)
					.then(cache => cache.put(event.request, clone));
				return res;
			}).catch(() => caches.match(event.request)));
});