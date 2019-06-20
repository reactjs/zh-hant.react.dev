---
id: hooks-state
title: 使用 State Hook
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

The [introduction page](/docs/hooks-intro.html) used this example to get familiar with Hooks:
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

We'll start learning about Hooks by comparing this code to an equivalent class example.
我們會藉由在同樣的範例中使用 class 時有什麼差別來學習 Hook。

## Equivalent Class Example {#equivalent-class-example}
## 相等的 Class 範例 {#equivalent-class-example}

If you used classes in React before, this code should look familiar:
如果以前你使用過 class 在 React 中，這段程式應該對你不陌生：

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

The state starts as `{ count: 0 }`, and we increment `state.count` when the user clicks a button by calling `this.setState()`. We'll use snippets from this class throughout the page.
State 從 `{ count: 0 }` 開始，當使用者點擊按鈕時，我們藉由呼叫 `this.setState()` 增加 `state.count`。在這ㄧ整頁，我們會使用這個 class 中的片段來說明。

>Note
>
>You might be wondering why we're using a counter here instead of a more realistic example. This is to help us focus on the API while we're still making our first steps with Hooks.
>注意
>
>你也許會好奇我們為什麼要用一個計數器，而不是一個更實際的例子。其實當我們還在學習怎麼使用 Hook 的時候，這有幫助於我們專注在 API 上面。

## Hooks and Function Components {#hooks-and-function-components}
## Hook 和 Function Component {#hooks-and-function-components}

As a reminder, function components in React look like this:
提醒一下，在 React 中 function component 看起來像這樣：

```js
const Example = (props) => {
  // 你可以在這裡使用 Hook！
  return <div />;
}
```

or this:
或是：

```js
function Example(props) {
  // 你可以在這裡使用 Hook！
  return <div />;
}
```

You might have previously known these as "stateless components". We're now introducing the ability to use React state from these, so we prefer the name "function components".
也許你知道這些曾被稱作「stateless component」。但因為現在這些 component 也可以使用 React state 了，我們會
比較喜歡「function component」這個稱呼。

Hooks **don't** work inside classes. But you can use them instead of writing classes.
Hook **不會** 在 class 裡運作。但你可以使用它來取代 class。

## What's a Hook? {#whats-a-hook}
## 什麼是 Hook？ {#whats-a-hook}

Our new example starts by importing the `useState` Hook from React:
就從 React 引入 `useState` 來開始新的範例吧： 

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**What is a Hook?** A Hook is a special function that lets you "hook into" React features. For example, `useState` is a Hook that lets you add React state to function components. We'll learn other Hooks later.
**什麼是 Hook？** Hook 是一個讓你可以使用 React 各項功能的特殊 function。舉例來說，`useState` 是一個讓你添加 React state 到 function component 的 Hook。我們會學習其他 Hook 在後面的章節。 

**When would I use a Hook?** If you write a function component and realize you need to add some state to it, previously you had to convert it to a class. Now you can use a Hook inside the existing function component. We're going to do that right now!
**什麼時候該使用 Hook？** 以前當你寫一個 function component 但你需要增加一些 state，你必須要轉換成 class。現在你可以直接在 function component 中使用 Hook。我們現在就來試試看吧！

>Note:
>
>There are some special rules about where you can and can't use Hooks within a component. We'll learn them in [Rules of Hooks](/docs/hooks-rules.html).
>注意
>
>關於在 component 中哪裡可以使用 Hook，有一些特別的規則。我們會在 [Hook 的規則](/docs/hooks-rules.html) 中學習。

## Declaring a State Variable {#declaring-a-state-variable}
## 宣告一個 State 變數 {#declaring-a-state-variable}

In a class, we initialize the `count` state to `0` by setting `this.state` to `{ count: 0 }` in the constructor:
在 class 中，藉由在 constructor 設置 `this.state` 成 `{ count: 0 }` 把 `count` 這個 state 起始值設為 `0`。

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

