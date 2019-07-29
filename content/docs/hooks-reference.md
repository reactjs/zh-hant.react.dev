---
id: hooks-reference
title: Hooks API 參考
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hook* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

本頁面描述 React 中內建 Hook 的 API。

如果你剛開始接觸 Hook，你可能會想先查閱 [Hook 概論](/docs/hooks-overview.html)。你也可以在 [Hook 常見問題](/docs/hooks-faq.html) 中獲取有用的資料。

- [基礎的 Hook](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [額外的 Hooks](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)

## 基礎的 Hook {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

返回一個 state，及更新 state 的 function。

在首次 render 時，返回的 `state` 的值會跟第一個參數（`initialState`）一樣。

`setState` function 是用來更新 state。它接收一個新的 state 並將 component 的重新 render 排進隊列。

```js
setState(newState);
```

在後續的重新 render，`useState` 返回的第一個值必定會是最後更新的 state。

>備注
>
>React 確保 `setState` function 的標識是穩定的，而且不會在重新 render 時改變。這就為什麼可以安全地從 `useEffect` 或 `useCallback` 的依賴列表省略它。

#### 函數式更新 {#functional-updates}

如果新的 state 是用先前的 state 計算出，你可以傳遞一個 function 到 `setState`。該 function 將接收先前的 state，並回傳一個已更新的值。下列的計算器 component 示例展示了 `setState` 的兩種用法。

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

「+」和「-」按鈕使用了函數式形式，因為被更新的值是基於先前的值。但是「Reset」按鈕則使用普通形式，因為它總是把 count 設置回初始值。

> 備注
>
> 與 class component 的 `setState` 方法不同，`useState` 不會自動合拼更新 object。你可以用函數式更新的形式結合 object spread 語法來達到相同效果：
>
> ```js
> setState(prevState => {
>   // Object.assign would also work
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

如果你使用與當前 state 同值的值來更新 state hook，React 將會跳過子組件的 render 及 effect 的執行。（React 使用 [`Object.is` 比較算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)。）

請注意 React 可能仍需要在跳過 render 之前 render 該 component。這不應該是個問題，因為 React 不會不必要地「深入」到組件樹中。如果你在 render 當中執行了高昂的計算，你可以使用 `useMemo` 來優化。

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

接收一個包含指令式，且可能有副作用代碼的 function。

在 function component（指的是 React 的 render 階段）的主體內變異、添加訂閱、設置定時器、記錄日誌、以及其他副作用是不被允許的。因為這可能會導致容易混淆的 bug 和不一致的 UI。

反而，應使用 `useEffect`。傳到 `useEffect` 的 function 會在 render 到屏幕之後執行。可以把 effect 看作 React 從純函數世界通往指令式世界的逃生通道。

在默認情況下，effect 會在每一個完整 render 後執行，但你也可以選擇它在[某些值改變的時候](#conditionally-firing-an-effect)才執行。

#### 清除一個 effect {#cleaning-up-an-effect}

通常，在 component 於屏幕卸載前需要清除 effect 創建的資源，例如訂閱或定時器的 ID。要達到這一點，傳遞到 `useEffect` 的 function 可以回傳一個清除 function。例如，在創建訂閱：

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

清除 function 會在 component 從 UI 卸載前執行，來防止內存泄漏。而且，若果 component render 了數次，在**執行下一個 effect 前，上一個 effect 就已被清除**。在上述的例子中，意味著每一次更新都會創造一個新訂閱。要避免每次更新都觸發 effect 的執行，請參閱下一個章節。

#### Effect 的時機 {#timing-of-effects}

與 `componentDidMount` 和 `componentDidUpdate` 不同的時，傳遞到 `useEffect` 的 function 會在布局和繪制**之後**，在延後事件中執行。 這使它適用於很多常見的副作用，例如設置訂閱和 event handler，因為絕大部份的工作都不應阻礙瀏覽器更新晝面。

然而，不是所有的 effect 都可以被延後。例如，在瀏覽器下一次繪制前，用戶可視的 DOM 變更就必需同步執行，用戶才不會感覺到視覺上的不一致。（概念上類似被動和主動 event listener 的區別。）為這類別的 effect，React 提供了一個額外的 [`useLayoutEffect`](#uselayouteffect) hook。它和 `useEffect` 的結構相同，只是執行的時機不同而已。

儘管 `useEffect` 會延後至瀏覽器繪制後，但會保證在任何新 render 前執行。React 會在開始新一個更新前刷新上一輪 render 的 effect。

#### 有條件地執行 effect {#conditionally-firing-an-effect}

在默認情況下，effect 會在每一個完整的 render 後執行。這樣的話一旦 effect 的依賴有變化，它就會被重新創建。

然而，在某些情況下這可能矯枉過正，例如在上一章節的訂閱示例。我們只需要在 `source` prop 改變後才重新創建訂閱，不需要在每次更新後。

要實現這一點，可以向 `useEffect` 傳遞第二個參數，它是該 effect 所依賴的值 array。我們更新後的例子如下：

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

現在只有當 `props.source` 改變時才會重新創建訂閱。

>備注
>
>若你要使用此優化方式，請確保該 array 包含了**所有在該 component 中會隨時間而變的值（例如 prop 和 state）以及在該 effect 使用的值。**否則，你的代碼會引用先前 render 的舊變量。了解更多[如何處理 function](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) 和當[array 的值頻繁變化時](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)的處理。
>
>如果你想 effect 只執行和清除一次（於 mount 和 unmount），你可以傳遞一個空白的 array （`[]`）作為第二個參數。這告訢 React 你的 effect 沒有依賴*任何*在 prop 或 state 的值，所以它永遠不需被再次執行。這並不是一個特殊處理 -- 它依然遵循依賴 array 的運作方式。
>
>如果你傳入了一個空白的 array（`[]`），effect 內部的 prop 和 state 就一直擁有其初始值。儘管傳入 `[]` 作為第二個參數有點類似 `componentDidMount` 和 `componentWillUnmount` 的思維模式，但其實有[更好的](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [方法](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often)來避免過於頻繁地重複執行 effect。而且，不要忘記 React 會延後執行 `useEffect` 直至瀏覽器完成繪制，所以額外的工作也不會是太大問題。
>
>
>我們建議使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則。它會在依賴錯誤時發出警告並提出修正建議。

依賴 array 並不作為傳到 effect function 的參數。但從概念上來説，這是它所代表的：所有在 effect function 中引用的值都應該出現在依賴 array 中。在未來，一個足夠先進的編譯器可以自動創建這 array。

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

接收一個 context object（`React.createContext` 的返回值）並返回該 context 的當前值。Context 的當前值是取決於由上層 component 距離最近的 `<MyContext.Provider>` 的 `value` prop。

當 component 上層最近的 `<MyContext.Provider>` 更新時，該 hook 會觸發重新 render，並使用最新傳遞到 `MyContext` 的 context `value`。

不要忘記 `useContext` 的參數必需為 *context object 自己*：

 * **正確:** `useContext(MyContext)`
 * **錯誤:** `useContext(MyContext.Consumer)`
 * **錯誤:** `useContext(MyContext.Provider)`

調用了 `useContext` 的 component 總會在 context 值更新時重新 render。假若重新 render component 很昂貴，你可以[通過 memoization 來優化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

>提示
>
>假若你在接觸 hook 前已熟悉 context API，`useContext(MyContext)` 就相等於 class 中的 `static contextType = MyContext` 或 `<MyContext.Consumer>`。
>
>`useContext(MyContext)` 只能讓你*讀取* context 及訂閱其變更。你仍然需要在樹的上層使用`<MyContext.Provider>` 來提供 context 的值。

## 額外的 Hooks {#additional-hooks}

以下的 hook，有些是上一節中基礎的 hook 的變異，有些則是在特殊情況下使用。不用特地預先學習它們。

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

[`useState`](#usestate) 的替代方案。接受一個 `(state, action) => newState` 的 reducer，然後返回現在的 state 以及其配套的 `dispatch` 方法。（如果你熟悉 Redux，你已經知道這如何運作。）

當你需要複雜的 state 邏輯而且包括多個子數值或下一個 state 依賴之前的 state，`useReducer` 會比 `useState` 更適用。而且 `useReducer` 可以讓你給會觸發深層更新的 component 作性能優化，因為[你可以傳遞 dispatch 而不是 callback](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down)。

以下是用 reducer 重寫 [`useState`](#usestate) 一節的例子：

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
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

>備注
>
>React 確保 `dispatch` function 的標識是穩定的，而且不會在重新 render 時改變。這就為什麼可以安全地從 `useEffect` 或 `useCallback` 的依賴列表省略它。

#### 指定初始 state {#specifying-the-initial-state}

有兩種不同初始化 `useReducer` state 的方法。你可以跟據使用場景選擇任何一種。最簡單的方法就是把初始 state 作為第二個參數傳入：

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>備注
>
>React不使用 `state = initialState` 這個由 Redux 推廣開來的參數慣例。初始值有時需要依賴於 prop，因此需要在調用 hook 時指定。如果你較偏愛上述的慣例，你可以調用 `useReducer(reducer, undefined, reducer)` 來摸擬 Redux 的行為，但這是不鼓勵的。

#### 惰性初始化 {#lazy-initialization}

你地可以惰性地創建初始 state。為此，你可以傳入 `init` function 作為第三個參數。初始的 state 會被設定為 `init(initialArg)`。

這樣令你可以將計算初始 state 的邏輯提取到 reducer 外。而且也方便了將來處理重置 state 的 action：

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
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

#### 跳過 dispatch {#bailing-out-of-a-dispatch}

如果你在 reducer hook 返回的值與當前的 state 相同，React 將會跳過子組件的 render 及 effect 的執行。（React 使用 [`Object.is` 比較算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)。）

請注意 React 可能仍需要在跳過 render 之前 render 該 component。這不應該是個問題，因為 React 不會不必要地「深入」到組件樹中。如果你在 render 當中執行了高昂的計算，你可以使用 `useMemo` 來優化。

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

返回一個 [memoized](https://en.wikipedia.org/wiki/Memoization) 的 callback。

傳遞一個內聯 callback 及依賴 array。`useCallback` 會返回該 callback 的 memoized 版本，它僅在依賴改變時才會更新。當傳遞 callback 到已優化使用引用相等性來避免不必要 render （例如 `shouldComponentUpdate`）的子 component 時，它將非常有用。

`useCallback(fn, deps)` 相等於 `useMemo(() => fn, deps)`。

> 注意
>
> 依賴 array 並不作為傳到 callback 的參數。但從概念上來説，這是它所代表的：所有在 callback 中引用的值都應該出現在依賴 array 中。在未來，一個足夠先進的編譯器可以自動創建這 array。
>
> 我們建議使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則。它會在依賴錯誤時發出警告並提出修正建議。

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

返回一個 [memoized](https://en.wikipedia.org/wiki/Memoization) 的值。

傳遞一個「創建」function 及依賴 array。`useMemo` 只會在依賴改變時才重新計算 memoized 的值。這個優化可以避免在每次 render 都進行昂貴的計算。

要謹記傳到 `useMemo` 的 function 會在 render 期間執行。不要做一些通常不會在 render 期間做的事情。例如，處理副作用屬於 `useEffect`，而不是 `useMemo`。

如果沒有提供 array，每次 render 時都會計算新的值。

**你可以把 `useMemo` 作為性能優化的手段，但請不要把它當作成語意上的保證。**在將來，React 可能會選擇「忘記」某些之前已 memorized 的值並在下一次 render 時重新計算，例如為已離開屏幕的 component 釋放內存。先編寫沒有 `useMemo` 也可執行的代碼 — 然後再加入它來優化效能。

> 注意
>
> 依賴 array 並不作為傳到 function 的參數。但從概念上來説，這是它所代表的：所有在 callback 中引用的值都應該出現在依賴 array 中。在未來，一個足夠先進的編譯器可以自動創建這 array。
>
> 我們建議使用 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) 中的 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 規則。它會在依賴錯誤時發出警告並提出修正建議。

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` 返回一個可變異的 ref object，其 `.current` 屬性被初始為傳入的參數（`initialValue`）。返回的 object 在 component 的生命週期將保持不變。

一個常見的用例就是命令式地訪問子元件：

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

本質上，`useRef` 就像一個保存可變異值於其 `.current` 屬性的「盒子」。

你應該熟悉 ref 一種主要是用來[訪問 DOM](/docs/refs-and-the-dom.html)的方式。如果你在 React 中以 `<div ref={myRef} />` 傳入 ref object，無論節點如何改變，React 都會將其 `.current` 屬性設為相應的 DOM 節點。

然而，`useRef()` 比 `ref` 屬性更有用。它可以[很方便地保存任何可變異的值](/docs/hooks-faq.html#is-there-something-like-instance-variables)，跟 class 中的實例字段類似。

這是因為 `useRef()` 會創建一個普通的 JavaScript object。`useRef()` 和自建一個 `{current: ...}` object 的唯一不同是 `useRef` 在每次 render 時都會給你同一個的 ref object。

請記住 `useRef` 在其內容有變化時並*不會*通知你。變更 `.current` 屬性不會觸發重新 render。如果你想要在 React 綁定或解綁 DOM 節點的 ref 時執行代碼，你可能需要使用 [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) 來實現。


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle` 可以讓使用 `ref` 時能向父 component 暴露自訂義的實例值。一如既往，在大多數的情況下應避免使用 ref 的命令式代碼。`useImperativeHandle` 應與 `forwardRef`  一同使用：

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

在這個例子，render `<FancyInput ref={fancyInputRef} />` 的父 component 能調用 `fancyInputRef.current.focus()`。

### `useLayoutEffect` {#uselayouteffect}

其簽名與 `useEffect` 相同，但它會在所有 DOM 變異後同步調用。使用它來讀取 DOM 佈局並同步重新 render。在瀏覽器執行繪製之前，`useLayoutEffect` 內部的更新計劃將被同步刷新。

盡可能使用標準的 `useEffect` 來避免阻礙視覺上的更新。

> 提示
>
> 如果你是由 class component 遷移代碼，請注意 `useLayoutEffect` 與 `componentDidMount` 和 `componentDidUpdate` 的調用時機是一樣。不過，**我們建議先使用 `useEffect`**，只當它有問題時才嘗試使用 `useLayoutEffect`。
>
>如果你使用伺服器 render，請記著 `useLayoutEffect` 或 `useEffect` *均不會* 運行，直至 JavaScript 完成加載。這是為什麼在伺服器 render 的 component 包含 `useLayoutEffect` 時 React 會發出警告。要解決這問題，把該邏輯搬到 `useEffect` 裏（如果首次 render 不需要該邏輯），或把 component 廷遲到客戶端完成 render 後才出現（如果直到 `useLayoutEffect` 執行前 HTML 都會錯亂的情況下）。
>
>要在伺服器 render 的 HTML 排除需要 layout effect 的 component，可以利用 `showChild && <Child />` 進行條件 render，並使用 `useEffect(() => { setShowChild(true); }, [])` 來延遲展示。這樣，UI 就不會在完成 render 之前顯示錯亂了。

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` 可以用來在 React DevTools 中顯示自訂義 hook 的標籤。

例如，在[「自定義 hook」](/docs/hooks-custom.html)中提及的 `useFriendStatus` 自定義 hook：

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

> 提示
>
> 我們不建議在每個自定義 hook 都加上 debug 值。它在自定義 hook 共享庫中才是最有價值的。

#### 延遲格式化 debug values {#defer-formatting-debug-values}

在某些情況下，格式化一個顯示值可能會是昂貴的操作。而且在直至檢查 hook 前是不必要的。

因此，`useDebugValue` 接受一個格式化 function 作為可選的第二個參數。該 function 只有在 hook 被檢查時才會被調用。它接受 debug 值作為參數，然後返回一個已格式化的顯示值。

例如，一個返回 `Date` 值的自定義 hook 可以通過以下的格式化 function 來避免不必要地調用 `toDateString` function：

```js
useDebugValue(date, date => date.toDateString());
```
