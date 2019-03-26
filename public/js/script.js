import { API } from "../oba-wrapper/js/index.js";
import { clearElement, repeat } from "./helpers.js";
import { resultsToDivs, render } from "./render.js";
import { loadFont, attachFontToDocument, broadcastFontLoaded } from "./font.js";
import replaceMinifiedImages from "./image.js";

const api = new API({
	key: "1e19898c87464e239192c8bfe422f280"
});

void function autosuggestOnInput () {
	const input = document.querySelector("input");
	const autosuggest = document.querySelector("#autosuggest");
	let lastValue;

	input.addEventListener("input", () => {
		clearTimeout(window.autoSuggestTimeout);

		window.autoSuggestTimeout = setTimeout(async () => {
			if (input.value !== lastValue) await clearElement(autosuggest);
			if (input.value === "") return autosuggest.classList.remove("show");
			if (input.value === lastValue
				&& autosuggest.classList.contains("show")) return;

			autosuggest.classList.add("show");
			lastValue = input.value;
			(await api.createStream(`search/${input.value}{3}`)
					.catch(() => noContent(autosuggest)))
				.pipe(async results => {
					await clearElement(autosuggest); //THIS REMOVES EXTRA SUGGESTIONS WHEN YOU TYPE TOO SLOW
					//SHOULD REALLY PREVENT/CANCEL REQUESTS IN THE FIRST PLACE INSTEAD OF
					//REMOVING THEM IMMEDIATELY
					return resultsToDivs(results)
						.forEach((div, i) => {
							div.addEventListener("click", () => {
								search(input.value);
								input.value = div.querySelector("h2").innerText;
							});
							div.classList.add("suggestion", "fadein");
							div.style.setProperty("animation-delay", `${i * 100}ms`)
							autosuggest.append(div);
						});
				});
			//Sort results based on relevancy, use helpers.js>compareStrings()?
		}, 450);
	});
}();

void function hideAutosuggestOnClickAnywhere () {
	const autosuggest = document.querySelector("#autosuggest");
	const ignorables = Array.from(document.querySelectorAll("#search input, #autosuggest"));

	document.body.addEventListener("click", event => {
		if (ignorables.includes(event.target)
			|| event.target.classList.contains("suggestion")) return;

		autosuggest.classList.remove("show");
	});
}();

void function searchListener () {
	const input = document.querySelector("input");
	const form = document.querySelector("form");

	form.addEventListener("submit", async event => {
		event.preventDefault();
		search(input.value);
	});
}();

void function filterListener () {
	const filter = document.querySelector("#filter");

	filter.addEventListener("click", event => {
		event.preventDefault();
		console.log("Filtering...");
	});
}();

async function search (query) {
	clearTimeout(window.autoSuggestTimeout);
	const autosuggest = document.querySelector("#autosuggest");
	const aside = document.querySelector("aside");
	const main = document.querySelector("main");
	const placeholders = 5;
	const builtQuery = query
		+ window.location.hash
			.replace(/^#/, "&");

	if (aside.classList.contains("show")) {
		aside.classList.remove("show");
		aside.classList.add("fadeout");
	}
	await clearElement(main);
	repeat(placeholders, i => {
		const container = render("div.fadein.itemContainer");
		const div = render("div.card"); //Separate renders because of style.setProperty

		container.style.setProperty("animation-delay", `${i * 50}ms`);
		div.style.setProperty("animation-delay", `${i * 50}ms`);
		container.append(div);
		main.append(container);
	});
	(await api.createStream(`search/${builtQuery}{10}`)
			.catch(() => noContent(main)))
		.pipe(results => {
			return resultsToDivs(results, { textLength: 225 })
				.map((div, i) => {
					div.classList.add("card", "fadein");
					div.style.setProperty("animation-delay", `${i * 150}ms`);
					main.append(div);
				});
		})
		.all()
		.finally(() => {
			repeat(placeholders,
				() => main.firstChild.remove());

			aside.classList.add("show");
		});
}

void function changeActiveSearchTypeOnClick () {
	const input = document.querySelector("input");
	const anchors = Array.from(document.querySelectorAll("#types a"));

	anchors.forEach(anchor => {
		anchor.href = (/\/all|\/other/.test(anchor.href))
			? "#"
			: `#facet=(${anchor.href.substring(anchor.href.lastIndexOf("/")).match(/\/(\w+)$/)[1]})`;
		anchor.addEventListener("click", event => {
			anchors.forEach(anchor => anchor.className = "");
			event.target.classList.add("link-active");
			if (input.value !== "") setTimeout(() => search(input.value), 0);
			//idk why but waiting for next event loop tick is required
		});
	});
}();

void function registerClearButtonBehaviour () {
	const clear = document.querySelector("#clear");
	const input = document.querySelector("input");

	clear.addEventListener("click", () => {
		autosuggest.classList.remove("show");
		clear.classList.remove("show");
		input.value = "";
	});
	input.addEventListener("input", () => {
		if (input.value === "") return clear.classList.remove("show");

		clear.classList.add("show");
	});
}();

function noContent (container) {
	const div = render(`
		div.noContent
			> p "Geen resultaten gevonden."`);

	container.append(div);

	return {
		pipe(){return {all(){return Promise.reject()}}}
	}; //Shitty way of supressing "no property pipe/all on undefined" if caught
}

void function lazyLoadFonts () {
	loadFont("https://fonts.googleapis.com/css?family=Lato:400,700")
		.then(attachFontToDocument)
		.then(() => broadcastFontLoaded("Lato"));
}();

setTimeout(replaceMinifiedImages, 0); //next tick to stop page-loader-spinner-boy

//--** Should have **--//
//Other media types have other place for their image //THE DATA IS TOO MESSY :(((

//--** Could have **--//
//Make filtering work

//--** Would have **--//
//Highlights / staff choice / meest geleend
//custom scrollbar