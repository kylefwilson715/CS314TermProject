import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header = () => {
return (
    <header className="bg-primary text-white p-3">
    <div className="container">
        <h1>
        <i className="fas fa-home"></i> My Application
        </h1>
    </div>
    </header>
);
};

export default Header;

