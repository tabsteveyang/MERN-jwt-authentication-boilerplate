import React from 'react';
import { Router, Route, Switch, Link, NavLink } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import DashboardPage from '../components/DashboardPage';
import CreatePage from '../components/CreatePage';
import NotAllowPage from '../components/NotAllowPage';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <Route path="/" component={LoginPage} exact={true} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/admin/createusr" component={CreatePage} />
        <Route path="/notAllow" component={NotAllowPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
