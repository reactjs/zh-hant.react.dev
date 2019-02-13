---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

React 最簡單的範例看起來像是：

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

在頁面上顯示「Hello, world!」。

[](codepen://hello-world)

點擊上方連結開啟線上編輯器。請隨意的變更程式碼並觀察它們的輸出變化。大部分的文件頁面都有像這樣可以編輯的範例。


## 如何閱讀本指南 {#how-to-read-this-guide}

在這份指南中，我們會研究 React 應用程式的基本組成：元素與組件。一旦理解它們之後，你可以從小巧且可覆用的 Component，拼湊出複雜的應用程式。

>Tip
>
>本篇指南設計給喜歡**按部就班**的朋友。若喜歡動手做的朋友，請參考我們的[實用指南](/tutorial/tutorial.html)。你可能會發現本篇指南和教學課程其實是相輔相成的。

本篇是 React 主要概念的第一章節。你可以在側邊的導航欄中找到所有章節的列表。如果你從手機裝置上瀏覽，可以透過點擊螢幕右下角的按鈕來瀏覽選單。

本篇指南的每個章節都是基於前一章節的知識。**你可以按照側邊欄中顯示的順序閱讀「主要概念」指南章節，來了解 React 大部分的內容。**舉例來說，這篇章節的下一章是[「JSX 入門」](/docs/introducing-jsx.html)。

## 需要的知識 {#knowledge-level-assumptions}

React 是一個 JavaScript 的函式庫，而且我們假設你有一些 JavaScript 的基礎知識。**如果你感到沒有自信的話，我們推薦[讀過一遍這個 JavaScript 教學課程](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)**來確認你的知識水平如何，確保你可以跟上本篇指南。這需要花費大概 30 分鐘到 1 小時，但你不會覺得你在學習 React，同時又在學習 JavaScript。

>注意
>
>本篇指南偶爾會使用較新的 JavaScript 語法。若近年內沒有接觸過 JavaScript，只要看一下[這三個心法](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c)即可。

## 馬上開始吧！ {#lets-get-started}

繼續滾動頁面至底部，你會找到進入[下一章的連結](/docs/introducing-jsx.html)。
