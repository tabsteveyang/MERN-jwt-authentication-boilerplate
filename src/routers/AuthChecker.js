import React from 'react';
import { connect } from 'react-redux';
import { startCheckToken, logout, login } from '../actions/auth';
import { setStorage, getStorage, clearStorage } from '../helpers/cookie';

export class AuthChecker extends React.Component{
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
    startCheckAuthState = () => {
        //Check is authenticated or not: (boolean)
        const { accessRequire = '', isPublic = 'none', history } = this.props;
        const isAuthenticated = this.checkAuthState(accessRequire); 
        if(isPublic === true){
            if(isAuthenticated === 'login_and_valid' || isAuthenticated === 'login'){
                history.push('/dashboard');
            }else if(isAuthenticated === 'logout'){
                history.push('/');
            }
        }else if(isPublic === false){
            if(isAuthenticated === 'login_and_valid'){
                //pass so do nothing
            }else if(isAuthenticated === 'login'){
                history.push('/notAllow');
            }else if(isAuthenticated === 'logout'){
                history.push('/');
            }
        }
    };
    componentDidUpdate(){
        const { delay = 0 } = this.props;
        //setTimeout to make sure the check will not run before the cookie is created or redux is updated.
        setTimeout(() => {
            //to prevent keep calling componentDidUpdate while logging the user out.
            if(this.props.auth.status === 'logout'){
                this.props.history.push('/');
                return;
            }
            //stay at the error status and waiting for next try.
            if(this.props.auth.status === 'error'){
                return;
            }
            this.startCheckAuthState();
        }, delay); 
    }
    componentDidMount(){
        this.startCheckAuthState();
    }
    render(){
        return (<div></div>);
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

export default connect(mapStateToProps, mapDispatchToProps)(AuthChecker);
