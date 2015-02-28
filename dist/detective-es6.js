
// Find the text position of the given element relative to it's parent's outerHTML
export var elTextPos = function(x) {
  var offset = 0
    , sibling = x.previousSibling;

  while (sibling) {
    if (sibling.nodeType === 3) {
      // Text
      offset += sibling.length;
    } else {
      // Assuming Element
      offset += sibling.outerHTML.length;
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

export var elTextPosFoo = function(x, y) {
  var parent = x.parentNode
    , pos = elTextPos(x)
    , parentPos;

  while (parent && parent !== y) {
    parentPos = elTextPos(parent);

    pos.start += parentPos.start;
    pos.end += parentPos.start;

    parent = parent.parentNode;
  }

  return pos;
};

// var foo = document.querySelectorAll('.foo')[0]
//   , bar = foo.children[2];

// var container = document.body
//   , pos = elTextPosFoo(bar, container);

// console.log('overall', pos);

// var before = document.querySelector('.before')
//   , after = document.querySelector('.after');

// before.innerText = foo.outerHTML;

// function splice(str, index, count, add) {
//   return str.slice(0, index) + (add || "") + str.slice(index + count);
// }

// var endMarked = splice(container.outerHTML, pos.end, 0, '{y}')
//   , startMarked = splice(endMarked, pos.start, 0, '{x}');

// after.innerText = startMarked;