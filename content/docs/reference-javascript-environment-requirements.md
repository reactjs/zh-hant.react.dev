---
id: javascript-environment-requirements
title: JavaScript 環境要求
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

支援所有現代的瀏覽器（Edge、Firefox、Chrome、Safari，等等）。

如果你支援更舊的瀏覽器或是裝置像是 Internet Explorer，它們沒有提供現代瀏覽器功能，或是不合規範的實作，考慮在你的應用程式 bundle 內引入一個全域的 polyfill。

以下是 React 18 使用的現代 feature 的列表：
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

這些功能的正確 polyfill 取決於你的環境。對於許多使用者，你可以設定你的[瀏覽器列表](https://github.com/browserslist/browserslist)設定。對於其他人，你可能需要直接 import 像 [`core-js`](https://github.com/zloirock/core-js) 這樣的 polyfill。
