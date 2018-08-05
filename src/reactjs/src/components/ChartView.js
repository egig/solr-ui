import React, { Component } from 'react';
import "react-table/react-table.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Chart from 'chart.js'

class ChartView extends Component {

	componentDidUpdate() {

		if(this.props.chartConfig) {
			let myChart = new Chart(this.chart, this.props.chartConfig);
		}
	}


	componentDidMount() {
		if(this.props.chartConfig) {
			let myChart = new Chart(this.chart, this.props.chartConfig);
		}
	}

	render() {

		return (
				<div className="col-4">
					<div className="card">
						<div className="card-body">
							<canvas id="myChart" width="400" height="400" ref={(chart) => { this.chart = chart }} />
						</div>
					</div>
				</div>
		);
	}
}

export default ChartView;
