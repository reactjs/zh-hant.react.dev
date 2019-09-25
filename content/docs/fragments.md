---
id: fragments
title: Fragments
permalink: docs/fragments.html
---

React 其中一種常見的使用情況是在一個 component 中回傳多個 element，fragment 讓你能夠在不用增加額外 DOM 節點的情況下，重新組合 child component。

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

還有一種[簡寫語法](#short-syntax)可以用來宣告 fragment。
<!-- There is also a new [short syntax](#short-syntax) for declaring them. -->

## 動機 {#motivation}

常見的情況是在 component 裡回傳一連串的 child element，看看這個 React 的程式碼片段：

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

為了使 render 出來的 HTML 是有效的，`<Columns />` 需要回傳多個 `<td>` element。如果將 parent div 元素放在 `<Columns />` 中的 `render()` 區塊，將會使生成的 HTML 無效。

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

在 `<Table />` 內的輸出如下：

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

這個問題交給 fragment 解決。

## 使用方式 {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```

會讓 `<Table />` 得到一個正確的輸出：

```jsx
<table>
  <tr>
    <td>Hello</td>
    <td>World</td>
  </tr>
</table>
```

### 簡寫語法 {#short-syntax}

你可以用新的簡寫語法來宣告 fragment，它看起來就像空標籤：

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```
你可以像使用其他元素一樣使用 `<></>`，但值得注意的是它並不支援 key 和 attribute。

### Keyed Fragments {#keyed-fragments}

透過明確宣告 `<React.Fragment>` 的 fragment 可能會遇到帶有 key 的情況。一個使用案例是將它 mapping 到 fragment array。舉例來說，像下方程式碼一樣建立一個敘述列表：

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 如果缺少 key ， React 會發出一個缺少 key 的警告
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

目前 `key` 是唯一可以傳遞給 `Fragment` 的 attribute。之後我們可能會支援更多的 attribute，像是 event handler。

### Live Demo {#live-demo}

你可以透過 [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000) 嘗試新的 JSX fragment 語法。
