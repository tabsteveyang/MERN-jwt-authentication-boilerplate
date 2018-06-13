import React from 'react';
import { connect } from 'react-redux';
import validator from 'validator';
import { startCreateUser, changeStatus } from '../actions/forms';
import Navbar from './Navbar';
import AuthChecker from '../routers/AuthChecker';

export class CreatePage extends React.Component{
    constructor(props){
        super(props);
    }
    state = {
        email: '',
        password: '',
        name: '',
        settings: {
            language: 'EN',
            sessionCardLimit: 30
        },
        privilige: {
            isActivate: false,
            setting: false,
            enroll: false,
            play: true,
            create: false,
            isAdmin: false
        },
        error: '',
    };
    dirtyForm = () => {
        //change the status of the form reducer.
        if(this.props.form.editStatus === 'clean')
            this.props.changeStatus('dirty');
    };
    onSubmit = (e) => {
        e.preventDefault();
        this.props.startCreateUser(this.state);
    }
    onEmailChange = (e) => {
        this.dirtyForm();
        let email = e.target.value;
        this.setState({email});
        setTimeout(() => {this.checkForm('email')}, 0);
    };
    onNameChange = (e) => {
        this.dirtyForm();
        let name = e.target.value;
        this.setState({name});
        setTimeout(() => {this.checkForm('name')}, 0);
    };
    onPasswordChange = (e) => {
        this.dirtyForm();
        let password = e.target.value;
        this.setState({password});
        setTimeout(() => {this.checkForm('password')}, 0);
    };
    checkForm = (field) => {
        if(field === 'email' || field === 'all'){
            if(!validator.isEmail(this.state.email)){
                this.setState({error: 'Invalid email format.'});
                return;
            }
        }
        if(field === 'name' || field === 'all'){
            if(validator.isEmpty(this.state.name)){
                this.setState({error: "Name can't be empty."});
                return;
            }
            if(this.state.name.length < 6){
                this.setState({error: 'Name has to be more then 6 characters.'});
                return;
            }
        }
        if(field === 'password' || field === 'all'){
            if(validator.isEmpty(this.state.password)){
                this.setState({error: "Password can't be empty."});
                return;
            }
            if(this.state.password.length < 6){
                this.setState({error: 'Password has to be more then 6 characters.'});
                return;
            }
        }

        this.setState({error: ''});
    };
    onInputCheck = (e) => {
        this.dirtyForm();
        let target = e.target.name;
        let value = e.target.value;
        let privilige = {
            ...this.state.privilige,
        };
        privilige[target] = e.target.checked;
        this.setState({privilige});
    };
    onSettingsChange = (e) => {
        this.dirtyForm();
        let target = e.target.name;
        let settings = {
            ...this.state.settings,
        };
        settings[target] = e.target.value;
        this.setState({settings});
    };
    componentDidUpdate(){
        if(this.props.form.editStatus === 'success'){
            alert('submit success!');
            setTimeout(() => {
                this.props.history.push('/'); //redirect to the main page after submit the form successfully.
            }, 1000);
        }else if(this.props.form.editStatus === 'error'){
            setTimeout(() => {this.checkForm('all')}, 0);
            this.props.changeStatus('dirty');
        }
    }
    render(){
        return(
        <div className='container-fluid'>
            <AuthChecker history={this.props.history} isPublic={false} accessRequire={'isAdmin'}/>
            <Navbar />
            <div className="jumbotron">
                <h1 className="display-4">Create User</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="inputEmail">Email address</label>
                        <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            aria-describedby="emailHelp" 
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.onEmailChange}
                         ></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputName">Name</label>
                        <input 
                            type="text" 
	                    className="form-control form-control-lg" 
	            	    aria-describedby="nameHelp" 
	            	    placeholder="Enter name"
                            value={this.state.name}
                            onChange={this.onNameChange}
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
                    <div className="form-group">
                        <label htmlFor="privilige">Priviliges</label>
	            	<div className="form-check">
                               <input 
                                   className="form-check-input" 
                                   type="checkbox"
                                   checked={this.state.privilige.isActivate}
                                   onChange={this.onInputCheck}
                                   name="isActivate"
                               ></input>
                               <label className="form-check-label" htmlFor="priviligeCheck1">
                                   isActivate
                               </label>
                            </div>
	            	<div className="form-check">
                               <input 
                                   className="form-check-input" 
                                   type="checkbox"
                                   checked={this.state.privilige.setting}
                                   onChange={this.onInputCheck}
                                   name="setting"
                               ></input>
                               <label className="form-check-label" htmlFor="priviligeCheck2">
                                   setting
                               </label>
                            </div>
	            	<div className="form-check">
                               <input 
                                   className="form-check-input" 
                                   type="checkbox"
                                   checked={this.state.privilige.enroll}
                                   onChange={this.onInputCheck}
                                   name="enroll"
                               ></input>
                               <label className="form-check-label" htmlFor="priviligeCheck3">
                                   enroll
                               </label>
                            </div>
	            	<div className="form-check">
                               <input 
                                   className="form-check-input" 
                                   type="checkbox"
                                   checked={this.state.privilige.play}
                                   onChange={this.onInputCheck}
                                   name="play"
                               ></input>
                               <label className="form-check-label" htmlFor="priviligeCheck4">
                                   play
                               </label>
                            </div>
	            	<div className="form-check">
                               <input 
                                   className="form-check-input" 
                                   type="checkbox"
                                   checked={this.state.privilige.create}
                                   onChange={this.onInputCheck}
                                   name="create"
                               ></input>
                               <label className="form-check-label" htmlFor="priviligeCheck5">
                                   create
                               </label>
                            </div>
	            	<div className="form-check">
                               <input 
                                   className="form-check-input" 
                                   type="checkbox"
                                   checked={this.state.privilige.isAdmin}
                                   onChange={this.onInputCheck}
                                   name="isAdmin"
                               ></input>
                               <label className="form-check-label" htmlFor="priviligeCheck6">
                                   isAdmin
                               </label>
                            </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="form-control">Language</label>
                        <select 
                            className="form-control" 
                            name="language"
                            value={this.state.settings.language}
                            onChange={this.onSettingsChange}
                        >
			     <option>EN</option>
			</select>
                        <label htmlFor="form-control">Session card limit</label>
                        <select 
                            className="form-control" 
                            name="sessionCardLimit"
                            value={this.state.settings.sessionCardLimit}
                            onChange={this.onSettingsChange}
                        >
			     <option>30</option>
			     <option>50</option>
			</select>
                    </div>
                    <button 
                        className="btn btn-primary"
                        onClick={this.onSubmit}
                        disabled={this.state.error.length !== 0 || this.props.form.editStatus === 'clean'}
                    >Submit</button>
                        <div style={{height: '54px'}}>
                            <hr/>
                            {this.state.error !== '' ? 
                            <div className="alert alert-danger" role="alert">
                              {this.state.error}
                            </div>
                            : ''}
                        </div>
                </form>
            </div>
        </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    form: state.form
});
const mapDispatchToProps = (dispatch, props) => ({
    startCreateUser: (data) => dispatch(startCreateUser(data)),
    changeStatus: (status) => dispatch(changeStatus(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatePage);
