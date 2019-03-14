const express = require("express");
const app = express();
const API = require("oba-wrapper/node");
const port = 1337;

const api = new API({
	key: "1e19898c87464e239192c8bfe422f280"
});

// (async()=>{
// 	(await api.createStream("search/test{1}"))
// 		.pipe(res => console.log("results:", res))
// 		.catch(console.error);
// })();

app
	.set("view engine", "ejs")
	.use(express.static("public"));

app
	.get("/", (req, res) => {
		res.render("home.ejs", {
			filter: "home"
		})})
	.get("/:filter", (req, res) => {
		res.render("home.ejs", {
			filter: req.params.filter
		})})
	.post("/:filter", (req, res) => {
		const items = [
			{
				src: "https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=363086188&isbn=9789045207933&lid=&aut=&ti=&size=70",
				title: "De Test",
				description: "Malencia (17, ik-figuur) is uitgekozen om de jaarlijkse test te doen. Maar de test blijkt een stuk zwaarder dan ze had gedacht. Al snel vallen de eerste doden. Vanaf ca. 15 jaar."
			},
			{
				src: "https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=363086188&isbn=9789045207933&lid=&aut=&ti=&size=70",
				title: "De Test",
				description: "Malencia (17, ik-figuur) is uitgekozen om de jaarlijkse test te doen. Maar de test blijkt een stuk zwaarder dan ze had gedacht. Al snel vallen de eerste doden. Vanaf ca. 15 jaar."
			},
			{
				src: "https://cover.biblion.nl/coverlist.dll?doctype=morebutton&bibliotheek=oba&style=0&ppn=363086188&isbn=9789045207933&lid=&aut=&ti=&size=70",
				title: "De Test",
				description: "Malencia (17, ik-figuur) is uitgekozen om de jaarlijkse test te doen. Maar de test blijkt een stuk zwaarder dan ze had gedacht. Al snel vallen de eerste doden. Vanaf ca. 15 jaar."
			}
		];

		res.render("search.ejs", {
			filter: req.params.filter,
			items
		})});

app.listen(port, () => {
	console.log(`Running on port ${port}.`);
});