In a function component, we have no `this`, so we can't assign or read `this.state`. Instead, we call the `useState` Hook directly inside our component:
在 function component 中，我們沒有 `this`，所以我們沒辦法指定或讀取 `this.state`。相反地，我們可以直接在 component 中呼叫 `useState` Hook。

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們稱作為「count」。
  const [count, setCount] = useState(0);
```

**What does calling `useState` do?** It declares a "state variable". Our variable is called `count` but we could call it anything else, like `banana`. This is a way to "preserve" some values between the function calls — `useState` is a new way to use the exact same capabilities that `this.state` provides in a class. Normally, variables "disappear" when the function exits but state variables are preserved by React.
**呼叫 `useState` 做了什麼？** 它宣告了一個「state 變數」。我的變數叫做 `count`，也可以有其他稱呼，像是 `banana`。這是一個在 function 呼叫中「保留」變數的方法－`useState` 就像是 class 中 `this.state` 的功能一樣。一般情況下，變數會在 function 結束時「消失」，但 state 變數會被 React 保留起來。

**What do we pass to `useState` as an argument?** The only argument to the `useState()` Hook is the initial state. Unlike with classes, the state doesn't have to be an object. We can keep a number or a string if that's all we need. In our example, we just want a number for how many times the user clicked, so pass `0` as initial state for our variable. (If we wanted to store two different values in state, we would call `useState()` twice.)
**我們傳入什麼參數給 `useState`？** 唯一需要傳入 `useState()` Hook 的參數就是 state 起始值。不像 class state 不需要是一個 object。我們可以使用我們所需的 number 或是 string。在範例中，我們只需要一個 number 紀錄使用者點擊了多少次，所以我們傳入 `0` 來當作起始值。（如果要在 state 保存兩個不同的值，可以呼叫 `useState()` 兩次。）

**What does `useState` return?** It returns a pair of values: the current state and a function that updates it. This is why we write `const [count, setCount] = useState()`. This is similar to `this.state.count` and `this.setState` in a class, except you get them in a pair. If you're not familiar with the syntax we used, we'll come back to it [at the bottom of this page](/docs/hooks-state.html#tip-what-do-square-brackets-mean).
**`useState` 回傳了什麼？** 它回傳了一對值：目前的 state 跟一個可以更新 state 的 function。這就是為什麼我們寫 `const [count, setCount] = useState()` 的原因。除了你是直接拿到一對，這跟 class 中的 `this.state.count` 和 `this.setState` 很類似。如果你對我們用的語法不熟悉，我們稍後會在[本頁的底部](/docs/hooks-state.html#tip-what-do-square-brackets-mean)討論它。

Now that we know what the `useState` Hook does, our example should make more sense:
現在我們知道 `useState` Hook 做了什麼，我們的範例會看起來更有感覺：

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // 宣告一個新的 state 變數，我們稱作為「count」。
  const [count, setCount] = useState(0);
```

We declare a state variable called `count`, and set it to `0`. React will remember its current value between re-renders, and provide the most recent one to our function. If we want to update the current `count`, we can call `setCount`.
我們宣告了一個叫做 `count` 的 state 變數，並將起始值設成了 `0`。React 在 re-render 間會記住目前的值，並將它提供給我們的 function。如果我們需要更新目前的 `count`，我們可以呼叫 `setCount`。

>Note
>
>You might be wondering: why is `useState` not named `createState` instead?
>
>"Create" wouldn't be quite accurate because the state is only created the first time our component renders. During the next renders, `useState` gives us the current state. Otherwise it wouldn't be "state" at all! There's also a reason why Hook names *always* start with `use`. We'll learn why later in the [Rules of Hooks](/docs/hooks-rules.html).
>注意
>
>你也許會好奇：為什麼 `useState` 不叫做 `createState`？
>
>state 只會在第一次 render 時被建立，所以「Create」並不會比較精準。而在其後的 render，`useState` 只會給我們目前的 state。不然這就不叫做 state 啦！另外還有一個理由，為什麼 Hook *都是* 以 `use` 起頭。我們稍後會在 [Hook 規則](/docs/hooks-rules.html)中瞭解。

