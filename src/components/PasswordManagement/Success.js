import React from 'react';
import './sucess.css';

const Success = () => {
    return (
        <div className="success-container">
            <h1 className="success-title">You have successfully changed your Password!</h1>
            <h3 className="success-subtitle">Click <a className="success-link" href="https://gaorgsync.com/login">here</a> to Login</h3>
        </div>
    );
}

export default Success;
