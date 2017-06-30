import React from 'react';
import PropTypes from 'prop-types';

// import styles from './index.css';

const HtmlOutput = ({ children, ...otherProps }) => (
  <div className="output" {...otherProps}>
    {children}
  </div>
);

HtmlOutput.propTypes = {
  children: PropTypes.node
};

export default HtmlOutput;
