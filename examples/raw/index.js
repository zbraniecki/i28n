navigator.mozHour12 = false;

var elem = document.getElementsByTagName('h1')[0];

var now = Date.now();

navigator.mozI18n.setValue(elem, now);

var elem2 = document.getElementsByTagName('h2')[0];

navigator.mozI18n.setAttributes(elem2, 'datetime', 1000000000, {
"year": "numeric",
"weekday": "long",
"day": "numeric",
"hour": "numeric",
"minute": "numeric"
});
//navigator.mozI18n.setValue(elem2, 15);
