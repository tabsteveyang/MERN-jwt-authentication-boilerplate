import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import CreatePage from '../components/CreatePage';
import LoginPage from '../components/LoginPage';
import PublicRoute from './PublicRoute';
//import PrivateRoute from './PrivateRoute';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginPage} exact={true} />
        <Route path="/createusr" component={CreatePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);
        //<PrivateRoute path="/dashboard" component={DashboardPage} />

export default AppRouter;
