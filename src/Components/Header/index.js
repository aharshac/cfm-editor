import React from 'react';
// import PropTypes from 'prop-types';

import ExtLink from '../ExtLink';

import LogoReact from '../../images/LogoReact.svg';
import LogoCollaborizm from '../../images/LogoCollaborizm.svg';

import styles from './index.css';

const Header = () => (
  <header className={styles.header}>
    <h2>React Markdown Editor</h2>
    <div className={styles.icons}>
      <ExtLink href="https://www.collaborizm.com">
        <img src={LogoCollaborizm} className={styles.logoCollaborizm} alt="collaborizm" />
      </ExtLink>
      <img src={LogoReact} className={styles.logoReact} alt="React" />
    </div>
  </header>
);

export default Header;
