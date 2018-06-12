import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export class PublicRoute extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {
            auth,
            component: Component,
            ...rest
        } = this.props;
        
        const isAuthenticated = false;

        return(
            <Route {...rest} component={(props) => (
                isAuthenticated ? (
                    <Redirect to="/dashboard" />
                ) : (
                    <Component {...props} />
                )
            )} />
        );
    }
}

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PublicRoute);
