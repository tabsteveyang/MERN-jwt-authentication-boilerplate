import React from 'react';
import { Link } from 'react-router-dom';
import LogoutBtn from './utils/LogoutBtn';

export const Navbar = () => (
    <nav className="navbar navbar-dark bg-dark">
	 <Link className="navbar-brand" to="/dashboard">
	     Boilerplate
	 </Link>
         <ul className="navbar-nav mr-auto">
               <li className="nav-item">
         	 <Link className="nav-link" to="/admin/createusr">
         	     CreateUser
         	 </Link>
               </li>
         </ul>
         <LogoutBtn />
    </nav>
);

export default Navbar;
