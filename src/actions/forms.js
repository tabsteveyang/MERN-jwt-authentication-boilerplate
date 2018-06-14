import axios from 'axios';
import { getStorage } from '../helper/cookie';

export const changeStatus = (status) => ({
    type: 'CHANGE_STATUS',
    status
});

export const startCreateUser = (data) => {
  return (dispatch) => {
    const reqInstance = axios.create({
        headers: {
            'x-auth': getStorage('usrJwt')
        }
    });
    return reqInstance.post('/admin/create_user', data).then((res) => {
        if(res.data === 'success'){
            dispatch(changeStatus('success'));
        }else{
            dispatch(changeStatus('error'));
        }
    }).catch((e) => {
        dispatch(changeStatus('error'));
    });
  };
};
