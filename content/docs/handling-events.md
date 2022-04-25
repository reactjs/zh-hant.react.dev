---
id: handling-events
title: 事件處理
permalink: docs/handling-events.html
prev: state-and-lifecycle.html
next: conditional-rendering.html
redirect_from:
  - "docs/events-ko-KR.html"
---

使用 React element 處理事件跟使用 DOM element 處理事件是十分相似的。它們有一些語法上的差異：

* 事件的名稱在 React 中都是 camelCase，而在 HTML DOM 中則是小寫。
* 事件的值在 JSX 中是一個 function，而在 HTML DOM 中則是一個 string。

例如，在 HTML 中的語法：

```html
<button onclick="activateLasers()">
  Activate Lasers
</button>
```

和在 React 中的語法有些微的不同：

```js{1}
<button onClick={activateLasers}>
  Activate Lasers
</button>
```

另外一個差異是，在 React 中，你不能夠使用 `return false` 來避免瀏覽器預設行為。你必須明確地呼叫 `preventDefault`。例如，在純 HTML 中，若要避免連結開啟新頁的預設功能，你可以這樣寫：

```html
<form onsubmit="console.log('You clicked submit.'); return false">
  <button type="submit">Submit</button>
</form>
```

在 React 中，你則可以這樣寫：

```js{3}
function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}
```

在這裡，`e` 是一個 synthetic 事件（synthetic event）。React 根據 [W3C 規範](https://www.w3.org/TR/DOM-Level-3-Events/)來定義這些 synthetic 事件，React event 與 native event 工作的方式不盡然相同。若想了解更多這方面的資訊，請參考 [`SyntheticEvent`](/docs/events.html)。

當使用 React 時，你不需要在建立一個 DOM element 後再使用 `addEventListener` 來加上 listener。你只需要在這個 element 剛開始被 render 時就提供一個 listener。

當你使用 [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) 來定義 Component 時，常見的慣例是把 event handler 當成那個 class 的方法。例如，這個 `Toggle` Component 會 render 一個按鈕，讓使用者可以轉換 state 中的「開」與「關」：

```js{6,7,10-14,18}
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 為了讓 `this` 能在 callback 中被使用，這裡的綁定是必要的：
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
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
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/xEmzGg?editors=0010)

請特別注意 `this` 在 JSX callback 中的意義。在 JavaScript 中，class 的方法在預設上是沒有被綁定（[bound](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_objects/Function/bind)）的。如果你忘了綁定 `this.handleClick` 並把它傳遞給 `onClick` 的話，`this` 的值將會在該 function 被呼叫時變成 `undefined`。

這並非是 React 才有的行為，而是 [function 在 JavaScript 中的運作模式](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/)。總之，當你使用一個方法，卻沒有在後面加上 `()` 之時（例如當你使用 `onClick={this.handleClick}` 時），你應該要綁定這個方法。

如果呼叫 `bind` 對你來說很麻煩的話，你可以用別的方式。如果你使用了還在測試中的 [class fields 語法](https://babeljs.io/docs/plugins/transform-class-properties/)的話，你可以用 class field 正確的綁定 callback：

```js{2-6}
class LoggingButton extends React.Component {
  // 這個語法確保 `this` 是在 handleClick 中被綁定：
  // 警告：這是一個還在*測試中*的語法：
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

這個語法在 [Create React App](https://github.com/facebookincubator/create-react-app) 中是預設成可行的。

如果你並沒有使用 class field 的語法的話，你則可以在 callback 中使用 [arrow function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Functions/Arrow_functions)：

```js{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 這個語法確保 `this` 是在 handleClick 中被綁定：
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```

這個語法的問題是每一次 `LoggingButton` render 的時候，就會建立一個不同的 callback。大多時候，這是無所謂的。然而，如果這個 callback 被當作一個 prop 傳給下層的 component 的話，其他的 component 也許會做些多餘的 re-render。原則上來說，我們建議在 constructor 內綁定，或使用 class field 語法，以避免這類的性能問題。

## 將參數傳給 Event Handler {#passing-arguments-to-event-handlers}

在一個迴圈中，我們常常會需要傳遞一個額外的參數給 event handler。例如，如果 `id` 是每一行的 ID 的話，下面兩種語法都可行：

```js
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

以上這兩行程式是相同的。一個使用 [arrow functions](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，另一個則使用了[`Function.prototype.bind`](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_objects/Function/bind)。

以這兩個例子來說，`e` 這個參數所代表的 React 事件將會被當作 ID 之後的第二個參數被傳遞下去。在使用 arrow function 時，我們必須明確地將它傳遞下去，但若使用 `bind` 語法，未來任何的參數都將會自動被傳遞下去。
