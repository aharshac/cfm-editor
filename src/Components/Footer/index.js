import React from 'react';
// import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';

import ExtLink from '../ExtLink';

import './index.css';

const Footer = () => (
  <footer className="footer">
    <p>
      App by <ExtLink href="https://www.collaborizm.com/profile/Hyt3y6XK?utm_content=user_link&utm_source=user_Hyt3y6XK">Harsha Alva</ExtLink>.
      Made for <ExtLink href="https://www.collaborizm.com/">Collaborizm</ExtLink> with <Glyphicon glyph="heart" /> and <ExtLink href="https://facebook.github.io/react/">React</ExtLink>
    </p>
  </footer>
);

export default Footer;
