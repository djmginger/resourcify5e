import React, { useEffect } from 'react';

function WithTracker(WrappedComponent, options = {}) {
    return function Component(props) {
        useEffect(() => {
            trackPage(window.location.pathname);
        }, [window.location.pathname]);

        const trackPage = (page) => {
            window.gtag('send', 'page_view', {
                page_location: window.location.href,
                page_path: page
            });
        };

        return <WrappedComponent {...props} />;
    };
}

export default WithTracker;