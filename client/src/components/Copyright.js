// Copyright.js
import React from 'react';

function Copyright() {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={footerStyle}>
            <p style={textStyle}>© {currentYear} Redhead Development. All rights reserved.</p>
        </footer>
    );
}

const footerStyle = {
    textAlign: 'center',
    padding: '10px 0 5px',
    position: 'relative',
    left:'0',
    right:'0',
    bottom: '0',
    width: '100%',
    borderTop: '1px solid #F5F1E3'
};

const textStyle = {
    margin: '0',
    fontSize: '0.8em',
    color: '#F5F1E3'
};

export default Copyright;