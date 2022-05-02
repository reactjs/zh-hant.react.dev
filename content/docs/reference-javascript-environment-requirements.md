---
id: javascript-environment-requirements
title: JavaScript 環境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 依賴 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) 和 [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 集合類型。如果你需要支援舊瀏覽器和設備，它們原生並沒有支援（例如 IE < 11）或是沒有兼容的實作（例如 IE 11），請考慮於應用程式加入一個全域的 polyfill，例如 [core-js](https://github.com/zloirock/core-js)

使用 core-js 支援舊瀏覽器的 React 16 的 polyfill 環境大致如下：
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
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
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d
