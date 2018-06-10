import React from 'react';
import { connect } from 'react-redux';
//import { startLogin } from '../actions/auth';

export const LoginPage = ({ startLogin }) => (
  <div className="box-layout">
    <div className="box-layout__box">
      <h1 className="box-layout__title">Learner</h1>
      <h3>login</h3>
      <button className="button" onClick={() => {}}>Confirm</button>
    </div>
  </div>
);

//const mapDispatchToProps = (dispatch) => ({
//  startLogin: () => dispatch(startLogin())
//});

//export default connect(undefined, mapDispatchToProps)(LoginPage);
export default LoginPage;
