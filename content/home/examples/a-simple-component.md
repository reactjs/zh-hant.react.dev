---
title: 簡單的元件
order: 0
domid: hello-example
---

React 元件需要實做 `render()` 函式，這個函式接受輸入的資料並回傳需要顯示的內容。這個範例使用了 JSX，一個類似 XML 的語法。傳入給元件的輸入資料可以透過 `this.props` 在 `render()` 函式中存取。

**使用 React 並不一定要使用 JSX。** 試試看 [Babel REPL](babel://es5-syntax-example) 來了解由 JSX 編譯步驟產生的原始 JavaScript 程式碼。
