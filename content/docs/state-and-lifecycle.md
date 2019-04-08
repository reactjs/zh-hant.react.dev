---
id: state-and-lifecycle
title: State 和生命週期
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

這個章節會介紹在 React component 中 state 以及生命週期的概念。你可以在[這裡找到 component API 詳細的參考](/docs/react-component.html)。

思考[前一章節](/docs/rendering-elements.html#updating-the-rendered-element)的 ticking clock 的範例。在 [Render Element](/docs/rendering-elements.html#rendering-an-element-into-the-dom) 中，我們只學習到一種方式來更新 UI。 我們呼叫 `ReactDOM.render() 來改變 render 的輸出：

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**在 CodePen 上試試看吧！**](http://codepen.io/gaearon/pen/gwoJZk?editors=0010)

在這個章節中，我們將會學習如何封裝 `Clock` component 讓它可以真正的被重複使用。它將會設定本身的 timer 並且每秒更新一次。

我們可以像這樣封裝 clock 做為開始：

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

然而，它缺少了一個重要的需求：`Clock` 設定 timer 並在每秒更新 UI 應該是 `Clock` 實作的細節的事實。

理想情況下，我們想要撰寫一次 `Clock` 並且它會自己更新：

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

如果要實現這個理想情況，我們需要加入「state」到 `Clock` component。

State 類似於 prop，但它是私有且由 component 完全控制的。

我們[在先前提到過](/docs/components-and-props.html#functional-and-class-components)，component 被定義為 class 有一些額外的特性。Local state 就是 class 其中的一個特性。

## 轉換 Function 成 Class {#converting-a-function-to-a-class}

你可以透過以下 5 個步驟轉換一個 function component 像是 `Clock` 成為 class：

1. 建立一個相同名稱並且繼承 `React.Component` 的 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes)。

2. 加入一個 `render()` 的空方法。

3. 將 function 的內容搬到 `render()` 方法。

4. 將 `render()` 內的 `props` 替換成 `this.props`。

5. 刪除剩下空的 function 宣告。

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` 現在被定義成 class 而不是 function。

在每次發生更新時，`render` 方法都會被呼叫，但我們只要 render `<Clock />` 到相同的 DOM node 中，只有 `Clock` class 這個實例會被用到。這讓我們可以使用像是 local state 和生命週期方法這些額外的特性。

## 加入 Local State 到 Class {#adding-local-state-to-a-class}

我們會透過以下 3 個步驟將 `date` 從搬移到 `state`：

1) 將 `render()` 方法內的 `this.props.date` 替換成 `this.state.date`：

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

2) 加入一個 [class constructor](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes#Constructor) 並分配初始的 `this.state`：

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

注意，我們將傳送 `props` 到基礎 constructor：

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Class component 應該總是要呼叫基礎 constructor 和 `props`。

3) 從 `<Clock />` element 中移除 `date` prop：

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

之後我們將會把 timer 的程式碼加入到 component 本身。

結果看起來會像是：

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

接下來，我們會讓 `Clock` 設定它本身的 timer 並且每秒更新一次。

## 加入生命週期方法到 Class {#adding-lifecycle-methods-to-a-class}

在具有許多 component 的應用程式中，當 component 被 destroy 時，釋放所佔用的資源是非常重要的。

每當 `Clock` render 到 DOM 的時候，我們想要[設定一個 timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval)。在 React 中稱為「mount」。

每當產生的 `Clock` DOM 被移除時，我們想要[清除 timer](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval)。在 React 中稱為「unmount」。

每當 component 在 mount 或是 unmount 的時候，我們可以在 component class 上宣告一些特別的方法來執行一些程式碼：

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

這些方法被稱為「生命週期方法」。

`componentDidMount()` 方法會在 component 被 render 到 DOM 之後才會執行。這是設定 timer 的好地方：

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

注意我們是如何正確的在 `this` 保存 timer ID。

雖然 `this.props` 是由 React 本身設定的，而且 `this.state` 具有特殊的意義，如果你需要儲存一些不相關於資料流的內容（像是 timer ID），你可以自由的手動加入。

我們將會在 `componentWillUnmount()` 生命週期方法內移除 timer：

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

最後，我們將會實作一個 `tick()` 的方法，`Clock` component 將會在每秒執行它。

它將會使用 `this.setState()` 來安排 component local state 的更新：

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

現在我們的 clock 每秒鐘都會滴答作響。

讓我們快速的回顧一下發生了哪些事情，以及呼叫這些方法的順序：

1) 當 `<Clock />` 被傳入到 `ReactDOM.render()` 時，React 會呼叫 `Clock` component 的constructor。由於 `Clock` 需要顯示目前的時間，它使用包含目前時間的 object 初始化 `this.state`。我們會在之後更新這個 state。

2) React 接著呼叫 `Clock` component 的 `render()` 方法。這就是 React 如何了解應該要在螢幕上顯示什麼內容。React 接著更新 DOM 來符合 `Clock` 的 render 輸出。

3) 每當 `Clock` 輸出被插入到 DOM 時，React 會呼叫 `componentDidMount()` 生命週期方法。在 `Clock` component 生命週期方法內，會要求瀏覽器設定 timer 每秒去呼叫 component 的 `tick()` 方法。

4) 瀏覽器每秒呼叫 `tick()` 方法。其中，`Clock` component 透過包含目前時間的 object 呼叫 `setState()` 來調度 UI 更新。感謝 `setState()`，React 現在知道 state 有所改變，並且再一次呼叫 `render()` 方法來了解哪些內容該呈現在螢幕上。這時候，在 `render()` 方法內的 `this.state.date` 將會有所不同，因此 render 輸出將會是更新的時間。React 相應地更新 DOM。

5) 如果 `Clock` component 從 DOM 被移除了，React 會呼叫 `componentWillUnmount()` 生命週期方法，所以 timer 會被停止。

## 正確的使用 State {#using-state-correctly}

有三件關於 `setState()` 的事情你應該要知道。

### 請不要直接修改 State {#do-not-modify-state-directly}

例如，這將不會重新 render component：

```js
// 錯誤
this.state.comment = 'Hello';
```

相反的，使用 `setState()`：

```js
// 正確
this.setState({comment: 'Hello'});
```

你唯一可以指定 `this.state` 值的地方是在 constructor。

### State 的更新可能是非同步的 {#state-updates-may-be-asynchronous}

React 可以將多個 `setState()` 呼叫批次處理為單一的更新，以提高效能。

因為 `this.props` 和 `this.state` 可能是非同步的被更新，你不應該依賴它們的值來計算新的 state。

例如，這個程式碼可能無法更新 counter：

```js
// 錯誤
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

要修正這個問題，使用第二種形式的 `setState()`，它接受一個 function 而不是一個 object。Function 將接收先前的 state 作為第一個參數，並且將更新的 props 作為第二個參數：

```js
// 正確
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

在上面我們使用 [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，但它也可以適用於正常的 function：

```js
// 正確
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### State 的更新將會被 Merge {#state-updates-are-merged}

當你呼叫 `setState()` 時，React 會 merge 你提供的 object 到目前的 state。

例如，你的 state 可能包含幾個單獨的變數：

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

然後你可以單獨的呼叫 `setState()` 更新它們：

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

這個 merge 是 shallow 的，所以 `this.setState({comments})` 保持 `this.state.posts` 的完整，但它完全取代了 `this.state.comments`。

## 向下資料流 {#the-data-flows-down}

Parent 和 child component 不會知道某個 component 是 stateful 或 stateless 的 component，而且它們不在意它是透過 function 或是 class 被定義的。

這就是 state 通常被稱為 local state 或被封裝的原因。除了擁有和可以設定它之外的任何 component 都不能訪問它。

Component 可以選擇將它的 state 做為 props 往下傳遞到它的 child component：

```js
<h2>It is {this.state.date.toLocaleTimeString()}.</h2>
```

這也適用在使用者所定義的 component：

```js
<FormattedDate date={this.state.date} />
```

`FormattedDate` component 會在它的 props 接收到 `date`，但他不知道它是從 `Clock` 的 state 傳遞過來的，從 `Clock` 的 props 或者是透過手動輸入：

```js
function FormattedDate(props) {
  return <h2>It is {props.date.toLocaleTimeString()}.</h2>;
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

這通常被稱作為「上至下」或「單向」的資料流。任何 state 總是由某個特地的 component 所擁有，任何從 state 得到的資料或 UI，state 只能影響在 tree「以下」的 component。

如果你想像一個 component tree 是一個 props 的瀑布，每個 component 的 state 像是一個額外的水流源頭，它在任意的某個地方而且往下流。

為了表示所有 component 真的都是被獨立的，我們可以建立一個 `App` component 來 render 三個 `<Clock>`：

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

每個 `Clock` 設定它本身的 timer 並獨立的更新。

在 React 應用程式中，不論 component 是 stateful 或 stateless 都被視為是實作 component 的細節，它可能隨著時間而改變。你可以在 stateful component 內使用 stateless component，反之亦然。