## Reading State {#reading-state}
## 讀取 State {#reading-state}

When we want to display the current count in a class, we read `this.state.count`:
在 class 中我們要秀出目前的計數，我們使用 `this.state.count`：

```js
  <p>You clicked {this.state.count} times</p>
```

In a function, we can use `count` directly:
在 function 中，我們可以直接使用 `count`：


```js
  <p>You clicked {count} times</p>
```

## Updating State {#updating-state}
## 更新 State {#updating-state}

In a class, we need to call `this.setState()` to update the `count` state:
在 class 中，我們需要呼叫 `this.setState()` 來更新 `count` state：

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

In a function, we already have `setCount` and `count` as variables so we don't need `this`:
在 function 中，我們已經有 `setCount` 和 `count` 變數，所以我們不需要 `this`：

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## Recap {#recap}
## 總結 {#recap}

Let's now **recap what we learned line by line** and check our understanding.
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

* **Line 1:** We import the `useState` Hook from React. It lets us keep local state in a function component.
* **第一行：**我們從 React 引入 `useState` Hook。它讓我們可以在 function component 保留 local state。
* **Line 4:** Inside the `Example` component, we declare a new state variable by calling the `useState` Hook. It returns a pair of values, to which we give names. We're calling our variable `count` because it holds the number of button clicks. We initialize it to zero by passing `0` as the only `useState` argument. The second returned item is itself a function. It lets us update the `count` so we'll name it `setCount`.
* **第四行：**在 `Example` component 裡，我們呼叫 `useState` Hook 宣告了一個新的 state 變數。並回傳了一對由我們命名的值。我們將代表點擊數的變數命名為 `count`。我們將起始值設為 `0` 並傳入 `useState` 當作唯一參數。第二個回傳的值是個可以更新 `count` 的 function，所以我們命名為 `setCount`。
* **Line 9:** When the user clicks, we call `setCount` with a new value. React will then re-render the `Example` component, passing the new `count` value to it.
* **第九行：**當使用者點擊，我們就呼叫 `setCount` 並傳入新的值。然後 React 就會 re-render `Example` component，並傳入新的 `count` 值。

This might seem like a lot to take in at first. Don't rush it! If you're lost in the explanation, look at the code above again and try to read it from top to bottom. We promise that once you try to "forget" how state works in classes, and look at this code with fresh eyes, it will make sense.
別急！也許你需要好好消化一番。如果還是有些不懂，你可以試著再將上面那段程式從頭到尾看一下。我們保證一旦你試著把 class 的 state 運作方式「遺忘」，這一切會合理起來。

### Tip: What Do Square Brackets Mean? {#tip-what-do-square-brackets-mean}
### 提示：方括號代表什麼? {#tip-what-do-square-brackets-mean}

You might have noticed the square brackets when we declare a state variable:
你也許注意到了，當我們宣告 state 變數時使用了方括號：

```js
  const [count, setCount] = useState(0);
```

The names on the left aren't a part of the React API. You can name your own state variables:
等號左邊的並不是 React 的 API。你可以命名你自己的 state 變數：

```js
  const [fruit, setFruit] = useState('banana');
```

