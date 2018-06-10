//import { firebase, googleAuthProvider } from '../firebase/firebase';
import axios from 'axios';

export const changeStatus = (status) => ({
    type: 'CHANGE_STATUS',
    status
});

export const startCreateUser = (data) => {
//console.log(data);
  return (dispatch) => {
    return axios.post('/create_user', data).then((res) => {
//console.log(res);
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
