import React, { Component } from 'react';
import "react-table/react-table.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js'
import axios from 'axios';

class BasePage extends Component {

	constructor(props) {
		super(props);

		this.state = {
			chartConfig: null
		}
	}


	componentDidUpdate() {

		if(this.state.chartConfig) {
			let myChart = new Chart(this.chart, this.state.chartConfig);
		}
	}


	componentDidMount() {

		axios.get(`/pages/${this.props.match.params.page_name}`)
			.then(r => {
				this.setState({
					chartConfig: r.data.charts[0]
				})
			});
	}

	render() {

		return (
			<div>
				<div className="row mt-4 mb-4">
					<div className="col-4">
						<canvas id="myChart" width="400" height="400" ref={(chart) => { this.chart = chart }} />
					</div>
				</div>
			</div>
		);
	}
}

export default BasePage;
