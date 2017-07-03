import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import DOMPurify from 'dompurify';

import styles from './index.css';

class HtmlOutput extends Component {
  // componentDidMount() {
  //   this.onScroll();
  //   window.addEventListener('scroll', this.onScroll)
  // }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.onScroll);
  // }

  componentDidMount() {
    const { onMount } = this.props;
    if (onMount && this.elementNode) onMount(this.elementNode);
  }

  render () {
    const { html, className, onScroll } = this.props;

    return (
      <div className={`${styles.output} ${className}`} >

        <div
          ref={ref => this.elementNode = ref }
          dangerouslySetInnerHTML={{__html: html}}
          className={styles.content}
          onScroll={scrollInfo => {if (onScroll) onScroll(scrollInfo);}}
          />
      </div>
    );
  }

}

HtmlOutput.propTypes = {
  html: PropTypes.node,
  onMount: PropTypes.func,
  onScroll: PropTypes.func,
};

export default HtmlOutput;
