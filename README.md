I28n: Internationalization 2.0
=================================================================

I28n combines the Intl API with Gaia's IntlHelper and L20n's declarative API.

In result it makes HTML internationalizable with minimum JS code required.


How to use i28n
---------------

Include the following code in the `<head>` section of your HTML:

```html
<script src="./dist/i28n.js"></script>
```

In HTML
-------

```html
<span data-i18n-type="number" data-i18n-value="5"></span>
<span data-i18n-type="datetime" data-i18n-value="1446794044671"></span>
```

In JS
-----

```javascript

function logDateTime() {
  const formatter = document.mozI18n.get('datetime', {
    hour: 'numeric',
    minute: 'numeric'
  });
  console.log(formatter.format(Date.now());
}


document.mozI18n.observe('datetime', logDateTime);

```


Development
-----------

```bash
> npm install --dev

> gulp lint

> gulp build

> gulp watch

> gulp test
```

In order to test you need to have `FIREFOX_BIN` pointing at Nightly Firefox
executable since i28n uses es6 features available only there.
