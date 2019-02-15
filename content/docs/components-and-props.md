---
id: components-and-props
title: Components 與 Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Component 使你可以將 UI 拆分成獨立且可複用的程式碼，並且專注於各別程式碼的思考。本章節旨在介紹 component 的相關概念，你也可以在此參閱[詳細的 API 文件](/docs/react-component.html)。

概念上來說，component 就像是 JavaScript 的 function，它接收任意的參數（稱之為「props」）並且回傳描述畫面的 React element。

## Function Component 與 Class Component {#function-and-class-components}

定義 component 最簡單的方法即是撰寫一個 Javascript function：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

此 function 是一個符合規範的 React component，因為它接受一個「props」（指屬性 properties）物件並回傳一個 React element。我們稱之為 function component，因為它本身就是一個 JavaScript functions。

同樣的，你也可以使用 [ES6 Class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 來定義 component：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

上述兩種 component 在 React 中是同等的。

我們將會在[下一個章節]((/docs/state-and-lifecycle.html))探討 class 所擁有的額外特性，但在那之前，我們會使用 function component 來保持簡潔。

## Render 一個 Component {#rendering-a-component}

在此之前，我們只見過這種相當於 DOM 標籤的 React element：

```js
const element = <div />;
```

不過，React element 也可以是使用者自定義的 component：

```js
const element = <Welcome name="Sara" />;
```

當 React element 為使用者定義的 component 時，它會將 JSX 所接收的屬性作為一個物件傳遞給 component，這一個物件被稱為「props」。

舉例來說，這段程式碼會在頁面上 render 出「Hello, Sara」：

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[在 CodePen 上試試看吧！](codepen://components-and-props/rendering-a-component)

讓我們來複習一下這個例子發生了什麼事：

1. 我們對 `<Welcome name="Sara" />` 這個 element 呼叫了 `ReactDOM.render()`。
2. React 以 `{name: 'Sara'}` 作為 props 傳入 `Welcome` component 並呼叫。
3. `Welcome` component 回傳了 `<h1>Hello, Sara</h1>` 這個 element 作為返回值。
4. React DOM 有效的將 DOM 更新為 `<h1>Hello, Sara</h1>`。

>**注意：** Component 的字首須為大寫字母
>
>React 會將小寫字母開頭的組件視為原始 DOM 標籤，舉例來說，`<div />` 就會被視為是 HTML 的 div 標籤，但是 `<Welcome />` 則是一個 component，而且需要在作用域中使用 `Welcome`。
>
>想要了解更多關於此慣例的原因，請參閱 [JSX In Depth](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized) 章節。

## 組合 Component {#composing-components}

Component 可以在輸出中引用其他 component。我們可以在任何層次中抽象化相同的 component，按鈕、表單、對話框、甚至是整個畫面，在 React 應用程式中都將以 component 的方式呈現。

舉例來說，我們可以建立一個 render 多次 `Welcome` 的 `App` component：

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[在 CodePen 上試試看吧！](codepen://components-and-props/composing-components)

通常來說，每個 React 應用程式都有一個最高層級的 `App` component。然而，如果你將 React 結合至現存的應用程式中，你可能需要使用像 `Button` 這樣的小型 component，並由下往上，逐步應用到畫面的最高層級。

## 抽取 Component {#extracting-components}

別害怕將 component 拆分成更小的 component。

舉例來說，我們看這個 `Comment` 的 component：

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[在 CodePen 上試試看吧！](codepen://components-and-props/extracting-components)

它接受 `author` (一個物件)、`text` (一個字串)、還有 `date` (一個日期) 作為它的 props。它的作用是在一個社交網站上 render 一則評論。

這個 component 可能因為太多的巢狀關係而難以更動，而且也難以複用獨立的部分。讓我們把一些 component 從中分離吧。

首先, 我們將 `Avatar` 分離出來：

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

這個 `Avatar` 並不需知道它會被 render 在 `Comment` 中。這是為什麼我們給他一個更為一般的名字：`user` 而不是 `author`。

我們建議從 component 的角度為 props 命名，而不是它的使用情境。

現在我們可以稍微簡化 `Comment`：

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

接下來，我們將 `UserInfo` component 也抽離出來，它會在使用者名稱旁邊 render `Avatar` component：

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

讓我們將 `Comment` 更加簡化：

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[在 CodePen 上試試看吧！](codepen://components-and-props/extracting-components-continued)

在一開始，將 component 抽離出來可能是一件繁重的工作，但是在較大的應用程式中，建構可複用的 component 是非常值得。以經驗來說，如果一個 UI 中有一部分會被重複使用很多次（`Button`、`Panel`、`Avatar`），或者它足夠複雜到自成一個 component（`App`、`FeedStory`、`Comment`），那它就適合被抽出作為一個可複用的 component。

## Props 是唯讀的 {#props-are-read-only}

不管你使用 [function 或是 class 來宣告 component](#function-and-class-components)，都絕不能修改自己的 props。例如這個 sum function：

```js
function sum(a, b) {
  return a + b;
}
```

像這樣的 function 是 [Pure function](https://en.wikipedia.org/wiki/Pure_function) 的，因為他們並沒有改變輸入，而且相同的輸入總是回傳一樣的結果。

相反地，這個 function 並非 Pure function，因為它更改了它的參數：

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React 是很彈性的，但有一條嚴格的規定：

**所有的 React component 都必須像 Pure function 一般保護他的 props**

當然，應用程式的 UI 是動態的，而且總是隨著時間改變。在[下個章節](/docs/state-and-lifecycle.html)，我們會介紹一個新的概念「state」。State 可以在不違反上述規則的前提下，讓 React component 隨使用者操作、網路回應、或是其他方式改變輸出內容。
