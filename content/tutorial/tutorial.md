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

* [教學設定](#setup-for-the-tutorial)會給你一個開始這份指南的**起始點**。
* [概論](#overview)會教你 React 中的**重要基礎**：component、prop 和 state。
* [完成遊戲](#completing-the-game)會教你在 React 開發中**最常見的技術**。
* [加入時間旅行](#adding-time-travel)會讓你對 React 獨特的優點有**更深的見解**。

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

首先，在瀏覽器中的分頁中打開這份 **[Starter Code](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**。你應該會看到一個空白的圈圈叉叉遊戲格和一些 React 的程式碼。我們會在接下來的指南中，修改 React 的程式碼。

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

我們推薦你跟著[這份指南](https://babeljs.io/docs/editors/)來設定你的編輯器中的語法亮高。

</details>

### 救命呀，我卡住了！ {#help-im-stuck}

如果你卡住了，請參考[社群資源](/community/support.html)。其中[Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n)可以讓你很快得到幫助。如果沒人回覆，或者你依然無法解決，請填寫一個 issue，我們會提供協助。

## 概論 {#overview}

設定完成後，讓我們來討論 React 的概論吧！

### React 是什麼？ {#what-is-react}

React 是一個陳述式、高效且具有彈性的 JavaScript 函式庫，用以建立使用者介面。它讓你使用小巧而獨立的「component」，來建立複雜的 UI。

React 有數種不同的 component，但讓我們先從 `React.Component` 這個 subclass 開始談起：

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

// 使用範例：<ShoppingList name="Mark" />
```

我們稍後會解釋那些看起來很有趣像是 XML 的 tag。我們使用 component 告訴 React 我們想要在螢幕上看到什麼。當我們的資料改變時，React 將會很有效率地更新並重新 render 我們的 component。

在這裡，ShoppingList 是一個 **React 的 component class**，或 **React component type**。Component 會接受名為 `props` 的參數（「properties」的簡稱），並透過 `render` 這個方法回傳一個有階層架構的 view 到螢幕上。

`render` 方法回傳你想在螢幕上看到的*描述*。React 接收這個描述並展示其結果。其中，`render` 回傳的是一個 **React element**，也就是一個 render 內容的輕量描述。大部分 React 的開發者會使用一種特殊的語法，被稱為「JSX」，因為它讓這些結構寫起來更容易。`<div />` 語法在構建時被建立為 `React.createElement('div')`。上述的例子其實也等同於以下這些程式碼：

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[你可以按這裡看到完整版](babel://tutorial-expanded-version)

如果你想了解更多 `createElement()`，在 [API 參考](/docs/react-api.html#createelement)中有更詳細的解釋，但我們不會在這份指南中用到它。我們會繼續使用 JSX。

JSX 就跟 JavaScript ㄧ樣強大。你可以在 JSX 中的括號中放入*任何* JavaScript 的表達式。每個 React element 都是一個 JavaScript 的 object，你可以把它存在一個變數中或在程式中互相傳遞。

上述的 `ShoppingList` component 只會 render 內建如 `<div />` 和 `<li />` 的 DOM component。此外，你也可以組合 render 客製的 React component。例如，我們現在可以用 `<ShoppingList />` 來使用 shopping list。每個 React component 都是封裝好並能獨立運作的。React 讓你能用簡單的 component 建立複雜的 UI。

## 檢查你的 Starter Code {#inspecting-the-starter-code}

如果你打算在**你的瀏覽器**中練習這份指南的話，請在分頁中開啟這份程式：**[Starter Code](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**。如果你打算在**本地開發環境**中練習，在你的專案資料夾中打開 `src/index.js`（你在 [setup](#setup-option-2-local-development-environment) 時已接觸過這個檔案）。

這個 Starter Code 是我們接下來練習的基礎。我們已幫你準備好了 CSS，如此一來，你只需要把注意力集中在學習 React 和完成圈圈叉叉小遊戲的程式上。

請看看其中的程式。你會注意到我們有三個 React component：

* Square
* Board
* Game

Square component 會 render 一個按鈕 `<button>`，而 Board 會 render 九個方格。Game component 則是 render 一個完整的遊戲格盤與 placeholder，這些值我們稍候會修改。目前為止，沒有一個 component 是互動式的。

### 透過 Props 傳遞資料 {#passing-data-through-props}

做為暖身，讓我們試試看把一些資料從 Board component 傳給 Square component。

在 Board 的 `renderSquare` 方法中，請修改程式碼，並把名為 `value` 的 prop 傳給 Square：

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

接著請改變 Square 中的 `render` 方法，將 `{/* TODO */}` 替換成 `{this.props.value}`，以顯示 value 的值：

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

恭喜！你剛剛已順利將把 prop 從 parent Board component 傳給 child Square component。傳遞 prop 是 React 的應用程式中資訊從 parent 傳給 children 的方式。

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
>請注意在 how with `onClick={() => alert('click')}`中，我們會把一個 *function* 做為 `onClick` 的 prop 往下傳。這個 function 只會在被點擊後觸發。 把 `() =>` 寫成 `onClick={alert('click')}` 是一個常見的錯誤，這會造成 component 在每次重新 render 時都會觸發 alert。

下一步，我們要讓 Square component 「記得」它被點擊了，並在方格中填入 X 這個記號。Component 使用 **state** 來保持狀態。

React 的 component 可以藉由在其 constructor 中設定 `this.state` 來維持一個 state。`this.state` 對於在其被定義的 React component 中來說應該要是 private 的。讓我們來把目前 Square 的值儲存在 `this.state` 中，並在 Square 被點擊後改變這個值：

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
>在[JavaScript class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)中，當你定義一個 subclass 的 constructor 時，你總是會需要呼叫 `super`。所有的 React component class，凡是有 `constructor` 的，都應該要從呼叫 `super(props)` 開始。

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

藉由從 Square 的 `render` 方法中的 `onClick` handler 呼叫 `this.setState`，我們告訴 React：當該 Square 的 `<button>` 被點擊時，要 re-render。在這個修改後，Square 的 `this.state.value` 值將會變成 `'X'`，所以我們將會在遊戲格盤中看到 `'X'`。當你點擊任何一個方格，應該能看到 `'X'`。

當你在一個 component 中呼叫 `setState` 時，React 也會自動更新其中的 child component。

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### 開發者工具 {#developer-tools}

React 在 [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) 和 [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/) 中的 Devtools extension 讓你使用你的瀏覽器中的開發者工具檢查 React component 的 tree。

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React DevTools 讓你檢查你的 React component 中的 props 和 state。

在安裝 React DevTools 後，你在網頁上對任何元素按右鍵，之後按 Inspect 開啟開發者工具，React 的 tab 會是右邊數來第一個。

**然而，請注意在 CodePen 中使用開發者工具需要一些額外的步驟：**

1. 登入網站，或註冊並確認你的 email (為防止垃圾郵件的必要手續)。
2. 點擊 Fork 按鈕。
3. 點擊 Change View 並選擇 Debug mode。
4. 在新開啟的分頁中，devtools 現在應該有 React 的 tab 了。

## 完成遊戲 {#completing-the-game}

現在我們已經為我們的圈圈叉叉遊戲準備好基本的要件了。為了要做出一個完整的遊戲，我們現在需要在遊戲格盤中交互地放入 X 和 O，我們也需要決定如何分出勝負。

### 把 State 往上傳 {#lifting-state-up}

目前，每個 Square component 都能更新這個遊戲的 state。如果要分出勝負的話，我們需要將這九個方格的值都紀錄在某處。

也許我們會覺得 Board 應該從每個 Square 中確認該方格的狀態。雖然這個方法在 React 中是可行的，但我們並不鼓勵你這麼做，因為你的程式碼會變得很難懂，很容易有 bug，也很難重寫。最好的方式是把這整個遊戲的 state 存放在 parent Board component 中，而不是在每一個 Square 中。Board component 會藉由傳遞 props 的方式告訴每一個 Square 該顯示什麼值，[就如同我們剛開始先傳給每個 Square 一個數字是一樣的](#passing-data-through-props)。

**為了從多個 children 中收集資料，或是讓兩個 child component 互相溝通，你需要在它們的 parent component 裡宣告一個共享的 state。這個 parent component 可以將 state 透過 props 向下傳給 children。這讓 child component 之間還有跟它們的 parent component 能隨時保持同步。**

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

當我們稍後填滿棋盤時，棋盤會看起來像這樣：

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

一開始，我們從 Board[把 `value` 這個 prop 往下傳](#passing-data-through-props)並在每一個 Square 中顯示數字 0 到 8。在之前的另一個步驟中，我們[根據 Square 本身的 state](#making-an-interactive-component) 把數字換成 Ｘ。這是為什麼 Square 目前會忽略 Board 傳給它的 `value` prop 的原因。

我們現在又會再次使用傳遞 prop 的這個機制。我們會修改 Board 以告訴每個 Square 它現在的值（`'X'`，`'O'`或 `null`）該是什麼。我們已經在 Board 的 constructor 中定義了 `squares` 這個 array，接下來，我們會修改 Board 的 `renderSquare` 方法以讀取這個 array：


```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

每個 Square 將會接收一個 `value` prop，在空的方格中，它的值會是`'X'`、`'O'`或 `null`。

接下來，我們需要改變當 Square 被點擊後會觸發的事件。Board component 現在決定了哪一個方格會被填滿。我們需要創造一個方法讓 Square 去更新 Board 的狀態。既然 state 對於定義它的 component 來說是 private 的，我們就不能直接從 Square 去更新 Board 的 state。

要能維持 Board 的 state 的私有性，我們需要從 Board 傳一個 function 給 Square。這個 function 將在 Square 被點擊的時候被呼叫。我們也會改變 Board 中 `renderSquare` 的方法：

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

>注意
>
>為了方便閱讀，我們將回傳的 element 分成數行來寫，並加上括號，如此 JavaScript 才不會在 `return` 後加上一個分號並破壞我們的程式。

現在我們從 Board 傳兩個 prop 給 Square：`value` 和 `onClick`。`onClick` prop 是一個當 Square 被呼叫時可以點擊的 function。我們會在 Square 中做出如下的修改：

* 把 Square 的 `render` 方法中的 `this.state.value` 換成 `this.props.value`。
* 把 Square 的 `render` 方法中的 `this.setState()` 換成 `this.props.onClick()`。
* 把 `constructor` 從 Square 中刪除，因為 Square 已不再需要追蹤遊戲的狀態。

在上述修改完成後，Square component 現在看起來是這樣：

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

當一個 Square 被點擊時，`onClick` 這個 Board 所提供給它的 function 會被呼叫。我們來看一下這件事是如何做到的：

1. `onClick` prop 在內建的 DOM `<button>` component 告訴 React 要設定一個 click event listener。
2. 當按鈕被點擊時，React 會呼叫 `onClick` 這個 Square 的 `render()` 方法中的 event handler。
3. 這個 event handler 將會呼叫 `this.props.onClick()`。Square 中的 `onClick` prop 被 Board 選定。
4. 因為 Board 把 `onClick={() => this.handleClick(i)}` 傳給 Square，Square 會在被點擊時呼叫 `this.handleClick(i)`。
5. 我們尚未定義 `handleClick()`，所以我們的程式目前會崩潰。

>注意
>
>DOM `<button>` element 的 `onClick` 屬性對 React 來說有特別的意義，因為它是一個內建的 component。對於像是 Square 這種客製的 components 來說，命名方式是看你的喜好。我們可以把 Square 的 `onClick` prop 或是 Board 的 `handleClick` 方法以完全不同的方式命名。然而，在 React 中，我們遵循的傳統通常是用 `on[Event]` 來命名那些代表 event 的 prop，用 `handle[Event]` 來命名那些 handle event 的方法。

當我們試著點擊一個 Square，我們的程式應該會發生錯誤，因為我們尚未定義 `handleClick`。我們現在把 `handleClick` 加到 Board 的 class：

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

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

在這些修改完成後，我們現在又可以點擊 Squares 並填入內容了。然而，現在 state 是儲存在 Board component 而非個別的 Square component 中。當 Board 的 state 改變時，Square component 會自動 re-render。在 Board component 中維持所有方格的狀態將能使它在未來決定勝負。

因為 Square component 不再維持 state，Square component 從 Board component 接收 value 並在被點擊時通知 Board component 它的值。在 React 的詞彙中，Square component 現在是 **controlled component**。這意味著 Board 對其有完全的掌握。

注意在 `handleClick` 中，我們呼叫 `.slice()` 以創造一個 `squares` array 的 copy 並修改它，而非直接修改現有的 array。在下一個段落，我們將會解釋為什麼我們要創造一個 `squares` array 的 copy。

### 不可變性的重要性 {#why-immutability-is-important}

在上一段程式碼的範例中，我們建議你使用 `.slice()` 運算子去創造一個 `squares` array 的 copy 並修改它，而不是修改已存在的 array。現在我們來討論什麼是不可變性以及為什麼學習不可變性是很重要的。

一般來說，修改數據有兩種做法。第一種方法是透過改變數據的值來直接*修改*資料。第二種方法是改變 copy 中的數據，並用這個新的 copy 取代原本的數據。

#### 透過修改來變更數據 {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// 現在 player 是 {score: 2, name: 'Jeff'}
```

#### 不透過修改來變更數據 {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// 現在 player 保持不變，而 newPlayer 則是 {score: 2, name: 'Jeff'}

// 如果你想使用 object spread 語法的話，你可以用以下的寫法：
// var newPlayer = {...player, score: 2};
```

兩者的結果是相同的，但是藉由不直接修改數據（或直接更改底層數據 data），有下列幾個優點：

#### 簡化複雜功能 {#complex-features-become-simple}

不可變性使得複雜的功能變得更容易實現。稍後在這份教學指南中，我們將會實現「時間旅行」的功能。這個功能讓我們能回顧關關叉叉小遊戲的歷史並「跳回」之前的動作。這個功能並非只適用於遊戲 -- 復原動作與取消復原動作的功能是應用程式中很常見的需求。避免直接修改數據讓我們能將遊戲歷史先前的版本完整的保留下來，並在之後重新使用它們。

#### 偵測改變 {#detecting-changes}

在可變更的 object 中偵測改變是很困難的，因為這些改變是直接的。如果要偵測改變的話，我們需要比較這個可變更的 object 和它之前的 copy，並且遍歷整個 object tree。

相較之下，在不可變更的 object 中偵測改變就容易多了。如果某個不可變更 object 和之前不ㄧ樣，那麼這個 object 就已經被改變了。

#### 決定在 React 中該何時重新 render {#determining-when-to-re-render-in-react}

不可變性最主要的優點在於它幫助你在 React 中建立 _pure component_。我們能很容易決定不可變的數據中是否有任何改變，這幫助 React 決定某個 component 是否需要重新 render。

在[性能優化](/docs/optimizing-performance.html#examples)中，你可以深入了解 `shouldComponentUpdate()` 以及如何建立 *pure component*。

### Function Component {#function-components}

現在，我們來把 Square 改成一個 **function component**。

在 React 中，當我們要寫只包含 `render` 方法且沒有自己 state 的 component 時，**function component** 是一種很簡易的寫法。與其定義一個 class 並延伸 `React.Component`，我們可以寫用 `props` 作為輸入並回傳 render 的 function。相較於 class 來說，function component 寫起來比較沒有那麼乏味。許多的 component 都能以這種形式表達。

把 Square class 換成這個 function：

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

我們把出現過兩次的 `this.props` 通通換成 `props`。

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>注意
>
>當我們把 Square 變成 function component 的時候，我們也把 `onClick={() => this.props.onClick()}` 替換為更簡短的 `onClick={props.onClick}`（請特別注意在箭頭的*兩側*，原本的括號現在都不見了）。在這個 class 中，我們用 arrow function 以取得 `this` 的正確值。但是在 function component 中，我們並不需要擔心 `this` 是什麼。

### 輪流玩遊戲 {#taking-turns}

接下來，我們需要修正我們圈圈叉叉小遊戲中一個很明顯的缺陷：「O」沒辦法被放在棋盤上。

我們會將第一步的預設值設定為「X」。我們可以透過修改 Board constructor 內最初的 state 來設定這個預設值：

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

每當玩家做出一個動作，`xIsNext`（一個 boolean）就會被翻轉，以用來決定下ㄧ個玩家是誰，並儲存遊戲的 state。接下來，我們將更新 Board 的 `handleClick` function 以翻轉 `xIsNext` 的值：

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

這個改變會讓「X」和「O」輪流出現。我們也來更新一下 Board 的 `render` 中「status」的文字，讓它能顯示下ㄧ個玩家是誰：

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // 以下不需改變
```

在這些改變都完成後，你的 Board component 看起來應該會是這個樣子：


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

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### 決定勝負 {#declaring-a-winner}

在我們能顯示下一次輪到哪個玩家之後，我們也應該能在勝負揭曉時宣布誰是贏家，並告知玩家接下來沒有動作可出。我們可以在這個檔案的最後加上一個 helper function 來決定勝負：

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

我們會在 Board 的 `render` 方法中呼叫 `calculateWinner(squares)` 以確認是否有贏家產生。如果某個玩家贏了，我們可以顯示像「贏家：X」或「贏家：O」這樣的文字。接下來，讓我們把 Board 的 `render` function 中的 `status` 宣告換成以下的程式碼：

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
      // 以下不需改變
```

現在我們可以改變 Board 裡面的 `handleClick` function。如果勝負已經揭曉，或者某個 Square 已經被填滿了，這個 function 可以透過忽略點擊的方式來早點回傳。

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

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

恭喜！你現在有一個可行的圈圈叉叉小遊戲了。你也學到了 React 的基礎。所以，也許*你*才是真正的贏家喔。

## 加上時間旅行 {#adding-time-travel}

作為最後的練習，讓我們試著在這個遊戲中把「回到過去的動作」變成可能。

### 儲存歷史動作 {#storing-a-history-of-moves}

如果我們修改 `squares` array 的話，時間旅行將會變得非常難以實現。

然而，在每一個動作之後，我們使用了 `slice()` 來創造一個 `squares` array 的新的 copy，並[把它視為是不可變的](#why-immutability-is-important)。這讓我們能夠儲存每一個 `squares` array 過去的版本，並悠遊於這些已經發生的動作之中。

接下來，我們將把過去的 `squares` array 們儲存在另一個叫做 `history` 的 array 中。這個 `history` array 代表棋盤從第一個動作到最後一個動作所有的 state。它看起來會是這個樣子：

```javascript
history = [
  // 第一個動作前
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // 第一個動作後
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // 第二個動作後
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

現在我們需要決定哪一個 component 應該擁有 `history` 的 state。

### 再一次把 State 往上傳 {#lifting-state-up-again}

我們會希望最頂層的 Game component 能展示過去一系列的動作。它需要能讀取 `history` 才能做到如此，所以我們會把 `history` state 放在最上層的 Game component 裡面。

把 `history` state 放在 Game component 裡面也讓我們能夠把 `squares` 的 state 從它的 child Board component 中移除。如同我們把 state 從 Square component [「往上傳」](#lifting-state-up) 給 Board component ㄧ樣，我們現在也要把 state 從 Board 再度往上傳到最頂層的 Game component 中。這讓 Game component 能完全掌握 Board 的數據，並讓它能告訴 Board 何時該從 `history` 中 render 之前的動作。

首先，我們會先在 Game component 的 constructor 中設定最初的 state：

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

下一步，我們會讓 Board component 從 Game component 中接收 `squares` 和 `onClick` 這兩個 prop。因為我們現在在 Board 中有提供一個 click handler 給數個 Square 使用，我們需要把每一個 Square 的位置傳給 `onClick` handler 去告知它哪一個 Square 已經被點擊過了。下面是改變 Board component 的幾個步驟：

* 在 Board 中刪除 `constructor`。
* 在 Board 的 `renderSquare` 裡把 `this.state.squares[i]` 換成 `this.props.squares[i]`。
* 在 Board 的 `renderSquare` 裡把 `this.handleClick(i)` 換成 `this.props.onClick(i)`。

現在，Board component 看起來是這樣：

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

我們將會更新 Game component 的 `render` function 以使用歷史上最新的紀錄並顯示遊戲的狀態：

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

既然 Game component 現在能 render 遊戲的狀態，我們可以把 Board 的 `render` 中相對應的程式碼移除。在修改之後，Board 的 `render` function 看起來是這樣子：

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

最後，我們需要把 `handleClick` 方法從 Board component 移到 Game component。由於 Game component 的 state 的結構不同，我們也需要修改 `handleClick`。在 Game 的 `handleClick` 方法中，我們將會把新的歷史紀錄與 `history` 串連起來。

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

>注意
>
>`concat()`方法與你可能所熟悉的 array `push()` 方法不同，它並不會改變原本的 array，所以我們偏好這個方法。

現在，Board component 只需要 `renderSquare` 和 `render` 兩種方法。這個遊戲的 state 和 `handleClick` 方法應該要在 Game component 裡面。

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### 展示過去的動作 {#showing-the-past-moves}

既然我們記錄了圈圈叉叉小遊戲的歷史，我們現在可以向玩家展示過去一系列的動作。

之前，我們學到 React 是 first-class JavaScript object。我們可以將這些 object 在我們的應用程式中傳遞。若是要在 React 中 render 數個項目，我們可以使用一個 array 的 React element。

在 JavaScript 中，array 有一個 [`map()` 方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)常被用來對比並轉變數據，例如：

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

我們可以使用 `map` 方法將我們的歷史動作對比螢幕上代表按鈕的 React element，並展示一系列的按鈕以「跳回」過去的動作。

讓我們在 Game 的 `render` 方法中使用 `map` 在 `history` 上：

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

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

在圈圈叉叉小遊戲歷史中的每個動作，我們都會創造一個列表元素 `<li>`，並在裡面加入 `<button>`。這個按鈕有ㄧ個會呼叫 `this.jumpTo()` 方法的 `onClick` handler。我們還沒實現 `jumpTo()` 方法。現在，我們應該能在開發者工具的 console 中看到一系列在遊戲中曾經發生過的動作以及一個警告：

>  警告：
>  每一個 array 或 iterator 中的 child 必須要有一個獨特的「key」屬性。請參考 Game 的 render 方法。

我們來討論上述這個警告的意義為何。

### 選擇 key {#picking-a-key}

當我們 render 一個列表時，React 會儲存每一個被 render 的項目的資訊。當我們更新列表時，React 需要決定什麼被改變了。我們可以增加、移除、重新排序或更新列表中的項目。

想像一下從這個

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

變成這個

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

除了數量的更新之外，如果讓一個人類來閱讀這個列表的話，他可你會說我們把 Alexa 和 Ben 的順序調換了，並把 Claudia 插入 Alexa 和 Ben 之中。然而，React 是一個電腦程式，它並不知道我們的意圖。正因為 React 並不知道我們的意圖，我們需要明確的為每一個列表中的東西加入一個 *key* 的屬性以確保 React 能清楚分辨每一個項目。一個可行的做法是使用 `alexa`、`ben`、`claudia` 等 string。如果我們是從數據庫來展示數據的話，Alexa、Ben 和 Claudia 的數據庫 ID 可以被用來當作 key。

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

當一個列表被重新 render 的時候，React 會依據每一個列表項目的 key 搜尋上一個列表內的所有項目，並尋找相對應的 key。如果目前的列表有一個之前不存在的 key，那麼 React 就會創造一個 component。如果目前的列表缺少一個之前的列表中有的 key，React 便會將上一個 component 摧毀。如果兩個 key 符合，那麼相對應的 component 就會被移動。Key 告訴 React 每個 component 的身份，這讓 React 能夠在每次重新 render 之間維持 state。如果一個 component 的 key 改變了，那麼這個 component 就會被摧毀，然後在被加上新的 state 後重新被創造。

`Key` 是在 React 中一個特別的且被保留為關鍵字的屬性（跟 `ref` 這個較為進階的功能ㄧ樣）。當ㄧ個元素被創造時，React 會取出 `key` 屬性，並直接將這個 key 儲存在回傳的 element 內。雖然 `key` 可能看起來跟 `props` 像是同一類的關鍵字，但我們沒辦法用 `this.props.key` 來指涉 `key`。React 會自動使用 `key` 來決定哪一個 component 需要被更新。一個 component 無法得知自身的 `key` 是什麼。

**我們極力推薦你在建立動態列表時一律指定適當的 key。** 如果你沒有好好指定 key 的話，你可能要考慮重塑你的數據結構，讓你能夠使用 key。

如果 key 沒有被指定的話，React 會提出警告並使用 array 的索引作為 key 的預設值。但是使用 array 的索引作為 key 在重新排序一個列表中的項目或插入/移除項目時會有問題。明確的指定 `key={i}` 雖然能避開警告，卻還是會跟使用 array 的索引一樣產生同樣的問題。在大多數的情況下，我們不建議你這麼做。

Key 不需要是全域內獨特的值。它們只需要是在 component 和它們的 sibling 間是獨特的即可。


### 實現時間旅行 {#implementing-time-travel}

在圈圈叉叉小遊戲的歷史中，每個過去的動作都有一個獨特的 ID。這些是動作的序號。這些動作永遠不會被重新排序、刪除、或插入，所以我們可以放心使用每個動作的索引作為 key。

在 Game component 的 `render` 方法中，我們可以加入 `<li key={move}>` 作為我們的 key。如此一來 React 的警告應該就會消失了：

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

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

現在，當我們按列表中任何一個項目時，都會收到錯誤訊息，因為 `jumpTo` 方法還沒有被定義。在我們實現 `jumpTo` 之前，我們要先在 Game component 的 state 內加入 `stepNumber` 以指出我們現在正在看的是哪一步。

首先，在 Game 的 `constructor` 裡面的初始 state 加入 `stepNumber: 0`：

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

接著，我們會定義 Game 中 `jumpTo` 這個方法以更新 `stepNumber`。如果 `stepNumber` 被改變後的值不是偶數的話，我們也會把 `xIsNext` 設定為 true：

```javascript{5-10}
  handleClick(i) {
    // 這個方法不需改變
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // 這個方法不需改變
  }
```

現在，我們會在 Game 中每當一個方格被點擊就被觸發的 `handleClick` 中做一些修改。

我們剛加入的 `stepNumber` 的 state 反映了我們將會展示給玩家的動作。在我們做了一個新的動作後，我們需要將 `stepNumber: history.length` 加到 `this.setState` 的 argument 中，以更新 `stepNumber`。這確保了在新動作產生後，我們不會卡在展示一樣的動作。

我們也會將 `this.state.history` 換成 `this.state.history.slice(0, this.state.stepNumber + 1)`。假使我們「回到過去」的某個時刻，並做了一個跟過去不一樣的新動作，這將會確保我們會刪除從那一刻起所有屬於「未來」、但現在已不再正確的的歷史。

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

最後，我們會修改 Game component 中的 `render` 方法，從總是 render 最後一個動作，改為根據 `stepNumber` 來 render 目前正在被選取的動作：

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // 以下不需要改變
```

現在，當我們點擊遊戲歷史中的任何一步，我們應該能夠立刻看到圈圈叉叉遊戲棋盤被更新，並顯示棋盤在那一步發生後的模樣。

**[按這裡看目前的程式碼](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### 總結 {#wrapping-up}

恭喜！你現在已經創造了一個圈圈叉叉遊戲，它可以：

* 讓你玩圈圈叉叉
* 顯示哪一個玩家取得勝利
* 在遊戲進行的同時儲存遊戲歷史
* 讓玩家回顧遊戲的歷史，並回到棋盤之前的版本

做得好！希望現在你覺得你對 React 的運作有相當程度的理解。

按這裡看看最終的結果：**[完成結果](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**。

如果你有額外的時間或想練習你的 React 新技巧，下面是一些你可以改進圈圈叉叉小遊戲的想法，依照程度逐漸增加困難度：

1. 在歷史動作列表中，用（欄，列）的格式來顯示每個動作的位置。
2. 在動作列表中，將目前被選取的項目加粗。
3. 改寫 Board，用兩個 loop 創造方格，而非使用 hardcode。
4. 加上一個切換按鈕讓你可以根據每個動作由小到大、由大到小來排序。
5. 當勝負揭曉時，把連成一條線的那三個方格凸顯出來。
6. 當沒有勝負時，顯示遊戲結果為平手。

在這份教學指南中，我們討論了許多 React 的概念，如 element、component、prop 和 state。如果你想更深入了解這些概念的話，請參考[接下來的官方手冊](/docs/hello-world.html)。若想深入了解如何定義 component，請看[`React.Component` API 參考指南](/docs/react-component.html)。
