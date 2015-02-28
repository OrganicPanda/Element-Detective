'use strict';

describe('detective', function() {
  var setup = function(html) {
    var container = document.createElement('div');

    container.innerHTML = html;

    return container.firstChild;
  };

  it('runs', function() {
    var el = setup('<div><p>Foo</p><p>Bar</p></div>')
      , child = el.querySelector('p:nth-child(2)');

    expect(elTextPosFoo(child, el)).toEqual({
      start: 15,
      end: 25,
      length: 10
    });
  });
});