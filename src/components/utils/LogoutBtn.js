import React from 'react';
import { connect } from 'react-redux';
import { startLogout } from '../../actions/auth';

export class LogoutBtn extends React.Component{
    constructor(props){
        super(props);
    }
    btnOnClick = () => {
        this.props.startLogout(this.props.auth.uid);
    };
    render(){
        if(this.props.auth.status === 'login'){
            return(
                <button 
                    className="btn btn-danger" 
                    onClick={this.btnOnClick}
                >Logout</button>
            );
        }
        return(<div></div>);
    }  
}

const mapStateToProps = (state, props) => ({
    auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
    startLogout: (uid) => dispatch(startLogout(uid))
});

export default connect(mapStateToProps, mapDispatchToProps)(LogoutBtn);
