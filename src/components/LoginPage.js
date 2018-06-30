import React from 'react';
import { connect } from 'react-redux';
import { startLogin } from '../actions/auth';
import AuthChecker from '../routers/AuthChecker';

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
    render(){
        return(
           <div className="box-layout">
               <AuthChecker history={this.props.history} isPublic={true} />
               <div className="box-layout__box">
                    <h1 className="box-layout__title">MERN App</h1>
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
                            <button 
                                className="btn btn-primary" 
                                onClick={this.onSubmit}
                                disabled={(this.state.email.length === 0 || this.state.password.length === 0) ? true : false}
                            >Confirm</button>
                            { this.props.auth.status === 'error' ? (
                                <span className="err-hint" role="alert">
			            Invalid account or password.
			        </span>
                            ) : (
                                <span></span>
                            )}
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
