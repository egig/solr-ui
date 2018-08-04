import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import ReactTable from "react-table";
import "react-table/react-table.css";
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			fields: [],
			data: [],
			pages: null,
			loading: true,
			selectedOption: [],
		}

		this.fetchData = this.fetchData.bind(this);
	}

	fetchData(state, instance) {

		let {pageSize, page} = state;

		let fl = "*";

		if(!!this.state.selectedOption.length) {
			fl = this.state.selectedOption.map(o => o.value).join(",")
		}

		this.setState({ loading: true });

		let start = (pageSize * (page+1)) - pageSize;
		return axios.get("/select", {
			params: {
				start,
				rows: pageSize,
				fl
			}
		})
			.then(r => {
				return {
					pages: Math.ceil(r.data.response.numFound / pageSize),
					data: r.data.response.docs
				}
			}).then(res => {
			// Now just get the rows of data to your React Table (and update anything else like total pages or loading)
			this.setState({
				data: res.data,
				pages: res.pages,
				loading: false
			});
		});
	}


	componentDidMount() {
		axios.get("/fields")
			.then(r => {

				this.setState({
					fields: r.data.fields
				})
			});

		// axios.get("/select?sort=_version_ desc")
		// 	.then(r => {
		//
		// 		this.setState({
		// 			docs: r.data.response.docs,
		// 			pages: Math.ceil(r.data.response.numFound /10),
		// 			loading: false
		// 		})
		// 	});
	}

  render() {

		let columns = this.state.fields.map(f => {
			return {
				Header: f.name,
				accessor: f.name,
				Cell: (rowInfo) => {
					console.log(rowInfo.value)
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
					  console.log(rowInfo.value)
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

    return (
    	<div>
		    <Select
			    isMulti={true}
			    value={this.state.selectedOption}
			    onChange={(selectedOption) => {
				    this.setState({ selectedOption });
				    console.log(`Option selected:`, selectedOption);
			    }}
			    options={fields}
		    />

		    <ReactTable
			    manual
			    data={this.state.data}
			    pages={this.state.pages}
			    loading={this.state.loading}
			    columns={columns}
			    defaultPageSize={10}
			    className="-striped -highlight"
			    onFetchData={this.fetchData}
		    />
	    </div>
    );
  }
}

export default App;
