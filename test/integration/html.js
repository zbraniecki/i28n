
function getDocument(fixture, name) {
  fixture.load(name);
  var mockDocument = fixture.el.querySelector('#body');
  mockDocument.head = fixture.el.querySelector('#head');
  mockDocument.documentElement = fixture.el;
  mockDocument.readyState = 'interactive';
  return mockDocument;
}

describe('getObjectNames', function() {
  before(function(){
    fixture.setBase('/Volumes/projects/www/intl/i28n/test/fixtures')
  });

  afterEach(function(){
    fixture.cleanup()
  });

  it('should have empty names cache if no style', function() {
    var mockDocument = getDocument(fixture, 'test1.html');
    var view = new window.I28n.View(mockDocument);
    assert.equal(view._cache._names.size, 0);
  });

  it('should collect named intl objects from head', function() {
    var mockDocument = getDocument(fixture, 'test2.html');

    var view = new window.I28n.View(mockDocument);
    assert.equal(view._cache._names.size, 1);
    assert.isTrue(view._cache._names.has('longDate'));
  });

  it('should add named intl object when injected into head', function(done) {
    var mockDocument = getDocument(fixture, 'test2.html');
    var view = new window.I28n.View(mockDocument);

    var style = document.createElement('style');
    style.setAttribute('type', 'application/mozi18n');
    style.innerHTML = JSON.stringify({
      'shortTime': {
        hour: 'numeric',
        minute: 'numeric'
      }
    });
    mockDocument.head.appendChild(style);

    Promise.resolve().then(() => {
      assert.isTrue(view._cache._names.has('shortTime'));
    }).then(done, done);
  });
});

describe('formatI18nElements', function() {
  before(function(){
    fixture.setBase('/Volumes/projects/www/intl/i28n/test/fixtures')
  });

  afterEach(function(){
    fixture.cleanup()
  });

  it('should format element with data-i18n-value', function() {
    var mockDocument = getDocument(fixture, 'test4.html');
    var view = new window.I28n.View(mockDocument);
    assert.equal(
      mockDocument.querySelector('#date-header').textContent, '8/17/2037');
  });

  it('should react to injection of an element with data-i18n-value',
      function(done) {
    var mockDocument = getDocument(fixture, 'test4.html');
    var view = new window.I28n.View(mockDocument);

    var p = document.createElement('p');
    p.setAttribute('id', 'currency');
    p.setAttribute('data-i18n-type', 'number');
    p.setAttribute('data-i18n-value', '15');
    p.setAttribute('data-i18n-options', JSON.stringify({
      currency: 'EUR',
      style: 'currency'
    }));
    mockDocument.appendChild(p);

    Promise.resolve().then(function() {
      assert.equal(
        mockDocument.querySelector('#currency').textContent, '€15.00');
    }).then(done, done);
  });
});
