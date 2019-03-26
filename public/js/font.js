export function loadFont (url) {
	return fetch(url)
		.then(body => body.text())
		.then(css => css
			.replace(/^}$/gm,
				"font-display:swap;}"));
}

export function attachFontToDocument (css) {
	const style = document
		.createElement("style");

	style.appendChild(document
		.createTextNode(css));
	document
		.querySelector("head")
		.appendChild(style);
}

export function broadcastFontLoaded (fontname) {
	document
		.querySelector("body")
		.classList
		.add(`font-loaded-${fontname
			.toLowerCase()}`);
}