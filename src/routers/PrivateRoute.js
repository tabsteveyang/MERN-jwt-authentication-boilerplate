import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Navbar from '../components/Navbar';

export class PrivateRoute extends React.Component {
    constructor({
        auth,
        component: Component,
        privilige,
        ...rest
    }){
        //Check is authenticated or not:
        let isAuthenticated = '';
        //Check privilige:
    }
    
    render(){
        return (
          <Route {...rest} component={(props) => (
            isAuthenticated ? (
              <div className="container-fluid">
                <Navbar />
                <Component {...props} />
              </div>
            ) : (
                <Redirect to="/" />
              )
          )} />
        );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
