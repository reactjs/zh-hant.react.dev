---
id: tutorial
title: "Tutorial: Intro to React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

你不需要有任何 React 的基礎知識就能使用這份學習指南。

## 在我們開始這份教學課程之前 {#before-we-start-the-tutorial}

在這份學習指南中，我們會練習做一個小遊戲。**也許你會很想跳過這份指南，因為你不是遊戲開發者 -- 但請試著跟著做做看。** 在這份學習指南中，你所學到的技術是你做任何 React 應用程式的基礎，掌握基礎後會讓你對 React 有更深入的了解。

>Tip
>
>這份學習指南是設計給那些喜歡**從做中學**的人們。如果你比較喜歡從零開始學習概念的話，請參考我們的[逐步教學](/docs/hello-world.html)。你可能會發現本篇指南和教學課程其實是相輔相成的。

這份指南分成以下幾個部分：

* [教學設定](#setup-for-the-tutorial) 會給你一個開始這份指南的**起始點**。
* [概論](#overview)會教你 React 中的**重要基礎**：components、props 和 state。
* [完成遊戲](#completing-the-game) 會教你在 React 開發中**最常見的技術**。
* [加入 Time Travel](#adding-time-travel) 會讓你對 React 獨特的優點有**更深的見解**。

你不需要一次就完成所有的部分才能從這份學習指南中獲益。試著練習越多越好 -- 即使只有一兩個部分。

當你在跟著指南練習時，複製貼上程式碼是沒關係的，但我們建議你把程式自己寫過一遍。這會幫助你訓練手感並加強理解。

### 我們要做什麼？ {#what-are-we-building}

在這份學習指南中，我們會教你如何用 React 做一個互動式的圈圈叉叉小遊戲。

在這裡你可以看到我們將會做什麼：**[完成結果](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**。如果你看不懂其中的程式碼，或是你對其中的語法不熟，請不要擔心！這份指南的目的就是要幫助你了解 React 及其語法。

我們建議你在往下看這份指南之前，先看看上面這個圈圈叉叉小遊戲。你會注意到遊戲格子的右邊有一個數字列表。這個列表將會列出遊戲中的所有動作的歷史，並在遊戲進行的同時更新。

當你稍微了解這個圈圈叉叉小遊戲是怎麼玩的之後，你就可以把它關掉了。 在這份指南中，我們會從更簡單的模板開始。我們的下一步是進行設定以幫助你開始開發這個遊戲。

### 先決條件 {#prerequisites}

我們假設你對 HTML 和 JavaScript 有一定的熟悉度，但即使你的背景是另一種程式語言，你應該也能游刃有餘地理解這份指南。我們也假設你對程式語言的中的某些概念，如 function、 object、array 以及（某種程度上）class，有一定的涉獵。

如果你需要複習 JavaScript，我們建議你閱讀這份[教學指南](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)。請注意我們也會用到一些 ES6，也就是 JavaScript 最新的版本之一。在這份指南中，我們將會使用 [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)、[class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)、[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)，和 [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) 等表達式。你也可以用 [Babel REPL](babel://es5-syntax-example) 看看 ES6 的程式碼是如何被編譯的。

## 教學設定 {#setup-for-the-tutorial}

完成這份指南有兩種方法：你可以在瀏覽器中寫程式碼，或在你的電腦裡建立一個本地的開發環境。

### 設定選項 1：在瀏覽器中寫程式碼 {#setup-option-1-write-code-in-the-browser}

這是開始最快的方法！

首先，在瀏覽器中的分頁中打開這份**[Starter Code](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**。你應該會看到一個空白的圈圈叉叉遊戲格和一些 React 的程式碼。我們會在接下來的指南中，修改 React 的程式碼。

你現在可以跳過第二個選項，並前往[概論](#overview)的章節來了解 React 如何運作。

### 設定選項 2：建立本地開發環境 {#setup-option-2-local-development-environment}

對完成這份指南來說，這完全是看你是否需要，而非必要的設定！

<br>

<details>

<summary><b>可選擇：以下為在本地環境中使用你想要的編輯器所需要的步驟</b></summary>

這個設定需要花些時間，但能讓你在你想要的編輯器上完成這份指南。以下是設定步驟：

1. 確認你有安裝一個較新的版本的 [Node.js](https://nodejs.org/en/)。
2. 按照 [Create React App 安裝步驟](/docs/create-a-new-react-app.html#create-react-app)的指示建立一個新專案。

```bash
npx create-react-app my-app
```

3. 刪除新專案中 `src/` 資料夾裡的所有檔案。

> 注意：
>
>**請不要刪除整個 `src` 資料夾，只要刪除裡面的原始檔就好。**下一步，我們將會把預設的原始檔換成這個遊戲所需的範例檔。

```bash
cd my-app
cd src

# 如果你用的是 Mac 或 Linux：
rm -f *

# 如果你用 Windows：
del *

# 然後，回到原本的專案資料夾
cd ..
```

4. 在 `src/` 資料夾中加入[這個 CSS 程式碼](https://codepen.io/gaearon/pen/oWWQNa?editors=0100)並命名為 `index.css`。

5. 在 `src/` 資料夾中加入[這個 JS 程式碼](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)並命名為 `index.js` 的檔案。

6. 在 `src/` 資料夾中加入這三行程式碼在 `index.js` 檔案的最上方：

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

現在如果你在專案資料夾執行 `npm start` 並在瀏覽器中打開 `http://localhost:3000`，你會看到一個空白的圈圈叉叉遊戲格。

我們推薦你跟著[這份指南](https://babeljs.io/docs/editors/)來設定你的編輯器中的語法亮高（syntax highlighting）。

</details>

### 救命呀，我卡住了！ {#help-im-stuck}

如果你卡住了，請參考[社群資源](/community/support.html)。其中[Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n)可以讓你很快得到幫助。如果沒人回覆，或者你依然無法解決，請填寫一個 issue，我們會提供協助。

## 概論 {#overview}

設定完成後，讓我們來討論 React 的概論吧！

### React 是什麼？ {#what-is-react}

React 是一個陳述式、高效且具有彈性的 JavaScript 函式庫，用以建立使用者介面。它讓你使用小巧而獨立的「component」，來建立複雜的 UI。

React 有數種不同的 component，但我們先從 `React.Component` 這個 subclass 開始：

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Example usage: <ShoppingList name="Mark" />
```

我們稍後會解釋那些看起來很有趣像是 XML 的 tag。我們使用 component 告訴 React 我們想要在螢幕上看到什麼。當我們的資料改變時，React 將會很有效率地更新並 re-render 我們的 component。

在這裡，ShoppingList 是一個 **React 的 component class**，或 **React component type**。Component 會接受名為 `props` 的參數（「properties」的簡稱），並透過 `render` 這個方法回傳一個有階層架構的 view 到螢幕上。

`render` 方法回傳你想在螢幕上看到的*描述*。React 接收這個描述並展示其結果。其中，`render` 回傳的是一個 **React element**，也就是一個 render 內容的輕量描述。大部分 React 的開發者會使用一種特殊的語法，被稱為「JSX」，因為它讓這些結構寫起來更容易。`<div />` 語法在構建時被建立為 `React.createElement('div')`。上述的例子其實也等同於以下這些程式碼：

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[你可以按這裡看到完整版](babel://tutorial-expanded-version)。

如果你想了解更多 `createElement()`，在 [API 參考](/docs/react-api.html#createelement)中有更詳細的解釋，但我們不會在這份指南中用到它。我們會繼續使用 JSX。

JSX 就跟 JavaScript ㄧ樣強大。你可以在 JSX 中的括號中放入*任何* JavaScript 的表達式。每個 React element都是一個 JavaScript 的 object，你可以把它存在一個變數中或在程式中互相傳遞。

上述的 `ShoppingList` component 只會 render 內建如 `<div />` 和 `<li />` 的 DOM component。此外，你也可以組合 render 客製的 React component。例如，我們現在可以用 `<ShoppingList />` 來使用 shopping list。每個 React component 都是封裝好並能獨立運作的。React 讓你能用簡單的 component 建立複雜的 UI。

## 檢查你的 Starter Code {#inspecting-the-starter-code}

如果你打算在**你的瀏覽器** 中練習這份指南的話，請在分頁中開啟這份程式：**[Starter Code](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**。如果你打算在**本地開發環境** 中練習，在你的專案資料夾中打開 `src/index.js`（你在 [setup](#setup-option-2-local-development-environment) 時已接觸過這個檔案）。

這個 Starter Code 是我們接下來練習的基礎。我們已幫你準備好了 CSS，如此一來，你只需要把注意力集中在學習 React 和完成圈圈叉叉小遊戲的程式上。

請看看其中的程式。你會注意到我們有三個 React component：

* Square
* Board
* Game

Square component 會 render 一個按鈕 `<button>`，而 Board 則 render 九個方格。Game component 則是 render 一個完整的遊戲格盤與 placeholder，這些值我們稍候會修改。目前為止，沒有一個 component 是互動式的。

### 透過 Props 傳遞資料 {#passing-data-through-props}

做為暖身，讓我們試試看把一些資料從 Board component 傳給 Square component。

在 Board 的 `renderSquare` 方法中，請修改程式碼，並把名為 `value` 的 prop 傳給 Square：

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

接著請改變 Square 中的 `render` 方法，將 `{/* TODO */}` 替換成 `{this.props.value}` ，以顯示 value 的值：

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

修改前：

![React Devtools](../images/tutorial/tictac-empty.png)

修改後：你應該會看到每個方格中都有一個數字。

![React Devtools](../images/tutorial/tictac-numbers.png)

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

恭喜！你剛剛已順利將把 prop 從 parent Board component 傳給 child Square component。傳遞 props 是 React 的應用程式中資訊從 parent 傳給 children 的方式。

### 建立互動式的 Component {#making-an-interactive-component}

讓我們在點擊 Square component 時，能在方格中填入ㄧ個 X。 
首先，把從 Square component 的 `render()` 中回傳的按鈕的標籤 ，修改成以下的程式：

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

現在，當我們點擊任何一個 Square 時，我們應該能在瀏覽器中收到一個 alert。

>注意：
>
>為了節省空間和避免 [`this` 令人困惑的行為](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)，我們將會在這裡以及以下的指南使用 [arrow function 語法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 來寫 event handler：
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>注意在 how with `onClick={() => alert('click')}`中，我們會把一個 *function* 做為 `onClick` 的 prop 往下傳。這個 function 只會在被點擊後觸發。 把 `() =>` 寫成 `onClick={alert('click')}` 是一個常見的錯誤，這會造成 component 在每次 re-render 時都觸發 alert。

下一步，我們要讓 Square component 記得它被點擊了，並在方格中填入 X 這個記號。Component 使用 **state** 來保持狀態。。

React 的 component 可以藉由在其 constructor 中設定 `this.state` 來維持一個 state。`this.state` 對於在其被定義的 React component 中來說應該要是 private 的。 讓我們現在的 Square 的存在 `this.state`中，然後在 Square 被點擊後改變這個值：

首先，我們要先加一個 constructor 在 class 中以初始化 state：

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>注意：
>
>在 [JavaScript class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) 中，當你定義一個 subclass 的 constructor 時，你總是會需要呼叫 `super`。所有的 React component class，凡是有 `constructor` 的，都應該要從呼叫 `super(props)` 開始。

現在我們會改變 Square 的 `render` 方法以顯示當 Square 被點擊時當下的 state 的值是什麼：

* 把 `<button>` 標籤中的 `this.props.value` 換成 `this.state.value`。
* 把 `() => alert()` 這個 event handler 換成 `() => this.setState({value: 'X'})`。
* 將 `className` 和 `onClick` 兩個 prop 放在不同行，以方便閱讀。

在上述修改完成後，在 Square 的 `render` 方法中回傳的 `<button>` 標籤現在看起來是這樣：

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

藉由從 Square 的 `render` 方法中的 `onClick` handler 呼叫 `this.setState`，我們告訴 React：當該 Square 的 `<button>` 被點擊時，要 re-render。在這個修改後， Square 的 `this.state.value` 值將會變成 `'X'` ，所以我們將會在遊戲格盤中看到 `'X'`。當你點擊任何一個方格，應該能看到 `'X'`。

當你在一個 component 中呼叫 `setState` 時，React 也會自動更新其中的 child component。

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### 開發者工具 {#developer-tools}

React 在 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) 和 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) 中的 Devtools extension 讓你用你的瀏覽器的開發者工具檢查 React component 的 tree。

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools 讓你檢查你的 React component 中的 props 和 state。

在安裝 React DevTools 後，你在網頁上對任何元素按右鍵，之後按 Inspect 開啟開發者工具，React 的 tab 會是右邊數來第一個。

**然而，請注意在 CodePen 中使用開發者工具需要一些額外的步驟：**

1. 登入網站，或註冊並確認你的 email (為防止 spam 的必要手續)。
2. 點擊 Fork 按鈕。
3. 點擊 Change View 並選擇 Debug mode。
4. 在新開啟的分頁中，devtools 現在應該有 React 的 tab 了。

## 完成遊戲 {#completing-the-game}

現在我們已經為我們的圈圈叉叉遊戲準備好基本的要件了。為了要做出一個完整的遊戲，我們現在需要在遊戲格盤中交互地放入 X 和 O，我們也需要決定如何分出勝負。

### 把 State 往上傳 {#lifting-state-up}

目前，每個 Square component 都能更新這個遊戲的 state。如果要分出勝負的話，我們需要將這九個方格的值都紀錄在某個地方。

也許我們會覺得 Board 應該從每個 Square 中確認該方格的狀態。雖然這個方法在 React 中是可行的，我們並不鼓勵你這麼做，因為你的程式碼會變得很難懂，很容易有 bug，也很難重寫。最好的方式是把這整個遊戲的 state 存放在 parent Board component 中，而不是在每一個 Square 中。Board component 會藉由傳遞 prop 的方式告訴每一個 Square 該顯示什麼值，[就如同我們剛開始先傳給每個 Square 一個數字是一樣的](#passing-data-through-props).

**為了從多個 children 中收集資料，或是讓兩個 child component 互相溝通，你需要在它們的 parent component 裡宣告一個共享的 state。這個 parent component 可以將 state 透過 proprs 向下傳給 children。這讓 child component 之間還有跟它們的 parent component 能隨時保持同步。**

在修改 React component 時，把 state 上傳到 parent component 裡面是很常見的。讓我們利用這個機會來試試看這該怎麼做。我們會在 Board 裡加一個 constructor，並將 Board 的初始 state 設定為一個包含九個 null 的 array。這九個 null 分別對應著九個 Square：

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

當我們稍後填滿格盤時，格盤會看起來像這樣：

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

Board 的 `renderSquare` 方法目前看起來是這樣：

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

一開始，我們從 Board [把 `value` 這個 prop 往下傳](#passing-data-through-props) 並在每一個 Square 中顯示數字 0 到 8。在之前的另一個步驟中，我們 [根據 Square 本身的 state](#making-an-interactive-component)把數字換成 Ｘ。這是為什麼 Square 目前會忽略 Board 傳給它的 `value` prop 的原因。

我們現在又會再使用傳遞 prop 的這個機制。我們會修改 Board 以告訴每個 Square 它現在的值（`'X'`，`'O'`， 或 `null`）該是什麼。我們已經在 Board 的 constructor 中定義了 `squares` 這個 array，接下來我們會修改 Board 的 `renderSquare` 方法以讀取這個 array：

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

每個 Square 將會接收一個 `value` prop，在空的方格中，它的值會是 `'X'`、 `'O'` 或 `null`。

接下來，我們需要改變當 Square 被點擊後會觸發的事件。 Board component 現在決定了哪一個方格會被填滿。We need to create a way for the Square to update the Board's state. Since state is considered to be private to a component that defines it, we cannot update the Board's state directly from Square.

To maintain the Board's state's privacy, we'll pass down a function from the Board to the Square. This function will get called when a Square is clicked. We'll change the `renderSquare` method in Board to:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Note
>
>We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn't insert a semicolon after `return` and break our code.

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. We'll make the following changes to Square:

* Replace `this.state.value` with `this.props.value` in Square's `render` method
* Replace `this.setState()` with `this.props.onClick()` in Square's `render` method
* Delete the `constructor` from Square because Square no longer keeps track of the game's state

After these changes, the Square component looks like this:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls `this.handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes.

>Note
>
>The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could name the Square's `onClick` prop or Board's `handleClick` method differently. In React, however, it is a convention to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

After these changes, we're again able to click on the Squares to fill them. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array to modify instead of modifying the existing array. We will explain why we create a copy of the `squares` array in the next section.

### Why Immutability Is Important {#why-immutability-is-important}

In the previous code example, we suggested that you use the `.slice()` operator to create a copy of the `squares` array to modify instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to *mutate* the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {#complex-features-become-simple}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {#detecting-changes}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[View the full code at this point](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Note
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides). In a class, we used an arrow function to access the correct `this` value, but in a function component we don't need to worry about `this`.

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

With this change, "X"s and "O"s can take turns. Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. We can determine a winner by adding this helper function to the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
