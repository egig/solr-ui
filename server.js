const path = require('path');
// /collection/schema/fields
const express = require('express');
const axios = require('axios');
const querystring = require("querystring");

const app = express();

app.use(express.static(__dirname + '/src/reactjs/build'));



app.get('/select', (req,res ) => {

	(async function () {

		try {

			let queryObj = {
				inden: "on",
				q: "*:*",
				wt: "json"
			};

			let qo = Object.assign({}, queryObj, req.query);
			let qs = querystring.stringify(qo);
			let r = await axios.get(`http://localhost:8983/solr/collection1/select?${qs}`);
			res.send(r.data);

		} catch (e) {
			console.log(e);
			res.status(500).send(e.message);
		}

	})();

});

app.get('/fields', (req, res) => {
	
	(async function () {

		try {

			let r = await axios.get("http://localhost:8983/solr/collection1/schema/fields")
			res.send(r.data);

		} catch (e) {
			console.log(e);
			res.status(500).send(e.message);
		}

	})();

});


app.get("/ping", (req, res) => {
	res.send("pong");
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, 'src/reactjs/build', 'index.html'));
});


app.listen(8080, () => {
	console.log("App running...");
});