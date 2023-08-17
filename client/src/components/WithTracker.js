import React, { useEffect } from 'react';

const WithTracker = (WrappedComponent, options = {}) => {
    function Component(props) {
        useEffect(() => {
            console.log("Tracking page:", window.location.pathname);
            trackPage(window.location.pathname);
        }, [window.location.pathname]);

        const trackPage = (page) => {
            window.gtag('send', 'page_view', {
                page_location: window.location.href,
                page_path: page
            });
        };

        return <WrappedComponent {...props} />;
    }

    return Component;
}

export default WithTracker;