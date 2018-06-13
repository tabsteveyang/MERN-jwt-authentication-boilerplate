import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { startCheckToken, logout, login } from '../actions/auth';
import { setStorage, getStorage, clearStorage } from '../helper/cookie';
import Navbar from '../components/Navbar';  //something that can only be shown after user login.
import NotAllowPage from '../components/NotAllowPage';

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
                              let {status, _id: uid, access, iat, name, email} = loginData;
                              this.props.login({status, uid, name, email, access, iat});
                          }
                      }else{
                          clearStorage('usrJwt');
                          this.props.logout();
                          return 'logout';
                      }
                  });
              }else{
                  //no -> remove reduxAuth.
                  clearStorage('usrJwt');
                  this.props.logout();
                  return 'logout';
              }
    
        //B. Check is privilige qualified:
            //parse the token and check the privilige.
            const privilige = loginData.access;
            if(accessRequire.length > 0){
                const checkRes = accessRequire.split(',').map((require) => {
                    if(!privilige[require])
                        return 'no_access';
                }).indexOf('no_access');
                if(checkRes !== -1)
                    return 'login';
            }

        return 'login_and_valid';     
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
    componentDidUpdate(){
        //to prevent keep calling componentDidUpdate while logging the user out.
        if(this.props.auth.status === 'logout'){
            this.props.history.push('/');
            return;
        }
        //Check is authenticated or not: (boolean)
        const { accessRequire = '' } = this.props;
        this.isAuthenticated = this.checkAuthState(accessRequire); 
    }
    componentWillMount(){
        //Check is authenticated or not: (boolean)
        const { accessRequire = '' } = this.props;
        this.isAuthenticated = this.checkAuthState(accessRequire); 
    }
    render(){
        const {
	    startCheckToken,  //just destruct it so that the ...rest part will not be contaminated.
	    auth,
	    component: Component,
	    accessRequire = '',
	    ...rest
	} = this.props;
console.log(this.isAuthenticated);        
        if(this.isAuthenticated === 'login_and_valid'){
console.log(87);        
            return (
                <Route {...rest} component={(props) => (
                    <div className="container-fluid">
                        <Navbar />
                        <Component {...props} />
                    </div>
                )} />
            );
        }else if(this.isAuthenticated === 'login'){
console.log(97);        
            return (
                <Route {...rest} component={(props) => (
                     <NotAllowPage />
                )} />
            );
        }else{
console.log(104);        
            return (
                <Route {...rest} component={(props) => (
                    <Redirect to="/" />
                )} />
            );
        }

        //return (
        //    <Route {...rest} component={(props) => (
        //        this.isAuthenticated ? (
        //            <div className="container-fluid">
        //                <Navbar />
        //                <Component {...props} />
        //            </div>
        //        ) : (
        //            <Redirect to="/" />
        //        )
        //    )} />
        //);
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
