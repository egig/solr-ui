const path = require('path');
// /collection/schema/fields
const express = require('express');
const axios = require('axios');
const querystring = require("querystring");
const config = require("./config.json");
const { doFQRequest, doFacetRequest } = require('./src/server/solrUtil');

const app = express();

app.use(express.static(__dirname + '/src/reactjs/build'));

// http://localhost:8983/solr/

app.get('/pages/:page_name', (req,res ) => {

	(async function () {

		try {

			let pageConfig = require(`./pages/${req.params.page_name}`);

			let charts = pageConfig.charts.map(c => {

				let datasets = [];
				c.data.datasets.map(ds => {

					let data_values;

					/// Get the actual data
					if(ds.qtype === "fq_count") {
						data_values = ds.q.map(q => {
							return doFQRequest(q, ds.qcollection).then(r=> {
								return r.data.response.numFound
							})
						});

						let p = Promise.all(data_values).then(r => {
							// Here we might want to add backgroudColor or border color

							let dataset = Object.assign({}, ds);
							dataset.data = r;
							return dataset;
						});

						datasets.push(p)
					}

					/// Get the actual data
					if(ds.qtype === "facet_count") {
						let p = doFacetRequest(ds.qfacet_field, ds.qcollection)
							.then(r => {
							let facets = r.data.facet_counts.facet_fields[ds.qfacet_field];
							let data = [];
							let labels = [];
							facets.map((f, i) => {
								if(i%2 === 0) {
									labels.push(f);
								} else {
									data.push(f);
								}
							});
							let dataset = Object.assign({}, ds);
							dataset.data = data;
							dataset.labels = labels;
							return dataset;
						});

						datasets.push(p)
					}

				});

				return Promise.all(datasets)
					.then(datasetsR => {

						let chart = Object.assign({}, c);
						// Get first dataset labels if there is any
						if(typeof datasetsR[0].labels !== 'undefined') {
							chart.data.labels = datasetsR[0].labels;
						}
						chart.data.datasets = datasetsR;

						return chart;
					})
			});

			let c = await Promise.all(charts);

			res.send({
				title: pageConfig.title,
				charts: c,
			});

		} catch (e) {
			console.log(e);
			res.status(500).send(e.message);
		}

	})();

});

app.get('/status', (req,res ) => {

	(async function () {

		try {

			let r = await axios.get(`${config.SOLR_BASE_URL}/admin/cores?action=STATUS&wt=json`);
			res.send(r.data);

		} catch (e) {
			console.log(e);
			res.status(500).send(e.message);
		}

	})();

})

app.get('/c/:collection/select', (req,res ) => {

	(async function () {

		try {

			let queryObj = {
				inden: "on",
				q: "*:*",
				wt: "json"
			};

			let qo = Object.assign({}, queryObj, req.query);
			let qs = querystring.stringify(qo);
			let r = await axios.get(`${config.SOLR_BASE_URL}/${req.params.collection}/select?${qs}`);
			res.send(r.data);

		} catch (e) {
			console.log(e);
			res.status(500).send(e.message);
		}

	})();

});

app.get('/c/:collection/fields', (req, res) => {
	
	(async function () {

		try {

			let r = await axios.get(`http://localhost:8983/solr/${req.params.collection}/schema/fields`);
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