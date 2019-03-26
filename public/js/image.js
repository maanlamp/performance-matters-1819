export default function replaceMinifiedImages () {
	document
		.querySelectorAll("img[src*='.min']")
		.forEach(img => {
			const prevSrc = img.src;
			const replacement = new Image();

			replacement.src = prevSrc.replace(/\.min/, "");
			replacement.addEventListener("load", () => {
				img.src = replacement.src;
			});
			replacement.addEventListener("error", () => {
				console.warn(`Couldn't fetch higher res version of ${prevSrc}.`);
			});
		});
};