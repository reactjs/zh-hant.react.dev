---
id: hooks-state
title: 使用 State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

[介紹 Hook](/docs/hooks-intro.html)使用過這個範例讓我們熟悉 Hook：

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們稱作為「count」。
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

我們會藉由在同樣的範例中使用 class 時有什麼差別來學習 Hook。

## 相等的 Class 範例 {#equivalent-class-example}

如果你以前在 React 中使用過 class，這段程式應該對你不陌生：

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

State 從 `{ count: 0 }` 開始，當使用者點擊按鈕時，我們藉由呼叫 `this.setState()` 增加 `state.count`。在這ㄧ整頁，我們會使用這個 class 中的片段來說明。

>注意
>
>你也許會好奇我們為什麼要用一個計數器，而不是一個更實際的例子。其實當我們還在學習怎麼使用 Hook 的時候，這有助於我們專注在 API 上面。

## Hook 和 Function Component {#hooks-and-function-components}

提醒一下，在 React 中 function component 看起來像這樣：

```js
const Example = (props) => {
  // 你可以在這裡使用 Hook！
  return <div />;
}
```

或是：

```js
function Example(props) {
  // 你可以在這裡使用 Hook！
  return <div />;
}
```

也許你知道它曾被稱作「stateless component」。但因為現在這些 component 也可以使用 React state 了，我們會比較喜歡「function component」這個稱呼。

Hook **不會**在 class 裡運作。但你可以使用它來取代 class。

## 什麼是 Hook？ {#whats-a-hook}

就從 React 引入 `useState` 來開始新的範例吧： 

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**什麼是 Hook？**Hook 是一個讓你可以使用 React 各項功能的特殊 function。舉例來說，`useState` 是一個讓你增加 React state 到 function component 的 Hook。在後面的章節我們會學習其他 Hook。 

**什麼時候該使用 Hook？**以前當你寫一個 function component 需要增加一些 state 時，你必須轉換成 class。現在你可以直接在 function component 中使用 Hook。我們現在就來試試看吧！

>注意
>
>關於在 component 中哪裡可以使用 Hook，有一些特別的規則。我們會在 [Hook 的規則](/docs/hooks-rules.html) 中學習。

## 宣告一個 State 變數 {#declaring-a-state-variable}

在 class 中，藉由在 constructor 設定 `this.state` 成 `{ count: 0 }` 把 `count` 這個 state 起始值設為 `0`。

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

在 function component 中，我們沒有 `this`，所以我們沒辦法指定或讀取 `this.state`。相反地，我們可以直接在 component 中呼叫 `useState` Hook。

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們稱作為「count」。
  const [count, setCount] = useState(0);
```

**呼叫 `useState` 做了什麼？**它宣告了一個「state 變數」。我們的變數叫做 `count`，也可以有其他稱呼，像是 `banana`。這是一個在 function 呼叫中「保留」變數的方法－`useState` 就像是 class 中 `this.state` 的功能一樣。一般情況下，變數會在 function 結束時「消失」，但 state 變數會被 React 保留起來。

**我們傳入什麼參數給 `useState`？**唯一需要傳入 `useState()` Hook 的參數就是 state 起始值。不像 class state 不需要是一個 object。我們可以使用我們所需的 number 或是 string。在範例中，我們只需要一個 number 記錄使用者點擊了多少次，所以我們傳入 `0` 來當作起始值。（如果要在 state 儲存兩個不同的值，可以呼叫 `useState()` 兩次。）

**`useState` 回傳了什麼？**它回傳了一對值：目前的 state 跟一個可以更新 state 的 function。這就是為什麼我們寫 `const [count, setCount] = useState()` 的原因。除了你是直接拿到一對，這跟 class 中的 `this.state.count` 和 `this.setState` 很類似。如果你對我們用的語法不熟悉，我們稍後會在[本頁的底部](/docs/hooks-state.html#tip-what-do-square-brackets-mean)討論它。

現在我們知道 `useState` Hook 做了什麼，我們的範例會看起來更有感覺：

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們稱作為「count」。
  const [count, setCount] = useState(0);
```

我們宣告了一個叫做 `count` 的 state 變數，並將起始值設成了 `0`。React 在 re-render 間會記住目前的值，並將它提供給我們的 function。如果我們需要更新目前的 `count`，我們可以呼叫 `setCount`。

>注意
>
>你也許會好奇：為什麼 `useState` 不叫做 `createState`？
>
>state 只會在第一次 render 時被建立，所以「Create」並不會比較精準。而在其後的 render，`useState` 只會給我們目前的 state。不然這就不叫做 state 啦！另外還有一個理由，為什麼 Hook *總是*以 `use` 起頭。我們稍後會在 [Hook 規則](/docs/hooks-rules.html)中了解。

