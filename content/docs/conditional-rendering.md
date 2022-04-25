---
id: conditional-rendering
title: 條件 Render
permalink: docs/conditional-rendering.html
prev: handling-events.html
next: lists-and-keys.html
redirect_from:
  - "tips/false-in-jsx.html"
---

在 React 中，你可以建立不同的 component 來封裝你需要的行為。接著，你可以根據你的應用程式的 state，來 render 其中的一部份。

React 中的條件 rendering 跟 JavaScript 一致。使用 JavaScript 中的運算子如 [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) 或者 [三元運算子](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 來建立表示目前 state 的 element，然後讓 React 根據它們來更新 UI。

先看以下兩個 component：

```js
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

我們將會建立一個 `Greeting` component，它會根據使用者是否已登入來顯示其中之一：

```javascript{3-7,11,12}
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  // 試改為 isLoggedIn={true}:
  <Greeting isLoggedIn={false} />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/ZpVxNq?editors=0011)

這範例根據 `isLoggedIn` prop 的值來 render 不同的問候語。

### Element 變數 {#element-variables}

你可以用變數來儲存 element。它可以幫助你有條件地 render 一部份的 component，而保持其他輸出不變。

思考這兩個新的登入和登出按鈕 component：

```js
function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}
```

在下列範例，我們將建立一個名為 `LoginControl` 的 [stateful component](/docs/state-and-lifecycle.html#adding-local-state-to-a-class)。

它將根據目前的 state 來 render `<LoginButton />` 或 `< LogoutButton />`。而且也會 render 前面範例的 `<Greeting />`。

```javascript{20-25,29,30}
class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {isLoggedIn: false};
  }

  handleLoginClick() {
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick() {
    this.setState({isLoggedIn: false});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} />
        {button}
      </div>
    );
  }
}

ReactDOM.render(
  <LoginControl />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/QKzAgB?editors=0010)

雖然宣告變數並使用 `if` 語句來有條件 render component 是一個不錯的方式，但有時你也想使用更簡潔的語法。在 JSX 中有以下幾種方法：

### Inline If 與 && 邏輯運算子 {#inline-if-with-logical--operator}

你可以透過大括號[在 JSX 中嵌入表達式](/docs/introducing-jsx.html#embedding-expressions-in-jsx)，包括 JavaScript 的 `&&` 邏輯運算子，可以方便 render 有條件的 element：

```js{6-10}
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/ozJddz?editors=0010)

能夠這樣做是因為在 JavaScript 中，`true && expression` 總是回傳 `expression` ，而 `false && expression` 總是回傳 `false`。

所以，當條件為 `true` 時，`&&` 右側的 element 會出現在輸出中，如果是 `false`，React 會忽略並跳過它。

請注意，回傳 falsy expression 仍會導致 `&&` 之後的 element 被忽略，但依舊回傳 falsy expression，在下面的範例中，render 將會回傳 `<div>0</div>`。

```javascript{2,5}
render() {
  const count = 0;
  return (
    <div>
      {count && <h1>Messages: {count}</h1>}
    </div>
  );
}
```

### Inline If-Else 與三元運算子 {#inline-if-else-with-conditional-operator}

另一個有條件 render element 的方式是透過 JavaScript 的三元運算子 [`condition ? true : false`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)。

在下面的範例，我們會用它來有條件地 render 一小段文字。

```javascript{5}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
    </div>
  );
}
```

它也可以被用在較複雜的表達式上，雖然不是太明顯：

```js{5,7,9}
render() {
  const isLoggedIn = this.state.isLoggedIn;
  return (
    <div>
      {isLoggedIn
        ? <LogoutButton onClick={this.handleLogoutClick} />
        : <LoginButton onClick={this.handleLoginClick} />
      }
    </div>
  );
}
```

就跟在 JavaScript 中一樣，你可以根據團隊習慣來選擇更合適的風格。還要記著如果條件變得過於複雜，也許是個好時機來[抽離 component](docs/components-and-props.html#extracting-components) 了。

### 防止 Component Render {#preventing-component-from-rendering}

在少數的情況下，你可能希望 component 隱藏自己本身，即便它是由另一個 component 被 render。可以透過回傳 `null` 而不是它的 render 輸出。

在下面的範例中，`<WarningBanner />` 的 render 取決於 `warn` prop 的值。如果 prop 是 `false`，它就不會 render。

```javascript{2-4,29}
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return (
    <div className="warning">
      Warning!
    </div>
  );
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showWarning: true};
    this.handleToggleClick = this.handleToggleClick.bind(this);
  }

  handleToggleClick() {
    this.setState(state => ({
      showWarning: !state.showWarning
    }));
  }

  render() {
    return (
      <div>
        <WarningBanner warn={this.state.showWarning} />
        <button onClick={this.handleToggleClick}>
          {this.state.showWarning ? 'Hide' : 'Show'}
        </button>
      </div>
    );
  }
}

ReactDOM.render(
  <Page />,
  document.getElementById('root')
);
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/Xjoqwm?editors=0010)

在 component 中回傳 `null` 並不會影響 component 的生命週期方法。例如 `componentDidUpdate` 依然可以被呼叫。
