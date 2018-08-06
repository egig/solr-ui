import React, { Component } from 'react';
import axios from 'axios'
import ReactTable from "react-table";
import "react-table/react-table.css";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js'

class DataTable extends Component {

	constructor(props) {
		super(props);
		this.state = {
			solrURL: "",
			collections: [],
			collectionName: null,
			selectedCollection: null,
			fields: [],
			data: [],
			pages: null,
			loading: true,
			selectedOption: [],
			fq: "",
			page: 0,
			pageSize: 10,
			numFound: 0
		}

		this.fetchData = this.fetchData.bind(this);
		this.refreshData = this.refreshData.bind(this);
		this.refreshField = this.refreshField.bind(this);
		this.loadCollection = this.loadCollection.bind(this);
	}

		refreshField() {
			axios.get(`/c/${this.state.collectionName}/fields`)
				.then(r => {

					this.setState({
						selectedOption: [],
						fields: r.data.fields
					})
				});
		}

		refreshData() {

			let {pageSize, page} = this.state;
			let fl = "*";

			if(!!this.state.selectedOption.length) {
				fl = this.state.selectedOption.map(o => o.value).join(",")
			}

			this.setState({ loading: true });

			let start = (pageSize * (page+1)) - pageSize;
			let params = {
				solr_url: this.state.solrURL,
				start,
				rows: pageSize,
				fl
			};

			if(this.state.fq.trim() !=="") {
				params.fq = this.state.fq
			}

			return axios.get(`/c/${this.state.collectionName}/select`, {
				params
			})
				.then(r => {

					this.setState({
						data: r.data.response.docs,
						pages: Math.ceil(r.data.response.numFound / pageSize),
						numFound: r.data.response.numFound,
						loading: false
					});
				})
		}


	fetchData(state, instance) {

		let {pageSize, page} = state;

		let fl = "*";

		if(!!this.state.selectedOption.length) {
			fl = this.state.selectedOption.map(o => o.value).join(",")
		}

		this.setState({ loading: true });

		let start = (pageSize * (page+1)) - pageSize;
		let params = {
			start,
			rows: pageSize,
			fl
		};

		if(this.state.fq.trim() !=="") {
			params.fq = this.state.fq
		}

		return axios.get(`/c/${this.state.collection}/select`, {
			params
		})
			.then(r => {

				this.setState({
					data: r.data.response.docs,
					pages: Math.ceil(r.data.response.numFound / pageSize),
					numFound: r.data.response.numFound,
					loading: false
				});
			})
	}

	loadCollection() {

		axios.get("/status", {
			params: {
				solr_url: this.state.solrURL
			}
		})
			.then(r => {

				let collections = [];
				for(let collection in r.data.status) {
					collections.push(r.data.status[collection])
				}

				this.setState({
					collections: collections,
					collectionName: collections[0].name
				})
			})
			.then(r => {
				axios.get(`/c/${this.state.collectionName}/fields`, {
					params: {
						solr_url: this.state.solrURL
					}
				})
					.then(r => {

						this.setState({
							fields: r.data.fields
						})
					});
			});
	}

	render() {

		let columns = this.state.fields.map(f => {
			return {
				Header: f.name,
				accessor: f.name,
				Cell: (rowInfo) => {
					if( typeof rowInfo.value == 'object') {
						return JSON.stringify(rowInfo.value);
					}

					return rowInfo.value;
				},
			}
		});

		if(!!this.state.selectedOption.length) {
			columns = this.state.selectedOption.map(o => {
				return {
					Header: o.label,
					accessor: o.value,
					Cell: (rowInfo) => {
						if( typeof rowInfo.value == 'object') {
							return JSON.stringify(rowInfo.value);
						}

						return rowInfo.value;
					},
				}
			});
		}

		let fields = this.state.fields.map(f => {
			return {
				label: f.name,
				value: f.name,
			}
		});

		let collectionOptions = this.state.collections.map(c => {
			return {
				label: c.name,
				value: c.name,
			}
		});

		return (
			<div className="row mt-4">
					<div className="col-3">
						<div className="card">
							<div className="card-body">
								<div className="mb-2">
									<label>Solr URL</label>
									<div>
								    <input className="form-control" onKeyUp={(e) => {

									    this.setState({
										    solrURL:e.target.value,
									    });
								    }} />
										<button className="btn btn-primary mt-2 bb-3" onClick={e => {
											this.loadCollection()
										}} >Load Collections</button>
									</div>
								</div>
								<div className="mb-2">
									<label>Select Collection</label>
									<Select
										value={this.state.selectedCollection}
										onChange={(selectedCollection) => {
											this.setState({
												selectedCollection,
												collectionName: selectedCollection.label,
											}, () => {
												this.refreshData();
												this.refreshField()
											});
										}}
										options={collectionOptions}
									/>
								</div>
								<div className="mb-2">
									<label>Filter Query</label>
									<div>
								    <textarea className="form-control" onKeyUp={(e) => {
									    this.setState({
										    fq:e.target.value,
									    }, () => {
										    this.refreshData();
									    });
								    }} />
									</div>
								</div>
								<label>Field List</label>
								<Select
									isMulti={true}
									value={this.state.selectedOption}
									onChange={(selectedOption) => {
										this.setState({ selectedOption });
										console.log(`Option selected:`, selectedOption);
									}}
									options={fields}
								/>
							</div>
						</div>
					</div>

				{!!this.state.selectedCollection &&
					<div className="col-9">
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">{this.state.collectionName} Found: {this.state.numFound}</h5>
								<ReactTable
									manual
									data={this.state.data}
									pages={this.state.pages}
									loading={this.state.loading}
									columns={columns}
									defaultPageSize={10}
									className="-striped -highlight"
									onFetchData={this.fetchData}
									onPageChange={(pageIndex) => { this.setState({page: pageIndex}) }}
									onPageSizeChange={(pageSize,pageIndex) => { this.setState({pageSize: pageSize}) }}
								/>
							</div>
						</div>
				</div>
				}
			</div>
		);
	}
}

export default DataTable;
