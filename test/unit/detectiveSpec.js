'use strict';

describe('detective', function() {
  // Turn a HTML string in to an Element
  var setup = function(html) {
    var container = document.createElement('div');

    container.innerHTML = html;

    return container.firstChild;
  };

  // Insert pipes around the found position to make the tests more visual
  var test = function(pos, container) {
    function splice(str, index, count, add) {
      return str.slice(0, index) + (add || "") + str.slice(index + count);
    }

    var endMarked = splice(container.outerHTML, pos.end, 0, '|')
      , startMarked = splice(endMarked, pos.start, 0, '|');

    return startMarked;
  };

  describe('findOne', function() {
    it('returns the correct object', function() {
      var el = setup('<div><p>Foo</p></div>')
        , child = el.querySelector('p');

      expect(findOne(child)).toEqual({ start: 5, end: 15, length: 10 });
    });

    it('finds an only-child', function() {
      var el = setup('<div><p>Foo</p></div>')
        , child = el.querySelector('p');

      expect(test(findOne(child), el)).toBe('<div>|<p>Foo</p>|</div>');
    });

    it('finds a second child', function() {
      var el = setup('<div><p>Foo</p><p>Bar</p></div>')
        , child = el.querySelector('p:nth-child(2)');

      expect(findOne(child)).toEqual({ start: 15, end: 25, length: 10 });
    });

    it('handles whitespace', function() {
      var el = setup('<div>\n \n\n  \n<p>Foo</p> \n\n  \n\n <p>Bar</p> </div>')
        , child = el.querySelector('p:nth-child(2)');

      expect(test(findOne(child), el))
        .toBe('<div>\n \n\n  \n<p>Foo</p> \n\n  \n\n |<p>Bar</p>| </div>');
    });

    it('handles tabs', function() {
      var el = setup('<div>\n\t\t<p>Foo</p>\n\t\t<p>Bar</p>\n</div>')
        , child = el.querySelector('p:nth-child(2)');

      expect(test(findOne(child), el))
        .toBe('<div>\n\t\t<p>Foo</p>\n\t\t|<p>Bar</p>|\n</div>');
    });

    it('handles comments', function() {
      var el = setup('<div><!----><p>Foo</p><!-- Baz --><p>Bar</p></div>')
        , child = el.querySelector('p:nth-child(2)');

      expect(test(findOne(child), el))
        .toBe('<div><!----><p>Foo</p><!-- Baz -->|<p>Bar</p>|</div>');
    });

    it('handles processing instructions', function() {
      var el = setup('<div><?thing?><p>Foo</p><p>Bar</p></div>')
        , child = el.querySelector('p:nth-child(2)');

      // In a HTML context these get converted to comments, document that
      expect(test(findOne(child), el))
        .toBe('<div><!--?thing?--><p>Foo</p>|<p>Bar</p>|</div>');
    });

    it('handles <html>', function() {
      var el = document.createElement('html');
      el.innerHTML = '<head></head><body>Bar</body>';

      var head = el.querySelector('head')
        , body = el.querySelector('body');

      expect(test(findOne(head), el))
        .toBe('<html>|<head></head>|<body>Bar</body></html>');

      expect(test(findOne(body), el))
        .toBe('<html><head></head>|<body>Bar</body>|</html>');
    });
  });

  describe('find', function() {
    it('returns the correct object', function() {
      var el = setup('<div><p>Foo</p><p>Bar</p></div>')
        , child = el.querySelector('p:nth-child(2)');

      expect(find(child, el)).toEqual({ start: 15, end: 25, length: 10 });
    });

    it('works with a single level of nesting', function() {
      var el = setup('<div><p>Foo</p><p>Bar</p></div>')
        , child = el.querySelector('p:nth-child(2)');

      expect(test(find(child, el), el))
        .toBe('<div><p>Foo</p>|<p>Bar</p>|</div>');
    });

    it('works with two levels of nesting', function() {
      var el = setup('<div><p>Foo</p><div><b>Bar</b></div></div>')
        , child = el.querySelector('b');

      expect(test(find(child, el), el))
        .toBe('<div><p>Foo</p><div>|<b>Bar</b>|</div></div>');
    });

    it('works with multiple levels of nesting', function() {
      var el = setup('<div class="thing">'
                   + '  <p>Foo</p>'
                   + '  <div class="thing">'
                   + '    <b>Bar</b>'
                   + '    <div class="thing">'
                   + '      <b>Bar</b>'
                   + '      <div class="thing">'
                   + '        <b>Bar</b>'
                   + '      </div>'
                   + '    </div>'
                   + '  </div>'
                   + '</div>')
        , children = el.querySelectorAll('b')
        , child = children[children.length - 1];

      expect(test(find(child, el), el))
        .toBe('<div class="thing">'
            + '  <p>Foo</p>'
            + '  <div class="thing">'
            + '    <b>Bar</b>'
            + '    <div class="thing">'
            + '      <b>Bar</b>'
            + '      <div class="thing">'
            + '        |<b>Bar</b>|'
            + '      </div>'
            + '    </div>'
            + '  </div>'
            + '</div>');
    });

    it('returns a single level if no ancestor is given', function() {
      var el = setup('<div><p>Foo</p><div><b>Bar</b></div></div>')
        , child = el.querySelector('b');

      expect(find(child)).toEqual({ start: 5, end: 15, length: 10 });
    });
  });
});