This JavaScript syntax is called ["array destructuring"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring). It means that we're making two new variables `fruit` and `setFruit`, where `fruit` is set to the first value returned by `useState`, and `setFruit` is the second. It is equivalent to this code:
這個 JavaScript 語法叫做 [array destructuring](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#陣列解構)。這代表我們宣告了兩個新的變數 `fruit` 和 `setFruit`，`fruit` 被設為 `useState` 回傳的第一個值，`setFruit` 則是第二個。跟下面這段程式相同：

```js
  var fruitStateVariable = useState('banana'); // Returns a pair
  var fruit = fruitStateVariable[0]; // First item in a pair
  var setFruit = fruitStateVariable[1]; // Second item in a pair
```

When we declare a state variable with `useState`, it returns a pair — an array with two items. The first item is the current value, and the second is a function that lets us update it. Using `[0]` and `[1]` to access them is a bit confusing because they have a specific meaning. This is why we use array destructuring instead.
當我們使用 `useState` 宣告 state 變數，他會回傳一對在 array 裡的值。第一個值是目前 state 的值，第二個是一個可以更新 state 的 function。因為它們有特殊的意義，只用 `[0]` 和 `[1]` 來存取它們的話會令人困惑。所以我們使用 array destructuring 來命名它們。

>Note
>
>You might be curious how React knows which component `useState` corresponds to since we're not passing anything like `this` back to React. We'll answer [this question](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) and many others in the FAQ section.
>注意
>
>你也許會好奇既然我們沒有傳入任何東西像是 `this`，React 要怎麼知道哪個 component 對應到哪個 `useState`。我們會在 FAQ 章節解答[這個問題](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components)和其他問題。

### Tip: Using Multiple State Variables {#tip-using-multiple-state-variables}
### 提示: 使用多個 State 變數 {#tip-using-multiple-state-variables}

Declaring state variables as a pair of `[something, setSomething]` is also handy because it lets us give *different* names to different state variables if we want to use more than one:
把 state 變數宣告成一對 `[something, setSomething]` 同時也很便利，因為如果想要使用超過一個 state 變數，這能讓我們對不同的 state 變數有*不同*的命名

```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  // 宣告多個 state 變數！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

In the above component, we have `age`, `fruit`, and `todos` as local variables, and we can update them individually:
在上面的 component 中，我們的 local variable 有 `age`、`fruit` 和 `todos`，而且我們可以單獨更新它們。

```js
  function handleOrangeClick() {
    // Similar to this.setState({ fruit: 'orange' })
    // 類似於 this.setState({ fruit: 'orange' })
    setFruit('orange');
  }
```

You **don't have to** use many state variables. State variables can hold objects and arrays just fine, so you can still group related data together. However, unlike `this.setState` in a class, updating a state variable always *replaces* it instead of merging it.
你**不需要**使用很多 state 變數。state 變數可以是 object 或是 array，所以你可以把相關的資料放在一起。然而，不像 class 裡的 `this.setState` 會合併原本的 state，這裡更新 state 變數會直接*取代*。

We provide more recommendations on splitting independent state variables [in the FAQ](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables).
我們在 [FAQ 章節](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) 提供更多拆分獨立的 state 變數的建議。

## Next Steps {#next-steps}
## 下一步 {#next-steps}

On this page we've learned about one of the Hooks provided by React, called `useState`. We're also sometimes going to refer to it as the "State Hook". It lets us add local state to React function components -- which we did for the first time ever!
在這一頁，我們學習了其中一個 React 提供的 Hook－`useState`。我們有時也稱它做「State Hook」。前所未有地，它讓我們能夠增加 local state 到 React function component！

We also learned a little bit more about what Hooks are. Hooks are functions that let you "hook into" React features from function components. Their names always start with `use`, and there are more Hooks we haven't seen yet.
我們同時也瞭解了更多什麼是 Hook。Hook 是可以讓你在 function component 使用 React feature 的 function。還有更多 Hook 我們還沒認識，而 Hook 的名字都會以 `use` 起頭。

**Now let's continue by [learning the next Hook: `useEffect`.](/docs/hooks-effect.html)** It lets you perform side effects in components, and is similar to lifecycle methods in classes.
**現在我們繼續[學習下個 Hook：`useEffect`](/docs/hooks-effect.html)。** 就像 class 的 lifecycle method，它讓你能夠在 component 使用 side effect。
