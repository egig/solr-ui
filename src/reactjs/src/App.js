import React, { Component } from 'react';
import './App.css';
import "react-table/react-table.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route } from 'react-router-dom';
import DataTable from './pages/DataTable';
import Dashboard2 from './pages/Dashboard2';
import BasePage from './pages/BasePage';

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
							  <Link className="nav-link" to="/pages/dashboard">Dashboard</Link>
						  </li>
					  </ul>
				  </div>
			  </nav>
			  <div className="container-fluid">
				  <Route exact path="/" component={DataTable}/>
				  <Route exact path="/pages/:page_name" component={BasePage}/>
			  </div>
		  </div>
	  )
  }
}

export default App;
