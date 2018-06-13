import React from 'react';
import { Link } from 'react-router-dom';

const NotAllowPage = () => (
  <div className='container'>
    <h3>
        You are not allow to visit this page - <Link to="/dashboard">Go to Dashboard</Link>
    </h3>
  </div>
);

export default NotAllowPage;
