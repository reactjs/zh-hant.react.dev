---
id: javascript-environment-requirements
title: JavaScript 環境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 依懶集合類型 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)。假若你需要支持舊式的瀏覽器和設備，而它們並沒有原生的支持（例如 IE < 11）或使用不合規格的做法（例如 IE 11），請考慮於應用程式加入一個全局的 polyfill，例如 [core-js](https://github.com/zloirock/core-js) 或 [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)。

一個使用 core-js 來支持舊式瀏覽器的 React 16 環境大致如下：

```js
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React 也依賴於 `requestAnimationFrame`（甚至包括測驗環境）。
你可以使用[raf](https://www.npmjs.com/package/raf) package 去 shim `requestAnimationFrame`：

```js
import 'raf/polyfill';
```
