/*
const getNonEmptyLines = str => str ? (str.replace(/^\s*\S/gm, "").replace("&nbsp;", "") || "") : "";   // /^\s*\S/gm   /^(<p\>&nbsp;<\/p>|\s*\S)/gm

const getNonEmptyLineCount = str => str ? (str.match(/^\s*\S/gm) || "").length : 0;   // /^\s*\S/gm   /^(<p\>&nbsp;<\/p>|\s*\S)/gm

// parsed DOM: p, hr, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, pre, table, div
// DOM:        p hr h1 h2 h3 h4 h5 h6 blockquote ul ol pre table div
const getScrollMap = (elements) => elements ? [0, ...Array.from(elements).map(element => element.offsetTop)]: [];   // /^\s*\S/gm

const getElementCount = (elements) => elements ? Array.from(elements).length : 0;   // /^\s*\S/gm
*/


const getScrollMap = (refElOutput) => {
  if (!refElOutput) {
    return;
  }

  const elements = refElOutput.children ? Array.from(refElOutput.children) : [];

  const map = {};
  let totalEnd = 0;
  elements.forEach((element, i) => {
    if (element.hasAttribute('data-input-line')) {
      const iEnd = totalEnd + element.offsetTop + element.offsetHeight;
      map[i] = {
        line: element.getAttribute('data-input-line'),
        start: totalEnd,
        end:  iEnd
      };
      totalEnd = iEnd;
    }
  });

  return map;
};

export {
  getScrollMap
  /* getNonEmptyLineCount, getScrollMap, getElementCount, getNonEmptyLines */
};
