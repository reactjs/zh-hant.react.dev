---
id: components-and-props
title: 元件與 Props
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

元件使你可以將 UI 拆分成獨立且可復用的程式碼，並且專注於各別程式碼的思考。本章節旨在介紹元件的相關概念，你也可以在此參閱[詳細的 API 文件](/docs/react-component.html)。

概念上來說，元件就像是 JavaScript 的函式，它接收任意的參數（稱之為 "props"）並且回傳描述畫面的 React 元素。

## 函式元件與類別元件{#function-and-class-components}

定義元件最簡單的方法即是撰寫一個 Javascript 函式：

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

此函式是一個符合規範的 React 元件，因為它接受一個 "props"（指屬性 properties）物件並回傳一個 React 元素。我們稱之為函式元件（function components），因為它本身就是一個 JavaScript functions。

同樣的，你也可以使用 [ES6 類別](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 來定義元件：

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

上述兩種元件的在 React 中是同等的。

我們將會在[下一個章節]((/docs/state-and-lifecycle.html))探討 class 所擁有的額外特性，但在那之前，我們會使用函式元件來保持簡潔。

## 描繪一個元件 {#rendering-a-component}

在此之前，我們只見過這種相當於 DOM 標籤的 React 元素：

```js
const element = <div />;
```

不過，React 元素也可以是使用者自定義的元件：

```js
const element = <Welcome name="Sara" />;
```

當 React 元素為使用者定義的元件時，它會將 JSX 所接收的屬性作為一個物件傳遞給元件，這一個物件被稱為 "props"。

舉例來說，這段程式碼會在頁面上繪製出 "Hello, Sara"：

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

1. 我們對 `<Welcome name="Sara" />` 這個元素調用了 `ReactDOM.render()`。
2. React 以 `{name: 'Sara'}` 作為 props 傳入 `Welcome` 元件並呼叫。
3. `Welcome` 元件回傳了 `<h1>Hello, Sara</h1>` 元素作為返回值。
4. React DOM 高效率的將 DOM 更新為 `<h1>Hello, Sara</h1>`。

>**注意：** 元件的字首須為大寫字母
>
>React 會將小寫字母開頭的組件視為原始 DOM 標籤，舉例來說，`<div />` 就會被視為是 HTML 的 div 標籤，但是 `<Welcome />` 則是一個元件，而且需要在作用域中使用 `Welcome`。
>
>想要了解更多此約定背後的原因，請參閱 [JSX In Depth](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized) 章節。

## 組合元件{#composing-components}

元件可以在輸出中引用其他元件。我們可以在任何層次中抽象化相同的元件，按鈕、表單、對話框、甚至是整個畫面，在 React 應用程式中都將以元件的方式呈現。

舉例來說，我們可以建立一個繪製多次 `Welcome` 的 `App` 元件：

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

通常來說，每個 React 應用程式都有一個最高層級的 `App` 元件。然而，如果你將 React 結合至現存的應用程式中，你可能需要使用項 `Button` 這樣的小元件，並由下往上，逐步應用到畫面的最高層級。

## 抽取元件 {#extracting-components}

別害怕將 component 分成更小的 component。

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

它接受 `author` (一個物件)、`text` (一個字串)、還有 `date` (一個日期) 作為它的 props。它的作用是在一個社交網站上繪製一個 comment。

這個元件可能因為太多的巢狀關係而難以更動，而且也難以復用獨立的部分。讓我們把一些元件從中分離吧。

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

這個 `Avatar` 並不需知道他會被繪製在 `Comment` 中。這是為什麼我們給他一個更為一般的名字： `user` 而不是 `author`.

我們建議從元件的角度為 props 命名，而不是它的使用情境。

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

接下來，我們將 `UserInfo` 元件也分離出來，它會在使用者名稱旁邊繪製 `Avatar` 元件：

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

在一開始，將元件分離出來可能是一件繁重的工作，但是在較大的應用程式中，建構可復用的元件是非常值得。以經驗來說，如果一個 UI 中有一部分會被重複使用很多次（`Button`、`Panel`、`Avatar`），或者它足夠複雜到自成一個元件（`App`、`FeedStory`、`Comment`），那它就適合被抽出作為一個可復用的元件。

## Props 的唯獨性 {#props-are-read-only}

不管你使用[函式或是類別來宣告元件](#function-and-class-components)，都絕不能修改自己的props。例如這個 sum 函式：

```js
function sum(a, b) {
  return a + b;
}
```

像這樣的函式是[純函數](https://en.wikipedia.org/wiki/Pure_function)的，因為他們並沒有改變輸入，而且相同的輸入總是回傳一樣的結果。

相反地，這個函式並非純函數，因為它更改了它的參數：

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React 是很彈性的，但有一條嚴格的規定：

**所有的 React 元件都必須像純函數函式一般保護他的 props**

當然，應用程式的 UI 是動態的，而且總是隨著時間改變。在[下個章節](/docs/state-and-lifecycle.html)，我們會介紹一個新的概念 "state"。State 可以在不違反上述規則的前提下，讓 React 元件隨使用者操作、網路回應、或是其他方式改變輸出內容。
