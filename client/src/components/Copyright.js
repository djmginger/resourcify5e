// Copyright.js
import React from 'react';

function Copyright() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={footerStyle}>
            <p style={textStyle}>© {currentYear} YourName or YourCompany. All rights reserved.</p>
        </footer>
    );
}

const footerStyle = {
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    padding: '10px 0',
    position: 'relative',
    bottom: '0',
    width: '100%',
    borderTop: '1px solid #eaeaea'
};

const textStyle = {
    margin: '0',
    fontSize: '0.8em',
    color: '#333'
};

export default Copyright;