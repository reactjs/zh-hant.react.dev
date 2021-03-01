---
id: react-without-es6
title: 不使用 ES6 開發 React
permalink: docs/react-without-es6.html
---

通常你會把 React component 定義成一個 JavaScript class：

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

如果你還沒開始使用 ES6 的話，則可以考慮用 `create-react-class` 來代替：


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```

ES6 class 與 `createReactClass()` 的 API 十分相似，只有以下幾個不同處。

## 宣告預設 Props {#declaring-default-props}

使用 function 與 ES6 class 語法時，`defaultProps` 會被定義為 component 上的一個屬性：

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

而使用 `createReactClass()` 語法時，你則需要在傳遞的物件上定義 `getDefaultProps()` 方法：

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```

## 設定初始 State {#setting-the-initial-state}

在 ES6 class 語法中，你可以藉由在 constructor 中設定 `this.state` 來定義初始 state：

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

而使用 `createReactClass()` 語法時，你則需要另外提供一個會回傳初始 state 的 `getInitialState` 方法：

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## 自動綁定 {#autobinding}

在使用 ES6 class 宣告 React component 時，其方法的語義與一般的 ES6 class 相同。也就是說，這些方法不會自動綁定 `this` 到 instance 上。你會需要明確地在 constructor 中使用 `.bind(this)` 來綁定 `this`：

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // 這行很重要！
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // 因為 `this.handleClick` 已經被綁定了，所以我們才可以把它當作 event handler 使用。
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

而使用 `createReactClass()` 時就不需要這麼做，因為它會自動綁定所有方法：

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

這代表使用 ES6 class 時會需要為 event handler 多寫一些 boilerplate 程式碼，但這種寫法的好處是在大型的應用程式中會有稍微好一點的效能。

如果寫 boilerplate 程式碼對你來說實在是很沒有吸引力的話，你可以啟用 Babel 的**實驗性**語法提案 [Class Properties](https://babeljs.io/docs/plugins/transform-class-properties/)：


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // 警告：這個語法還在實驗階段！
  // 在這裡使用 arrow function 可以綁定此方法：
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

請注意，上述的語法還在實驗階段，也就是語法可能會改變，提案也有機會不被加入語言標準中。

如果你想要保險一點，你有以下幾個選擇：

* 在 constructor 中綁定方法。
* 使用 arrow function，例如 `onClick={(e) => this.handleClick(e)}`。
* 繼續使用 `createReactClass`。

## Mixin {#mixins}

> **注意：**
>
> ES6 並沒有支援任何 mixin 語法。因此當你在 React 中使用 ES6 class 時也不支援使用 mixin。
>
> **我們也發現在程式中使用 mixin 會造成很多問題，[因此不建議在新的程式碼中使用 mixin](/blog/2016/07/13/mixins-considered-harmful.html)。**
>
>此段落內容僅供參考。

有時候完全不同的 component 間可能會共有相同的功能。這種狀況有時候被稱為[橫切關注點](https://en.wikipedia.org/wiki/Cross-cutting_concern) 問題。`createReactClass` 可以讓你使用舊有的 `mixins` 機制來解決此問題。

一個常見的使用情境是，一個 component 想要每隔一段時間就更新自己一次。使用 `setInterval()` 就可以很容易的實現這個功能，但重要的是要在不需要 `setInterval()` 之後把它取消掉以保留記憶體空間。React 提供 [生命週期方法](/docs/react-component.html#the-component-lifecycle)讓你知道一個 component 什麼時候會被建立或銷毀。讓我們用這些方法建立一個簡易 mixin，以提供簡單的 `setInterval()` 功能，並讓這個 `setInterval()` 在你的 component 被銷毀時自動清除掉。

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // 使用 mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // 呼叫一個 mixin 中的方法
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

如果一個 component 使用了複數個 mixin，且其中的多個 mixin 同時定義了相同的生命週期方法（例如，多個 mixin 都想要在 component 被銷毀時做一些清除的動作），則所有的生命週期方法都保證會被呼叫到。這些 Mixin 中的方法會依照它們的排列順序依序執行，並會在最後呼叫 component 上的對應方法。
