import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { startCheckToken, logout, login } from '../actions/auth';
import { setStorage, getStorage, clearStorage } from '../helper/cookie';
import Navbar from '../components/Navbar';  //something that can only be shown after user login.

export class PrivateRoute extends React.Component{
    constructor(props){
        super(props);
    }
    checkAuthState = (accessRequire='') => {
        //A. Check token:
              //is token exist?
              const token = getStorage('usrJwt');
              const loginData = this.decodeJwt(token);
              if(token && token !== '' && loginData !== ''){
                  //yes -> is it still valid?
                  this.props.startCheckToken(token).then((isValid) => {
                      if(isValid){
                          //recover the reduxAuth if not exist.
                          if(this.props.auth.status !== 'login'){
                              let {status, _id: uid, access, iat} = loginData;
                              this.props.login({status, uid, access, iat});
                          }
                      }else{
                          clearStorage('usrJwt');
                          this.props.logout();
                          return false;
                      }
                  });
              }else{
                  //no -> remove reduxAuth.
                  if(loginData === '')
                      clearStorage('usrJwt');
                  this.props.logout();
                  return false;
              }
    
        //B. Check is privilige qualified:
            //parse the token and check the privilige.
            const privilige = loginData.access;
            if(accessRequire.length > 0){
                accessRequire.split(',').map((require) => {
                    if(!privilige[require])
                        return false;
                });
            }

        return true;     
    };
    decodeJwt = (token) => {
        try{
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse(window.atob(base64));
        }catch(e){
            return '';
        }
    };
    render(){
        const {
	    startCheckToken,  //just destruct it so that the ...rest part will not be contaminated.
	    auth,
	    component: Component,
	    accessRequire = '',
	    ...rest
	} = this.props;

        //Check is authenticated or not: (boolean)
        const isAuthenticated = this.checkAuthState(accessRequire); 

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
const mapDispatchToProps = (dispatch) => ({
    startCheckToken: (token) => dispatch(startCheckToken(token)),
    login: (data) => dispatch(login(data)),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
