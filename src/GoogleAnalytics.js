// Taken from https://medium.com/brownbag/add-google-analytics-to-create-react-app-project-with-react-router-v4-f12b947262fc

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga4';
import { Route } from 'react-router-dom';

class GoogleAnalytics extends Component {
    componentDidMount () {
        this.logPageChange(
            this.props.location.pathname,
            this.props.location.search
        );
    }

    componentDidUpdate ({ location: prevLocation }) {
        const { location: { pathname, search } } = this.props;
        const isDifferentPathname = pathname !== prevLocation.pathname;
        const isDifferentSearch = search !== prevLocation.search;

        if (isDifferentPathname || isDifferentSearch) {
            this.logPageChange(pathname, search);
        }
    }

    logPageChange (pathname, search = '') {
        const page = pathname + search;
        const { location } = window;
        ReactGA.set({
            page,
            location: `${location.origin}${page}`,
            ...this.props.options
        });
        ReactGA.pageview(page);
    }

    render () {
        return null;
    }
}

GoogleAnalytics.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string
    }).isRequired,
    options: PropTypes.object
};

const RouteTracker = () => <Route component={GoogleAnalytics} />;

const init = (options = {}) => {
    const isGAEnabled = process.env.NODE_ENV === 'production';

    if (isGAEnabled) {
      try {
        setTimeout(_ => {
          const ga4react = new ReactGA(process.env.REACT_APP_GA_MEASUREMENT_I);
          ga4react.initialize().catch(err => console.error(err));
        }, 4000);
      } catch (err) {
          console.error(err);
      }
    }

    return isGAEnabled;
};

export default {
    GoogleAnalytics,
    RouteTracker,
    init
};
