---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

React 最小的範例看起來像是：

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

在頁面上顯示 "Hello, world!"。

[](codepen://hello-world)

按上面的連結會打開一個線上編輯器。歡迎把玩，看看輸出有什麼變化。本站的許多頁面都有像上面一樣可以編輯的範例。


## 如何閱讀本指南 {#how-to-read-this-guide}

本篇我們來看看 React 應用的基本組成：元素與組件。學好了這兩個，就可以打造小巧復用的組件，拼湊出複雜的應用。

>秘訣
>
>本指南設計給喜歡**按部就班**的朋友。若喜歡動手做的朋友，請參考我們的[實用指南](/tutorial/tutorial.html)。但兩篇其實相輔相成。

本篇是 React 主要概念的第一章節。可以在旁邊的選單中找到所有的章節。若從手機瀏覽，按右下方的菜單。

本指南的每章都是基於前一章的知識。**按旁邊菜單的順序，依序閱讀“主要概念”後，可以掌握大多數的 React。**舉例來說，這章的下一章是 [“JSX 入門”](/docs/introducing-jsx.html)。

## 需要的知識 {#knowledge-level-assumptions}

React 是一個 JavaScript 的函式庫，我們期待你略懂些 JavaScript 的基礎知識。**沒有自信的話，推薦[過一遍這個 JavaScript 教學](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)**來檢查看看你的 JavaScript 水平如何，確保你可以跟上本指南。大該需要 30 分鐘到一小時，但就不會感覺你在學 React，同時又得學 JavaScript。

>注意
>
>本指南偶爾會使用較新的 JavaScript 語法。若近年內沒有接觸過 JavaScript，只要看一下[這三個心法](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c)即可。

## 馬上開始吧! {#lets-get-started}

往下滑，在頁面底部上，你會找到進入[下一章的連結](/docs/introducing-jsx.html)。
