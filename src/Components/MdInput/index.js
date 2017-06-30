import React from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'react-codemirror';

const MdInput = ({ code, onInputChange }) => {
  const options = {
    mode: 'gfm',
    lineNumbers: false,
    matchBrackets: true,
    lineWrapping: true,
    theme: 'base16-light',
    extraKeys: {Enter: 'newlineAndIndentContinueMarkdownList'}
  };

  return (
    <CodeMirror value={code} onChange={onInputChange} options={options} className="mdInput"/>
  );
};

MdInput.propTypes = {
  code: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default MdInput;
