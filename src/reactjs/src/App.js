import React, { Component } from 'react';
import './App.css';
import "react-table/react-table.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Link, Route } from 'react-router-dom'
import DataTable from './pages/DataTable'
import Dashboard2 from './pages/Dashboard2'

class App extends Component {

  render() {
	  return (
		  <div>
			  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				  <a className="navbar-brand" href="#">Solr UI</a>
				  <div className="collapse navbar-collapse" id="navbarNav">
					  <ul className="navbar-nav">
						  <li className="nav-item">
							  <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
						  </li>
						  <li className="nav-item">
							  <Link className="nav-link" to="/dashboard2">Dashboard2</Link>
						  </li>
						  <li className="nav-item">
							  <a className="nav-link" href="#">Pricing</a>
						  </li>
						  <li className="nav-item">
							  <a className="nav-link disabled" href="#">Disabled</a>
						  </li>
					  </ul>
				  </div>
			  </nav>
			  <div className="container">
				  <Route exact path="/" component={DataTable}/>
				  <Route exact path="/dashboard2" component={Dashboard2}/>
			  </div>
		  </div>
	  )
  }
}

export default App;
