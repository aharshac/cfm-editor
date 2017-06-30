import React from 'react';
// import PropTypes from 'prop-types';

import ExtLink from '../ExtLink';

import LogoReact from '../../images/LogoReact.svg';
import LogoCollaborizm from '../../images/LogoCollaborizm.svg';

import './index.css';

const Header = () => (
  <header className="header">
    <h2>Collaborizm Markdown Editor</h2>
    <ExtLink href="https://www.collaborizm.com">
      <img src={LogoCollaborizm} className="logo-collaborizm" alt="collaborizm" />
    </ExtLink>
    <img src={LogoReact} className="logo-react" alt="React" />
  </header>
);

export default Header;
