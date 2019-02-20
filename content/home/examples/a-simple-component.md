---
title: 簡單的 Component
order: 0
domid: hello-example
---

React component 需要實做 `render()` function，這個 function 接受輸入的資料並回傳需要顯示的內容。這個範例使用了 JSX，一個類似 XML 的語法。傳入給元件的輸入資料可以透過 `this.props` 在 `render()` function 中存取。

**使用 React 並不一定要使用 JSX。** 試試看 [Babel REPL](babel://es5-syntax-example) 來了解由 JSX 編譯步驟產生的原始 JavaScript 程式碼。
