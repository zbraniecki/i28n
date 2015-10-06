navigator.mozHour12 = false;

var elem = document.getElementsByTagName('h1')[0];

var now = 2 * 60 * 60 * 1000 + 35 * 60 * 1000 + 12 * 1000;

navigator.mozI18n.setValue(elem, now);

var elem2 = document.getElementsByTagName('h2')[0];

var relTime = Date.now() - 4 * 60 * 1000;
navigator.mozI18n.setValue(elem2, relTime);

