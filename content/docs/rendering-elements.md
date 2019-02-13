---
id: rendering-elements
title: Render Element
permalink: docs/rendering-elements.html
redirect_from:
  - "docs/displaying-data.html"
prev: introducing-jsx.html
next: components-and-props.html
---

建立 React 應用程式最小的單位是 element。

一個 element 描述你想要在螢幕上所看到的：

```js
const element = <h1>Hello, world</h1>;
```

與瀏覽器的 DOM element 不同，React element 是單純的 object，而且很容易的被建立。React DOM 負責更新 DOM 來符合 React element。

>**注意：**
>
>大家可能會將 element 與更廣為人知的「component」概念混淆。我們將會在[下一個章節](/docs/components-and-props.html)介紹 component。Element 是由 component 所「組成」的，我們建議你在開始之前閱讀本章節。

## Render Element 到 DOM 內 {#rendering-an-element-into-the-dom}

假設你的 HTML 檔案內有一個 `<div>`：

```html
<div id="root"></div>
```

我們稱為這是一個「root」DOM node，因為所有在內的 element 都會透過 React DOM 做管理。

使用 React 建立應用程式時，通常會有一個單一的 root DOM node。如果你想要整合 React 到現有的應用程式時，你可以根據你的需求獨立出多個 root DOM node。

如果要 render 一個 React element 到 root DOM node，傳入兩者到 `ReactDOM.render()`：

`embed:rendering-elements/render-an-element.js`

[**在 CodePen 上試試看吧！**](codepen://rendering-elements/render-an-element)

在網頁上你會看見顯示「Hello, world」。

## 更新被 Render 的 Element {#updating-the-rendered-element}

React element 是 [immutable](https://en.wikipedia.org/wiki/Immutable_object) 的。一旦你建立一個 element，你不能改變它的 children 或是 attribute。Element 就像是電影中的一個幀：它代表特定時間點的 UI。

憑藉我們迄今為止對 React 的認識，更新 UI 唯一的方式是建立一個新的 element，並且將它傳入到 `ReactDOM.render()`。

思考以下這個 ticking clock 的範例：

`embed:rendering-elements/update-rendered-element.js`

[**在 CodePen 上試試看吧！**](codepen://rendering-elements/update-rendered-element)

它從 [`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) callback 每秒呼叫 `ReactDOM.render()`。

>**注意：**
>
>在實踐中，大部分 React 應用程式只呼叫 `ReactDOM.render()` 一次。在下一個章節中，我們將會學習如何將這些程式碼封裝到 [stateful component](/docs/state-and-lifecycle.html)。
>
>我們建議你不要跳過這個主題，因為它們是彼此關聯的。

## React 只更新必要的 Element {#react-only-updates-whats-necessary}

React DOM 會將 element 和它的 children 與先前的狀態做比較，並且只更新必要的 DOM 達到理想的狀態。

你可以透過瀏覽器工具來檢測[最後一個範例](codepen://rendering-elements/update-rendered-element)做驗證：

![DOM inspector showing granular updates](../images/docs/granular-dom-updates.gif)

即使我們在每秒建立一個 element 描述整個 UI tree，只有內容更改的 text node 才會被 React DOM 更新。

根據我們的經驗，應該思考 UI 在任何時候應該如何呈現，而不是隨著時間的推移去消除錯誤。
