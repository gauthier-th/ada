import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import './css/main.css';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
	return <Main />;
}

ReactDOM.render(<App />, document.getElementById('root'));