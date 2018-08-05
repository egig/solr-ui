import React, { Component } from 'react';
import "react-table/react-table.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js'
import axios from 'axios';
import ChartView from '../components/ChartView';

class BasePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			charts: []
		}
	}

	componentDidMount() {

		axios.get(`/pages/${this.props.match.params.page_name}`)
			.then(r => {
				this.setState({
					charts: r.data.charts
				})
			});
	}

	render() {

		return (
			<div className="row mt-4">
				{this.state.charts.map(chartConfig => {
					return <ChartView chartConfig={chartConfig} />
				})}
			</div>
		);
	}
}

export default BasePage;
