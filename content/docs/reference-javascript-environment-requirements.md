---
id: javascript-environment-requirements
title: JavaScript 環境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

React 16 依賴 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 集合類型。如果你需要支援舊瀏覽器和設備，它們原生並沒有支援（例如 IE < 11）或是沒有兼容的實作（例如 IE 11），請考慮於應用程式加入一個全域的 polyfill，例如 [core-js](https://github.com/zloirock/core-js) 或 [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)。

使用 core-js 支援舊瀏覽器的 React 16 的 polyfill 環境大致如下：

```js
import 'core-js/es/map';
import 'core-js/es/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

React 也依賴 `requestAnimationFrame`（即使在測試環境）。
你可以使用[raf](https://www.npmjs.com/package/raf) package 去 shim `requestAnimationFrame`：

```js
import 'raf/polyfill';
```
