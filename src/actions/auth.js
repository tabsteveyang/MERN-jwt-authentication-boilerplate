import axios from 'axios';
///!!!
const clearStorage = (name) => {
    sessionStorage.setItem(name, '');
};
const setStorage = (name, value) => {
    sessionStorage.setItem(name, value);
};
///!!!

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
        const { _id: uid, name, email } = res.data;
        dispatch(login({uid, name, email}));
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
    const currentUsrJwt = sessionStorage.getItem('usrJwt'); //!!!
    if(!currentUsrJwt || currentUsrJwt === '')
        throw 'user is not login';
    const data = { uid, currentUsrJwt };
    return axios.post('/user/logout', data).then((res) => {
        if(res.data === 'success'){
            dispatch(logout());
            clearStorage('usrJwt');
        }
    }).catch((e) => {
        //do nothing
    });
  };
};
