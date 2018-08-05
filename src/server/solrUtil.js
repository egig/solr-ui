const axios = require("axios");
const querystring = require("querystring");
const config = require("../../config.json");

const doFQRequest = function (fq, collection) {
	let queryObj = {
		inden: "on",
		q: "*:*",
		wt: "json",
		fq: fq
	};

	let qo = Object.assign({}, queryObj);
	let qs = querystring.stringify(qo);
	return axios.get(`${config.SOLR_BASE_URL}/${collection}/select?${qs}`);
}

const doFacetRequest = function (facetField, collection) {
	let queryObj = {
		inden: "on",
		facet: "on",
		q: "*:*",
		wt: "json",
		"facet.field": facetField
	};

	let qo = Object.assign({}, queryObj);
	let qs = querystring.stringify(qo);
	return axios.get(`${config.SOLR_BASE_URL}/${collection}/select?${qs}`);
}


module.exports = {
	doFQRequest,
	doFacetRequest
}