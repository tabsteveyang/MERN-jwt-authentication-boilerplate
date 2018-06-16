import React from 'react';
import Navbar from './Navbar';
import LogoutBtn from './utils/LogoutBtn';
import AuthChecker from '../routers/AuthChecker';

const DashboardPage = (props) => (
    <div className="container-fluid">
        <AuthChecker history={props.history} isPublic={false}/>
        <Navbar />
        <LogoutBtn />
        <h1>Dashboard page content</h1>
    </div>
);

export default DashboardPage;
