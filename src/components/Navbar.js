import React from 'react';
import { Link } from 'react-router-dom';
import LogoutBtn from './utils/LogoutBtn';

export const Navbar = () => (
    <nav className="navbar navbar-dark bg-dark">
	 <Link className="navbar-brand" to="/dashboard">
	     Boilerplate
	 </Link>
         <LogoutBtn />
    </nav>
);

export default Navbar;
