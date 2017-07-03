import React from 'react';
import PropTypes from 'prop-types';

const ExtLink = ({ href, children, ...otherProps }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...otherProps} >
    { children }
  </a>
);

ExtLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default ExtLink;
