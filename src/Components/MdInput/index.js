import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from '@skidding/react-codemirror';
import 'codemirror/mode/gfm/gfm';

import 'codemirror/lib/codemirror.css';

import styles from './index.css';

class MdInput extends Component {
  componentDidMount() {
    const { onMount } = this.props;
    if (onMount && this.elementNode) onMount(this.elementNode);
  }

  editorRefCallback = (ref) => {
    const cm = ref.getCodeMirror();
    const { height } = this.props;
    cm.setSize(null, height);
    this.elementNode = cm;
  }

  render () {
    const { code, className, onInputChange, onScroll, ...otherProps } = this.props;

    const options = {
      mode: 'gfm',
      lineNumbers: false,
      matchBrackets: true,
      lineWrapping: true,
      extraKeys: {Enter: 'newlineAndIndentContinueMarkdownList'}
    };

    return (
      <div className={`${styles.input} ${className}`}>
        <CodeMirror
          ref={this.editorRefCallback}
          value={code}
          options={options}
          onChange={value => onInputChange(value)}
          onScroll={scrollInfo => { if (onScroll) onScroll(scrollInfo); }}
          {...otherProps}
        />
      </div>
    );
  }
}

MdInput.propTypes = {
  code: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  height: PropTypes.string,
  onMount: PropTypes.func,
  onScroll: PropTypes.func,
};

MdInput.defaultProps = {
  height: '400px'
};

export default MdInput;