## 讀取 State {#reading-state}

在 class 中我們要顯示目前的計數，我們使用 `this.state.count`：

```js
  <p>You clicked {this.state.count} times</p>
```

在 function 中，我們可以直接使用 `count`：


```js
  <p>You clicked {count} times</p>
```

## 更新 State {#updating-state}

在 class 中，我們需要呼叫 `this.setState()` 來更新 `count` state：

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

在 function 中，我們已經有 `setCount` 和 `count` 變數，所以我們不需要 `this`：

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## 總結 {#recap}

我們來**一行一行總結一下我們學了什麼**，並確認我們都懂了。

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **第一行：**我們從 React 引入 `useState` Hook。它讓我們可以在 function component 保留 local state。
* **第四行：**在 `Example` component 裡，我們呼叫 `useState` Hook 宣告了一個新的 state 變數。並回傳了一對由我們命名的值。我們將代表點擊數的變數命名為 `count`。我們將起始值設為 `0` 並傳入 `useState` 當作唯一參數。第二個回傳的值是個可以更新 `count` 的 function，所以我們命名為 `setCount`。
* **第九行：**當使用者點擊，我們就呼叫 `setCount` 並傳入新的值。然後 React 就會 re-render `Example` component，並傳入新的 `count` 值。

別急！也許你需要好好消化一番。如果還是有些不懂，你可以試著再將上面那段程式從頭到尾看一下。我們保證一旦你試著把 class 的 state 運作方式「遺忘」，這一切會合理起來。

### 提示：方括號代表什麼? {#tip-what-do-square-brackets-mean}

你也許注意到了，當我們宣告 state 變數時使用了方括號：

```js
  const [count, setCount] = useState(0);
```

等號左邊的並不是 React 的 API。你可以命名你自己的 state 變數：

```js
  const [fruit, setFruit] = useState('banana');
```

這個 JavaScript 語法叫做 [array destructuring](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#陣列解構)。這代表我們宣告了兩個新的變數 `fruit` 和 `setFruit`，`fruit` 被設為 `useState` 回傳的第一個值，`setFruit` 則是第二個。跟下面這段程式相同：

```js
  var fruitStateVariable = useState('banana'); // 回傳一對值
  var fruit = fruitStateVariable[0]; // 第一個值
  var setFruit = fruitStateVariable[1]; // 第二個值
```

當我們使用 `useState` 宣告 state 變數，他會回傳一對在 array 裡的值。第一個值是目前 state 的值，第二個是一個可以更新 state 的 function。因為它們有特殊的意義，只用 `[0]` 和 `[1]` 來存取它們的話會令人困惑。所以我們使用 array destructuring 來命名它們。

>注意
>
>你也許會好奇既然我們沒有傳入任何東西像是 `this`，React 要怎麼知道哪個 component 對應到哪個 `useState`。我們會在 FAQ 章節解答[這個問題](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)和其他問題。

### 提示: 使用多個 State 變數 {#tip-using-multiple-state-variables}

把 state 變數宣告成一對 `[something, setSomething]` 同時也很便利，因為如果想要使用超過一個 state 變數，這能讓我們對不同的 state 變數有*不同*的命名

```js
function ExampleWithManyStates() {
  // 宣告多個 state 變數！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

在上面的 component 中，我們的 local 變數有 `age`、`fruit` 和 `todos`，而且我們可以單獨更新它們。

```js
  function handleOrangeClick() {
    // 類似於 this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

你**不需要**使用很多 state 變數。state 變數可以是 object 或是 array，所以你可以把相關的資料放在一起。然而，不像 class 裡的 `this.setState` 會合併原本的 state，這裡更新 state 變數會直接*取代*。

我們在 [FAQ 章節](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) 提供更多拆分獨立的 state 變數的建議。

## 下一步 {#next-steps}

在這一頁，我們學習了其中一個 React 提供的 Hook－`useState`。我們有時也稱它做「State Hook」。前所未有地，它讓我們能夠增加 local state 到 React function component！

我們同時也瞭解了更多什麼是 Hook。Hook 是可以讓你在 function component 使用 React 各項功能的 function。還有更多 Hook 我們還沒認識，而 Hook 的名字都會以 `use` 起頭。

**現在我們繼續[學習下個 Hook：`useEffect`](/docs/hooks-effect.html)。** 就像 class 的生命週期方法，它讓你能夠在 component 使用 side effect。
