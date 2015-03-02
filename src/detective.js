/**
 * A position object represents where an element is relative to it's
 * parent (or any ancestor) when outputted as a string of HTML.
 *
 * For example:
 *
 * <div class="container"><p class="child">Child</p></div>
 * -----------------------^ (Start)
 * -------------------------------------------------^ (End)
 *                        ^-------------------------^ (Length)
 *
 * For .child above we would return position start 23, end 49 and 26 length.
 *
 * Positions are the same as indexOf would return.
 *
 * @typedef {Object} Position
 * @property {Number} start The start position of the element's outerHTML
 * @property {Number} end The end position of the element's outerHTML
 * @property {Number} length The length of the element's outerHTML
 */

/**
 * Find the Position for the given element relative to it's direct parent
 *
 * @param {Element} x The Element to find.
 *
 * @returns {Position|undefined}
 * The position. Undefined is returned if the HTML contained something funky
 * and couldn't be processed.
 */
export var findOne = function(x) {
  var offset = 0
    , sibling = x.previousSibling;

  while (sibling) {
    if (sibling.nodeType === Node.TEXT_NODE) {
      offset += sibling.length;
    } else if (sibling.nodeType === Node.COMMENT_NODE) {
      offset += (sibling.length + 7); // <!----> is 7
    } else if (sibling.nodeType === Node.ELEMENT_NODE) {
      offset += sibling.outerHTML.length;
    } else {
      // If we encounter something else bail out
      return;
    }

    sibling = sibling.previousSibling;
  }

  var innerHTMLOffset = x.parentNode.outerHTML.indexOf('>') + 1
    , length = x.outerHTML.length
    , start = offset + innerHTMLOffset
    , end = start + length;

  return {
    start,
    end,
    length
  };
};

/**
 * Find the Position for the given element relative to a given ancestor.
 *
 * @param {Element} x The Element to find.
 * @param {Element} y The Element to base the position on. Must be an ancestor.
 *
 * @returns {Position} The position
 */
export var find = function(x, y) {
  var parent = x.parentNode
    , pos = findOne(x)
    , parentPos;

  if (!y) return pos;

  while (parent && parent !== y) {
    parentPos = findOne(parent);

    pos.start += parentPos.start;
    pos.end += parentPos.start;

    parent = parent.parentNode;
  }

  return pos;
};