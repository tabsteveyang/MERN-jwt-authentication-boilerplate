//import { firebase, googleAuthProvider } from '../firebase/firebase';
import axios from 'axios';

export const changeStatus = (status) => ({
    type: 'CHANGE_STATUS',
    status
});

export const startCreateUser = (data) => {
  return (dispatch) => {
    return axios.post('/admin/create_user', data).then((res) => {
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
