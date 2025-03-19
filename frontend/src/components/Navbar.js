import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = () => {
return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container">
        <a className="navbar-brand" href="#">
        <i className="fab fa-react"></i> Brand
        </a>
        <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        >
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
            <a className="nav-link" href="#">
                <i className="fas fa-home"></i> Home
            </a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="#">
                <i className="fas fa-info-circle"></i> About
            </a>
            </li>
            <li className="nav-item">
            <a className="nav-link" href="#">
                <i className="fas fa-envelope"></i> Contact
            </a>
            </li>
        </ul>
        </div>
    </div>
    </nav>
);
};

export default Navbar;

