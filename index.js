const express = require("express");
const app = express();
const compression = require("compression");
const API = require("oba-wrapper/node");
const encodeErrorHTML = require("escape-html");
const port = 1337;
const year = 31557600;

const api = new API({
	key: "1e19898c87464e239192c8bfe422f280"
});

function optionalChain (source, rest, alternative) {
	//support obj[property] notation in rest
	const chain = rest.split(/\./);
	let obj = source[chain.shift()];
	try {
		for (const property of chain) obj = obj[property];
		return (obj !== undefined)
			? obj
			: alternative;
	} catch {
		return alternative;
	}
}

app
	.set("view engine", "ejs")
	.use(compression())
	.use(express.static("public", {maxAge: year})); //Last middleware

app
	.get("/", (req, res) => {
		res.render("home.ejs", {
			filter: "home"
		})})
	.get("/:filter", (req, res) => {
		res.render("home.ejs", {
			filter: req.params.filter
		})})
	.post("/:filter", async (req, res) => {
		const items = await api.createStream("search/test{15}")
			.then(stream => stream.all())
			.then(results => results.map(result => {
				return result.map(item => ({
					src: item.coverimages[0].coverimage[0]._,
					title: item.titles[0]["short-title"][0]._ || "Geen titel.",
					description: optionalChain(item, "summaries.0.summary.0._", "Geen beschrijving.")
				}))}))
			.then(arrayOfArrays => arrayOfArrays.flat())
			.catch(err => res.render("search.ejs", {
				filter: req.params.filter,
				items: [{
					src: "images/noContent.png",
					title: "Error!",
					description: `<pre>${encodeErrorHTML(err.stack || err)}</pre>`
				}]}));

		res.render("search.ejs", {
			filter: req.params.filter,
			items
		})});

app.listen(port, () => {
	console.log(`Running on port ${port}.`);
});