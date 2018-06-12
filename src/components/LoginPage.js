import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';

export class LoginPage extends React.Component{
    constructor(props){
        super(props);
    }
    state = {
        email: '',
        password: ''
    };
    onEmailChange = (e) => {
        let email = e.target.value;
        this.setState({email});
    };
    onPasswordChange = (e) => {
        let password = e.target.value;
        this.setState({password});
    };
    onSubmit = (e) => {
        e.preventDefault();
        this.props.startLogin(this.state);
    };
    checkIsLogin(){
        if(this.props.auth.status === 'login'){
            this.props.history.push('/dashboard');
        }
    }
    componentDidUpdate(){
        this.checkIsLogin();
    }
    componentWillMount(){
        this.checkIsLogin();
    }
    render(){
        return(
           <div className="box-layout">
               <div className="box-layout__box">
                    <h1 className="box-layout__title">App</h1>
                        <form>
                            <div className="form-group">
                        	<label htmlFor="inputEmail">Account</label>
                        	<input 
                        	    type="email" 
                        	    className="form-control form-control-lg" 
                        	    aria-describedby="emailHelp" 
                        	    placeholder="Email as account"
                        	    value={this.state.email}
                        	    onChange={this.onEmailChange}
                        	 ></input>
                            </div>
                            <div className="form-group">
                        	<label htmlFor="inputPassword">Password</label>
                        	<input 
                        	    type="password" 
                        	    className="form-control form-control-lg"
                        	    placeholder="Password"
                        	    value={this.state.password}
                        	    onChange={this.onPasswordChange}
                        	></input>
                            </div>
                            <hr/>
                            <button className="btn btn-primary btn-lg" onClick={this.onSubmit}>Confirm</button>
                        </form>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
  startLogin: (data) => dispatch(startLogin(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
