var elem = document.getElementsByTagName('h1')[0];

var now = Date.now();

//navigator.mozI18n.setValue(elem, now);

var elem2 = document.getElementsByTagName('h3')[0];
//navigator.mozI18n.setValue(elem2, 15);

document.mozI18n.define('shortTime', {
  type: 'datetime',
  options: {hour: 'numeric'}
});

var formatter = document.mozI18n.get('longDate');
var now = new Date();
console.log(formatter.format(now));



var formatter = document.mozI18n.get({type: 'datetime'});
var now = new Date();
console.log(formatter.format(now));
