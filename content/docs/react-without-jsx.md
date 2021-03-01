---
id: react-without-jsx
title: 不使用 JSX 開發 React
permalink: docs/react-without-jsx.html
---

JSX 對於使用 React 並不是不可或缺的。當你不想在開發環境中設置編譯時，不使用 JSX 開發 React 格外方便。

每個 JSX 元素都只是呼叫 `React.createElement(component, props, ...children)` 的語法糖。所有任何你能用 JSX 做的事，你都能用純 JavaScript 做到。

比如，這段用 JSX 寫成的編碼：

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

可以編譯成這段沒有 JSX 的程式碼：

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

如果你想看更多 JSX 是如何轉換成 JavaScript 的範例，你可以嘗試[線上 Babel 編譯器](babel://jsx-simple-example)。

Component 可以是一個字串、可以是 `React.Component` 的 subclass，或是個 plain function。

如果你已經疲於不斷重複寫 `React.createElement`，一個常見的方式是賦予一個縮寫：

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

如果你使用這個 `React.createElement` 縮寫的格式，他可以跟不使用 JSX 開發 React 一樣方便。

此外，你也可以參考社群專案像是 [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) 和 [`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers)，這些專案提供了更為簡潔的語法。
