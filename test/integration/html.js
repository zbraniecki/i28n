describe('getObjectNames', function() {
  before(function(){
    fixture.setBase('/Volumes/projects/www/intl/i28n/test/fixtures')
  });

  afterEach(function(){
    fixture.cleanup()
  });

  it('should have empty names cache if no style', function() {
    fixture.load('test1.html');
    var mockDocument = fixture.el.querySelector('#body');
    mockDocument.head = fixture.el.querySelector('#head');
    mockDocument.readyState = 'interactive';

    var view = new window.I28n.View(mockDocument);
    assert.equal(view._cache._names.size, 0);
  });

  it('should collect named intl objects from head', function() {
    fixture.load('test2.html');
    var mockDocument = fixture.el.querySelector('#body');
    mockDocument.head = fixture.el.querySelector('#head');
    mockDocument.readyState = 'interactive';

    var view = new window.I28n.View(mockDocument);
    assert.equal(view._cache._names.size, 1);
    assert.isTrue(view._cache._names.has('longDate'));
  });

  it('should add named intl object when injected into head', function(done) {
    fixture.load('test2.html');
    var mockDocument = fixture.el.querySelector('#body');
    mockDocument.head = fixture.el.querySelector('#head');
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
