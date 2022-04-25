---
id: hooks-reference
title: Hooks API 參考
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

本頁面描述 React 中內建 Hook 的 API。

如果你剛開始接觸 Hook，你可能會想先查閱 [Hook 概論](/docs/hooks-overview.html)。你也可以在 [Hook 常見問題](/docs/hooks-faq.html)中找到有用的資訊。

- [基礎的 Hook](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [額外的 Hook](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [Library Hooks](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## 基礎的 Hook {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

回傳一個 state 的值，以及更新 state 的 function。

在首次 render 時，回傳的 `state` 的值會跟第一個參數（`initialState`）一樣。

`setState` function 是用來更新 state。它接收一個新的 state 並將 component 的重新 render 排進隊列。

```js
setState(newState);
```

在後續的重新 render，`useState` 回傳的第一個值必定會是最後更新的 state。

>注意
>
>React 確保 `setState` function 本身是穩定的，而且不會在重新 render 時改變。這就是為什麼可以安全地從 `useEffect` 或 `useCallback` 的依賴列表省略它。

#### 函數式更新 {#functional-updates}

如果新的 state 是用先前的 state 計算出，你可以傳遞一個 function 到 `setState`。該 function 將接收先前的 state，並回傳一個已更新的值。下列的計算器 component 範例示範了 `setState` 的兩種用法。

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

「+」和「-」按鈕使用了函數式形式，因為被更新的值是基於先前的值。但是「Reset」按鈕則使用普通形式，因為它總是把 count 設定回初始值。

如果你的 update 函式回傳與目前的 state 相同的值，後續的 render 將會被完整跳過。

> 注意
>
> 與 class component 的 `setState` 方法不同，`useState` 不會自動合併更新 object。你可以用函數式更新的形式結合 object spread 語法來達到相同效果：
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // 也可以使用 Object.assign
>   return {...prevState, ...updatedValues};
> });
> ```
>
> 另一個選擇是 `useReducer`，它更適合用於管理有多個子數值的 state object。

#### 惰性初始 state {#lazy-initial-state}

`initialState` 參數只會在初始 render 時使用，在後續 render 時會被忽略。如果初始 state 需要通過複雜的計算來獲得，你可以傳入一個 function，該 function 只會在初始 render 時被調用：

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### 跳過 state 更新 {#bailing-out-of-a-state-update}

如果你使用與目前 state 相同值來更新 State Hook，React 將會跳過子 component 的 render 及 effect 的執行。（React 使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)來比較。）

請注意 React 可能仍需要在跳過 render 之前 render 該 component。這不應該是個問題，因為 React 不會不必要地「深入」到 component tree 中。如果你在 render 當中執行了昂貴的計算，你可以使用 `useMemo` 來最佳化。

#### Batching of state updates {#batching-of-state-updates}

React may group several state updates into a single re-render to improve performance. Normally, this improves performance and shouldn't affect your application's behavior.

Before React 18, only updates inside React event handlers were batched. Starting with React 18, [batching is enabled for all updates by default](/blog/2022/03/08/react-18-upgrade-guide.html#automatic-batching). Note that React makes sure that updates from several *different* user-initiated events -- for example, clicking a button twice -- are always processed separately and do not get batched. This prevents logical mistakes.

In the rare case that you need to force the DOM update to be applied synchronously, you may wrap it in [`flushSync`](/docs/react-dom.html#flushsync). However, this can hurt performance so do this only where needed.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

接受一個包含指令式，且可能有副作用程式碼的 function。

在 function component（指的是 React 的 render 階段）的 function 內，mutation、subscription、timer、日誌記錄、以及其他 side effect 是不被允許的。因為這可能會導致容易混淆的 bug 和不一致的 UI。

相反的，使用 `useEffect`。傳遞到 `useEffect` 的 function 會在 render 到螢幕之後執行。可以把 effect 看作 React 從純函式世界通往指令式世界的跳脫方式。

在預設情況下，effect 會在每一個完整 render 後執行，但你也可以選擇它們在[某些值改變的時候](#conditionally-firing-an-effect)才執行。

#### 清除一個 effect {#cleaning-up-an-effect}

通常來說，在 component 離開螢幕之前需要清除 effect 所建立的資源，例如像是 subscription 或計時器的 ID。要做到這一點，傳遞到 `useEffect` 的 function 可以回傳一個清除的 function。例如，要建立一個 subscription：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

清除 function 會在 component 從 UI 被移除前執行，來防止 memory leak。此外，如果 component render 了數次（它們通常會這樣），在**執行下一個 effect 前，上一個 effect 就已被清除**。在上述的例子中，意味著每一次更新都會建立一個新 subscription。要避免每次更新都觸發 effect 的執行，請參閱下一個章節。

#### Effect 的時機 {#timing-of-effects}

與 `componentDidMount` 和 `componentDidUpdate` 不同，在延遲事件期間，傳遞給 `useEffect` 的 function 會在 layout 和 render **之後**觸發。這使它適用於很多常見的 side effect，例如設定 subscription 和 event handler，因為絕大部份的工作都不應該阻礙瀏覽器更新晝面。

然而，不是所有的 effect 都可以被延後。例如，使用者可見的 DOM 改變必須在下一次繪製之前同步觸發，這樣使用者才不會感覺到視覺不一致。（概念上類似被動和主動 event listener 的區別。）為這類型的 effect，React 提供了一個額外的 [`useLayoutEffect`](#uselayouteffect) Hook。它和 `useEffect` 的結構相同，只是執行的時機不同而已。

<<<<<<< HEAD
雖然 `useEffect` 會被延遲直到瀏覽器繪制完成，但會保證在任何新 render 前執行。React 會在開始新一個更新前刷新上一輪 render 的 effect。
=======
Additionally, starting in React 18, the function passed to `useEffect` will fire synchronously **before** layout and paint when it's the result of a discrete user input such as a click, or when it's the result of an update wrapped in [`flushSync`](/docs/react-dom.html#flushsync). This behavior allows the result of the effect to be observed by the event system, or by the caller of [`flushSync`](/docs/react-dom.html#flushsync).

> Note
> 
> This only affects the timing of when the function passed to `useEffect` is called - updates scheduled inside these effects are still deferred. This is different than [`useLayoutEffect`](#uselayouteffect), which fires the function and processes the updates inside of it immediately.

Even in cases where `useEffect` is deferred until after the browser has painted, it's guaranteed to fire before any new renders. React will always flush a previous render's effects before starting a new update.
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892

#### 有條件的觸發 effect {#conditionally-firing-an-effect}

effect 的預設行為是在每次完成 render 後觸發 effect。這樣的話，如果其中一個依賴有改變，則會重新建立一個 effect。

然而，在某些情況下這可能矯枉過正，例如在上一章節的 subscription 範例。我們只需要在 `source` prop 改變後才重新建立 subscription，而不需要在每次更新後。

要實現這一點，可以向 `useEffect` 傳遞第二個參數，它是該 effect 所依賴的值 array。我們更新後的範例如下：

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

現在只有當 `props.source` 改變時才會重新建立 subscription。

>注意
>
>若你使用這個最佳化的方式，請確保該 array 包含了**所有在該 component 中會隨時間而變的值（例如 props 和 state）以及在該 effect 所使用到的值。**否則，你的程式碼會引用先前 render 的舊變數。了解更多[如何處理 function](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 和當 [array 的值頻繁變化時](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)的處理。
>
>如果你想 effect 只執行和清除一次（在 mount 和 unmount），你可以傳遞一個空的 array （`[]`）作為第二個參數。這告訢 React 你的 effect 沒有依賴*任何*在 props 或 state 的值，所以它永遠不需被再次執行。這並不是一個特殊處理 -- 它依然遵循依賴 array 的運作方式。
>
>如果你傳入了一個空的 array（`[]`），effect 內部的 props 和 state 就一直擁有其初始值。儘管傳入 `[]` 作為第二個參數有點類似 `componentDidMount` 和 `componentWillUnmount` 的思維模式，但其實有[更好的](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)[方法](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)來避免過於頻繁地重複執行 effect。而且，不要忘記 React 會延後執行 `useEffect` 直至瀏覽器完成繪制，所以額外的工作也不會是太大問題。
>
>
>我們建議使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則。它會在依賴錯誤時發出警告並提出修正建議。

依賴 array 並不作為傳到 effect function 的參數。但從概念上來説，這是它所代表的：所有在 effect function 中引用的值都應該出現在依賴 array 中。在未來，一個足夠先進的編譯器可以自動建立這個 array。

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

接收一個 context object（`React.createContext` 的回傳值）並回傳該 context 目前的值。Context 目前的值是取決於由上層 component 距離最近的 `<MyContext.Provider>` 的 `value` prop。

當 component 上層最近的 `<MyContext.Provider>` 更新時，該 hook 會觸發重新 render，並使用最新傳遞到 `MyContext` 的 context `value` 傳送到 `MyContext` provider。即便 ancestor 使用 [`React.memo`](/docs/react-api.html#reactmemo) 或 [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate)，重新 render 仍然從使用 `useContext` 的 component 本身開始。

不要忘記 `useContext` 的參數必需為 *context object 自己*：

 * **正確:** `useContext(MyContext)`
 * **錯誤:** `useContext(MyContext.Consumer)`
 * **錯誤:** `useContext(MyContext.Provider)`

呼叫 `useContext` 的 component 總是會在 context 值更新時重新 render。如果重新 render component 的操作很昂貴，你可以[透過 memoization 來最佳化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

>注意
>
>假若你在接觸 hook 前已熟悉 context API，`useContext(MyContext)` 就相等於 class 中的 `static contextType = MyContext` 或 `<MyContext.Consumer>`。
>
>`useContext(MyContext)` 只能讓你*讀取* context 及訂閱其變更。你仍然需要在 tree 的上層使用`<MyContext.Provider>` 來提供 context 的值。

**與 Context.Provider 放在一起**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
此為使用 Hook 修改之前 [Context Advanced Guide](/docs/context.html) 中的範例，你可以在那裡了解更多 Context 的資訊，像是何時以及如何使用 Context。


## 額外的 Hooks {#additional-hooks}

以下的 Hook，有些是上一節中基礎的 Hook 的變異，有些則是在特殊情況下使用。不用特地預先學習它們。

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

[`useState`](#usestate) 的替代方案。接受一個 `(state, action) => newState` 的 reducer，然後回傳現在的 state 以及其配套的 `dispatch` 方法。（如果你熟悉 Redux，你已經知道這如何運作。）

當你需要複雜的 state 邏輯而且包括多個子數值或下一個 state 依賴之前的 state，`useReducer` 會比 `useState` 更適用。而且 `useReducer` 可以讓你觸發深層更新的 component 作效能的最佳化，因為[你可以傳遞 dispatch 而不是 callback](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)。

以下是用 reducer 重寫 [`useState`](#usestate) 一節的範例：

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>注意
>
>React 確保 `dispatch` function 本身是穩定的，而且不會在重新 render 時改變。這就為什麼可以安全地從 `useEffect` 或 `useCallback` 的依賴列表省略它。

#### 指定初始 state {#specifying-the-initial-state}

有兩種不同初始化 `useReducer` state 的方法。你可以根據使用場景選擇任何一種。最簡單的方法就是把初始 state 作為第二個參數傳入：

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>注意
>
>React 不使用 `state = initialState` 這個由 Redux 推廣開來的參數慣例。初始值有時需要依賴於 prop，因此需要在呼叫 Hook 時指定。如果你較偏愛上述的慣例，你可以呼叫 `useReducer(reducer, undefined, reducer)` 來摸擬 Redux 的行為，但這是不鼓勵的。

#### 惰性初始化 {#lazy-initialization}

你也可以惰性的建立初始 state。你可以傳入 `init` function 作為第三個參數。初始的 state 會被設定為 `init(initialArg)`。

這樣讓你可以將計算初始 state 的邏輯提取到 reducer 外。而且也方便了將來處理重置 state 的 action：

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### 跳過 dispatch {#bailing-out-of-a-dispatch}

如果你在 Reducer Hook 回傳的值與目前的 state 相同，React 將會跳過 child component 的 render 及 effect 的執行。（React 使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)來比較。）

請注意 React 可能仍需要在跳過 render 之前 render 該 component。這不應該是個問題，因為 React 不會不必要地「深入」到 tree 中。如果你在 render 當中執行了昂貴的計算，你可以使用 `useMemo` 來最佳化。

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

回傳一個 [memoized](https://en.wikipedia.org/wiki/Memoization) 的 callback。

傳遞一個 inline callback 及依賴 array。`useCallback` 會回傳該 callback 的 memoized 版本，它僅在依賴改變時才會更新。當傳遞 callback 到已經最佳化的 child component 時非常有用，這些 child component 依賴於引用相等性來防止不必要的 render（例如，`shouldComponentUpdate`）

`useCallback(fn, deps)` 相等於 `useMemo(() => fn, deps)`。

> 注意
>
> 依賴 array 並不作為傳到 callback 的參數。但從概念上來説，這是它所代表的：所有在 callback 中引用的值都應該出現在依賴 array 中。在未來，一個足夠先進的編譯器可以自動建立這個 array。
>
> 我們建議使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則。它會在依賴錯誤時發出警告並提出修正建議。

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

回傳一個 [memoized](https://en.wikipedia.org/wiki/Memoization) 的值。

傳遞一個「建立」function 及依賴 array。`useMemo` 只會在依賴改變時才重新計算 memoized 的值。這個最佳化可以避免在每次 render 都進行昂貴的計算。

要謹記傳到 `useMemo` 的 function 會在 render 期間執行。不要做一些通常不會在 render 期間做的事情。例如，處理 side effect 屬於 `useEffect`，而不是 `useMemo`。

如果沒有提供 array，每次 render 時都會計算新的值。

**你可以把 `useMemo` 作為效能最佳化的手段，但請不要把它當作成語意上的保證。**在將來，React 可能會選擇「忘記」某些之前已 memorize 的值並在下一次 render 時重新計算，例如，為已離開螢幕的 component 釋放記憶體。先撰寫沒有 `useMemo` 也可執行的代碼 — 然後再加入它來做效能最佳化。

> 注意
>
> 依賴 array 並不作為傳到 function 的參數。但從概念上來説，這是它所代表的：所有在 callback 中引用的值都應該出現在依賴 array 中。在未來，一個足夠先進的編譯器可以自動建立這個 array。
>
> 我們建議使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則。它會在依賴錯誤時發出警告並提出修正建議。

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` 回傳一個 mutable 的 ref object，`.current` 屬性被初始為傳入的參數（`initialValue`）。回傳的 object 在 component 的生命週期將保持不變。

一個常見的使用情境就是命令式的訪問 child component：

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

本質上，`useRef` 就像一個可以持有 mutable 的值在 `.current` 屬性的「盒子」。

你應該熟悉 ref，它一種主要是用來[訪問 DOM](/docs/refs-and-the-dom.html) 的方式。如果你在 React 中以 `<div ref={myRef} />` 傳入 ref object，無論節點如何改變，React 都會將其 `.current` 屬性設為相應的 DOM 節點。

然而，`useRef()` 比 `ref` 屬性更有用。它可以[很方便地持有任何 mutable 的值](/docs/hooks-faq.html#is-there-something-like-instance-variables)，跟 class 中的 instance field 類似。

這是因為 `useRef()` 會建立一個普通的 JavaScript object。`useRef()` 和自建一個 `{current: ...}` object 的唯一不同是，`useRef` 在每次 render 時都會給你同一個的 ref object。

請記住 `useRef` 在其內容有變化時並*不會*通知你。變更 `.current` 屬性不會觸發重新 render。如果你想要在 React 綁定或解綁 DOM 節點的 ref 時執行程式碼，你可能需要使用 [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 來實現。


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 可以讓使用 `ref` 時能向父 component 暴露自定義的 instance 值。一如既往，在大多數的情況下應避免使用 ref 的命令式代碼。`useImperativeHandle` 應與 [`forwardRef`](/docs/react-api.html#reactforwardref) 一同使用：

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

在這個範例中，render `<FancyInput ref={inputRef} />` 的父 component 能呼叫 `inputRef.current.focus()`。

### `useLayoutEffect` {#uselayouteffect}

與宣告 `useEffect` 本身相同，但它會在所有 DOM 改變後，同步調用。使用它來讀取 DOM layout 並同步重新 render。在瀏覽器執行繪製之前，`useLayoutEffect` 內部的更新將被同步刷新。

盡可能使用標準的 `useEffect` 來避免阻礙視覺上的更新。

> 注意
>
> 如果你是從 class component migrate 程式碼，請注意 `useLayoutEffect` 與 `componentDidMount` 和 `componentDidUpdate` 的呼叫時機是一樣。不過，**我們建議先使用 `useEffect`**，只當它有問題時才嘗試使用 `useLayoutEffect`。
>
> 如果你使用伺服器 render，請記住 `useLayoutEffect` 或 `useEffect` *均不會*執行，直到 JavaScript 完成載入。這是為什麼在伺服器 render 的 component 包含 `useLayoutEffect` 時 React 會發出警告。要解決這問題，把該邏輯搬到 `useEffect` 裡（如果首次 render 不需要該邏輯），或把 component 延遲到客戶端完成 render 後才出現（如果直到 `useLayoutEffect` 執行前 HTML 都會錯亂的情況下）。
>
> 要在伺服器 render 的 HTML 排除需要 layout effect 的 component，可以利用 `showChild && <Child />` 進行條件 render，並使用 `useEffect(() => { setShowChild(true); }, [])` 來延遲顯示。這樣，UI 就不會在完成 render 之前顯示錯亂了。

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` 可以用來在 React DevTools 中顯示自訂義 hook 的標籤。

例如，在[「打造你的 Hook」](/docs/hooks-custom.html)中提及的 `useFriendStatus` 自定義 Hook：

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // Show a label in DevTools next to this Hook
  // e.g. "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

> 注意
>
> 我們不建議在每個自定義 Hook 都加上 debug 值。它在自定義 Hook 的共享函式庫中才是最有價值的。

#### 延遲格式化 Debug Value {#defer-formatting-debug-values}

在某些情況下，格式化一個顯示值可能會是昂貴的操作。除非實際檢查 Hook，否則沒有必要。

因此，`useDebugValue` 接受一個格式化 function 作為可選的第二個參數。該 function 只有在 Hook 被檢查時才會被呼叫。它接受 debug 值作為參數，然後回傳一個被格式化的顯示值。

例如，一個回傳 `Date` 值的自定義 Hook 可以通過以下的格式化 function 來避免不必要地呼叫 `toDateString` function：

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

This hook is similar to user-space hooks which use debouncing or throttling to defer updates. The benefits to using `useDeferredValue` is that React will work on the update as soon as other work finishes (instead of waiting for an arbitrary amount of time), and like [`startTransition`](/docs/react-api.html#starttransition), deferred values can suspend without triggering an unexpected fallback for existing content.

#### Memoizing deferred children {#memoizing-deferred-children}
`useDeferredValue` only defers the value that you pass to it. If you want to prevent a child component from re-rendering during an urgent update, you must also memoize that component with [`React.memo`](/docs/react-api.html#reactmemo) or [`React.useMemo`](/docs/hooks-reference.html#usememo):

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

Memoizing the children tells React that it only needs to re-render them when `deferredQuery` changes and not when `query` changes. This caveat is not unique to `useDeferredValue`, and it's the same pattern you would use with similar hooks that use debouncing or throttling.

### `useTransition` {#usetransition}

```js
const [isPending, startTransition] = useTransition();
```

Returns a stateful value for the pending state of the transition, and a function to start it.

`startTransition` lets you mark updates in the provided callback as transitions:

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` indicates when a transition is active to show a pending state:

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transitions will not show a fallback for re-suspended content. This allows the user to continue interacting with the current content while rendering the update.

### `useId` {#useid}

```js
const id = useId();
```

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

> Note
>
> `useId` is **not** for generating [keys in a list](/docs/lists-and-keys.html#keys). Keys should be generated from your data.

For a basic example, pass the `id` directly to the elements that need it:

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

For multiple IDs in the same component, append a suffix using the same `id`:

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> Note:
> 
> `useId` generates a string that includes the `:` token. This helps ensure that the token is unique, but is not supported in CSS selectors or APIs like `querySelectorAll`.
> 
> `useId` supports an `identifierPrefix` to prevent collisions in multi-root apps. To configure, see the options for [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) and [`ReactDOMServer`](/docs/react-dom-server.html).

## Library Hooks {#library-hooks}

The following Hooks are provided for library authors to integrate libraries deeply into the React model, and are not typically used in application code.

### `useSyncExternalStore` {#usesyncexternalstore}

```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` is a hook recommended for reading and subscribing from external data sources in a way that's compatible with concurrent rendering features like selective hydration and time slicing.

This method returns the value of the store and accepts three arguments:
- `subscribe`: function to register a callback that is called whenever the store changes.
- `getSnapshot`: function that returns the current value of the store.
- `getServerSnapshot`: function that returns the snapshot used during server rendering.

The most basic example simply subscribes to the entire store:

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

However, you can also subscribe to a specific field:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

When server rendering, you must serialize the store value used on the server, and provide it to `useSyncExternalStore`. React will use this snapshot during hydration to prevent server mismatches:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> Note:
>
> `getSnapshot` must return a cached value. If getSnapshot is called multiple times in a row, it must return the same exact value unless there was a store update in between.
> 
> A shim is provided for supporting multiple React versions published as `use-sync-external-store/shim`. This shim will prefer `useSyncExternalStore` when available, and fallback to a user-space implementation when it's not.
> 
> As a convenience, we also provide a version of the API with automatic support for memoizing the result of getSnapshot published as `use-sync-external-store/with-selector`.

### `useInsertionEffect` {#useinsertioneffect}

```js
useInsertionEffect(didUpdate);
```

The signature is identical to `useEffect`, but it fires synchronously _before_ all DOM mutations. Use this to inject styles into the DOM before reading layout in [`useLayoutEffect`](#uselayouteffect). Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

> Note:
>
> `useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](#useeffect) or [`useLayoutEffect`](#uselayouteffect) instead.
