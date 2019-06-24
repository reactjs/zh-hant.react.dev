---
id: handling-events
title: 事件處理
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

使用 React element 做事件處理跟使用 DOM element 做事件處理是十分相似的。不過，兩者還是有語法上的差異：

* React 事件是用 camelCase 命名的，而非 lowercase。
* Function 在 JSX 中是被當作 event handler 被傳遞，而不是 string。

例如，, HTML 的語法：

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

和 React 有些微的不同：

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

另一個差異是你不能夠在 React 中返回 `false` 以避免 default behavior。你必須明確地呼叫 `preventDefault`。例如，在 plain HTML 中，若要避免自動開啟新頁的功能，你可以寫： to prevent the default link behavior of opening a new page, you can write:

```html
<a href="#" onclick="console.log('The link was clicked.'); return false">
  Click me
</a>
```

在 React 中，這可以寫成：

```js{2-5,8}
function ActionLink() {
  function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <a href="#" onClick={handleClick}>
      Click me
    </a>
  );
}
```

在這裡，`e` 是一個綜合事件（synthetic event）。React 根據 [W3C 規範](https://www.w3.org/TR/DOM-Level-3-Events/)來定義這些綜合事件，所以你不需要煩惱cross-browser compatibility。若想了解更多這方面的資訊，請參考[`SyntheticEvent`](/docs/events.html)。

當使用 React 時，你應該不需要在一個 DOM element 被創造後用 `addEventListener` 來加上 listeners。你只需要在這個 element 剛開始被 render 時就提供一個 listener。

當你使用 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 來定義 Component 時，常見的慣例是把 event handler 當成那個 class 的 method。, a common pattern is for an event handler to be a method on the class. 例如，這個 `Toggle` Component 會 renders 一個按鈕，讓使用者可以轉換 state 中的「開」與「關」：

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 為了讓 `this` 能在 callback 中被使用，這裡的 binding 是必要的：
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}

ReactDOM.render(
  <Toggle />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

你必須要注意 `this` 在 JSX callback 中的意義。在 JavaScript 中，class methods are not [bound](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) by default. 如果你忘了綁定（bind） `this.handleClick` 並把它傳遞給 `onClick` 的話，`this` 的值將會在該 function 被呼叫時變成 `undefined`。

這並非是 React 才有的行為，而是 [function 在 JavaScript 中的運作模式](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)。總之，當你使用一個方法，卻沒有在後面加上 `()` 之時（例如當你使用 `onClick={this.handleClick}` 時），你應該要 bind 這個方法。

如果呼叫 `bind` 對你來說很煩的話，你可以用別的方式。如果你在使用實驗性的 the experimental [public class fields syntax](https://babeljs.io/docs/plugins/transform-class-properties/)，你可以用 class field 正確的 bind callback：

```js{2-6}
class LoggingButton extends React.Component {
  // 這個語法確保 `this` 是在 handleClick 中 bound：
  // 警告：這是一個還在 *測試中* 的語法：
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

這個語法在 [Create React App](https://github.com/facebookincubator/create-react-app) 中是可行的 by default。

如果你並沒有使用 class field 的語法的話，你則是可以在 callback 中使用 [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)：

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 這個語法確保 `this` 是在 handleClick 中 bound：
    return (
      <button onClick={(e) => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
```

這個語法的問題是每一次 `LoggingButton` render 的時候，就會一個不同的 callback 被創造出來。大多時候，這是無所謂的。然而，如果這個 callback 被當作一個 prop 傳給下層的 component 的話，其他的 component 也許會做些多餘的 re-render。原則上來說，我們建議 binding in the constructor 或使用 class field 語法，以避免這類的性能問題。

## 將 Argument 傳給 Event Handler {#passing-arguments-to-event-handlers}

Inside a loop it is common to want to pass an extra parameter to an event handler. 例如，如果 `id` 是每一行的 ID 的話，下面兩種語法都沒問題：

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

以上這兩行程式是相同的。一個使用 [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，另一個則使用了[`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind)。

以這兩個例子來說，`e` 這個 argument 所代表的 React 事件將會被當作 ID 之後的第二個 argument 被傳遞下去。在使用 arrow function 時，我們必須明確地將它 pass 下去，但若使用 `bind` 的語法，未來任何的 argument 都將會自動被傳遞下去。 any further arguments are automatically forwarded.
