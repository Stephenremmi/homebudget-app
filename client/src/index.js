import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { CookiesProvider } from 'react-cookie';
import './index.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
// import withAuth from "./withAuth";
import Dashboard from "./pages/Dashboard";
import { Provider } from 'react-redux';
import store from './store/store';

ReactDOM.render(
  <Provider store={store}>
    {/* <CookiesProvider defaultSetOptions={{ path: '/' }}> */}
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route exact path="/dashboard" component={Dashboard} />


        </Switch>
      </Router>
    {/* </CookiesProvider> */}
  </Provider>,
  document.getElementById('root')
);
