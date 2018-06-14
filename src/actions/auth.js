import axios from 'axios';
import { setStorage, getStorage, clearStorage } from '../helper/cookie';

//check token:
export const startCheckToken = (token) => {
    return (dispatch) => {
        const reqInstance = axios.create({
            headers: {
                'x-auth': getStorage('usrJwt')
            }
        });
        return reqInstance.post('/user/check_token', {token}).then((res) => {
            if(res.data === 'success'){
                return Promise.resolve(true);
            }else{
                return Promise.reject(false);
            }
        }).catch((e) => {
            dispatch(login_error());
            clearStorage('usrJwt');
            return Promise.reject(false);
        });
    }
}

//handel login:
export const login = (payload) => ({
  type: 'LOGIN',
  payload
});
export const login_error = () => ({
  type: 'LOGIN_ERROR'
});
export const startLogin = (data) => {
  return (dispatch) => {
    return axios.post('/user/login', data).then((res) => {
        //update redux data.
        dispatch(login(res.data));
        //store token to storage.
        const token  = res.headers['x-auth'];
        setStorage('usrJwt', token);
    }).catch((e) => {
        dispatch(login_error());
        clearStorage('usrJwt');
    });
  };
};

//handel logout:
export const logout = () => ({
  type: 'LOGOUT'
});
export const startLogout = (uid) => {
  return (dispatch) => {
    const currentUsrJwt = getStorage('usrJwt');
    try{
        if(!currentUsrJwt || currentUsrJwt === '')
            throw 'user is not login';
    }catch(e){
        //!!log the information
    }
    const data = { uid, currentUsrJwt };
    const reqInstance = axios.create({
        headers: {
            'x-auth': getStorage('usrJwt')
        }
    });
    return reqInstance.post('/user/logout', data).then((res) => {
        if(res.data === 'success'){
            dispatch(logout());
            clearStorage('usrJwt');
        }
    }).catch((e) => {
        //do nothing
    });
  };
};
