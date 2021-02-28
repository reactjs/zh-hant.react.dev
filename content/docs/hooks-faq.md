---
id: hooks-faq
title: Hooks 常見問題
permalink: docs/hooks-faq.html
prev: hooks-reference.html
---

*Hooks* 是 React 16.8 中增加的新功能。它讓你不必寫 class 就能使用 state 以及其他 React 的功能。

這一頁會解答一些關於 [Hook](/docs/hooks-overview.html) 常見的問題。

<!--
  if you ever need to regenerate this, this snippet in the devtools console might help:

  $$('.anchor').map(a =>
    `${' '.repeat(2 * +a.parentNode.nodeName.slice(1))}` +
    `[${a.parentNode.textContent}](${a.getAttribute('href')})`
  ).join('\n')
-->

* **[採用策略](#adoption-strategy)**
  * [React 哪一個版本中包含 Hook？](#which-versions-of-react-include-hooks)
  * [我需要重寫所有的 Class component 嗎？](#do-i-need-to-rewrite-all-my-class-components)
  * [我可以在 Hook 做什麼是我在 Class 所不能做的？](#what-can-i-do-with-hooks-that-i-couldnt-with-classes)
  * [Hook 與我的 React 知識有多少保持相關性？](#how-much-of-my-react-knowledge-stays-relevant)
  * [我應該使用 Hook、Class 或是兩者兼具？](#should-i-use-hooks-classes-or-a-mix-of-both)
  * [Hook 包含所有 Class 的使用情境嗎？](#do-hooks-cover-all-use-cases-for-classes)
  * [Hook 可以取代 Render Props 和 Higher-Order Component 嗎？](#do-hooks-replace-render-props-and-higher-order-components)
  * [Hook 對於 Redux connect() 和 React Router 等等其他流行的 API 意味著什麼？](#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router)
  * [Hook 可以使用靜態型別嗎？](#do-hooks-work-with-static-typing)
  * [如何測試使用 Hook 的 component？](#how-to-test-components-that-use-hooks)
  * [Lint 規則究竟強制了些什麼？](#what-exactly-do-the-lint-rules-enforce)
* **[從 Class 到 Hook](#from-classes-to-hooks)**
  * [生命週期方法與 Hook 如何對應？](#how-do-lifecycle-methods-correspond-to-hooks)
  * [我如何使用 Hook fetch 資料？](#how-can-i-do-data-fetching-with-hooks)
  * [是否有類似 Instance 變數的東西？](#is-there-something-like-instance-variables)
  * [我應該使用一個或是多個 state 變數？](#should-i-use-one-or-many-state-variables)
  * [我可以只在更新時執行 effect 嗎？](#can-i-run-an-effect-only-on-updates)
  * [如何取得先前的 prop 或 state？](#how-to-get-the-previous-props-or-state)
  * [為什麼我在 function 內看到舊的 prop 或 state？](#why-am-i-seeing-stale-props-or-state-inside-my-function)
  * [我該如何實作 getDerivedStateFromProps？](#how-do-i-implement-getderivedstatefromprops)
  * [有類似 forceUpdate 的東西嗎？](#is-there-something-like-forceupdate)
  * [我可以對 function component 建立一個 ref 嗎？](#can-i-make-a-ref-to-a-function-component)
  * [我該如何測量一個 DOM node？](#how-can-i-measure-a-dom-node)
  * [const [thing, setThing] = useState() 是什麼意思？](#what-does-const-thing-setthing--usestate-mean)
* **[效能最佳化](#performance-optimizations)**
  * [我可以在更新時忽略 effect 嗎？](#can-i-skip-an-effect-on-updates)
  * [在依賴項目的列表中忽略 function 是安全的嗎？](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  * [如果我的 effect 依賴項目經常變化的話該怎麼辦？](#what-can-i-do-if-my-effect-dependencies-change-too-often)
  * [我該如何實作 shouldComponentUpdate？](#how-do-i-implement-shouldcomponentupdate)
  * [如何 memoize 計算？](#how-to-memoize-calculations)
  * [如何延遲建立昂貴的 object？](#how-to-create-expensive-objects-lazily)
  * [在 render 時建立 function，Hooks 會變慢嗎？](#are-hooks-slow-because-of-creating-functions-in-render)
  * [如何避免向下傳遞 callback？](#how-to-avoid-passing-callbacks-down)
  * [如何從 useCallback 讀取一個經常變化的值？](#how-to-read-an-often-changing-value-from-usecallback)
* **[深入理解](#under-the-hood)**
  * [React 如何將 Hook 呼叫與 component 關聯？](#how-does-react-associate-hook-calls-with-components)
  * [Hook 現有的技術是什麼？](#what-is-the-prior-art-for-hooks)

## 採用策略 {#adoption-strategy}

### React 哪一個版本中包含 Hook？ {#which-versions-of-react-include-hooks}

從 16.8.0 開始，React 包含一個穩定的 React Hooks 實作：

* React DOM
* React Native
* React DOM Server
* React Test Renderer
* React Shallow Renderer

注意，若要**啟動 Hook，所有 React package 需要升級到 16.8.0 或是更高的版本**。例如你忘了升級 React DOM，Hook 將無法正常執行。

[React Native 0.59](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059) 以上的版本支援 Hooks。

### 我需要重寫所有的 Class component 嗎？ {#do-i-need-to-rewrite-all-my-class-components}

不需要。React [沒有計劃](/docs/hooks-intro.html#gradual-adoption-strategy)移除 class -- 我們需要讓產品保持運作，重寫的成本很高，我們建議你在新的程式碼中嘗試 Hook。

### 我可以在 Hook 做什麼是我在 Class 所不能做的？ {#what-can-i-do-with-hooks-that-i-couldnt-with-classes}

Hook 在 component 之間提供強大而富有表現力的新方式來重複使用功能。在[「打造你的 Hook」](/docs/hooks-custom.html)提供了一個可行的方式。[這篇文章](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889)是由 React 核心團隊成員深入研究 Hook 解鎖的新功能。

### Hook 與我的 React 知識有多少保持相關性？ {#how-much-of-my-react-knowledge-stays-relevant}

Hook 已經有許多你知道的方式可以直接使用 React 的功能 -- 像是 state、lifecycle、context 以及 ref。基本上它們並沒有改變 React 的運作方式，而且你對於 component、prop 以及上至下的資料流了解也一樣重要。

Hook 的確有它本身的學習曲線。如果在這份文件中缺漏了些什麼，[提出一個 issue](https://github.com/reactjs/reactjs.org/issues/new)，我們將會嘗試幫助你。

### 我應該使用 Hook、Class 或是兩者兼具？ {#should-i-use-hooks-classes-or-a-mix-of-both}

當你準備好時，我們鼓勵開始使用 Hook 撰寫你新的 component。確保你團隊的成員們使用 Hook 並熟悉本文件。我們並不鼓勵你重寫現有的 class component 成 Hook，除非你已經計劃重寫它們（例如：修正 bug）。

你不可以在 class component *內*使用 Hook，但你絕對可以在單個 tree 中將 class 和 function component 與 Hook 混合使用。無論是 class 或 function component，使用 Hook 是該 component 實作的細節。從長遠來看，我們期待 Hook 可以是大家撰寫 React component 的主要方式。

### Hook 包含所有 Class 的使用情境嗎？ {#do-hooks-cover-all-use-cases-for-classes}

我們的目標是讓 Hook 盡快能涵蓋 class 的所有使用情境。對於不常見的 `getSnapshotBeforeUpdate` 和 `componentDidCatch` 的生命週期並沒有等價的 Hook 方式，但我們計劃很快會加入它們。

這是早期的 Hook，目前一些第三方 function 庫可能與 Hook 不相容。

### Hook 可以取代 Render Props 和 Higher-Order Component 嗎？ {#do-hooks-replace-render-props-and-higher-order-components}

我們思考 Hook 是一個更簡單的方式來提供這個使用情境。這兩種模式仍然有它的用處（例如：一個 virtual scroller component 可能有一個 `renderItem` prop，或是一個 virtual container component 可能有它本身的 DOM 結構）。但在大部分的情況下，Hook 就可以滿足了，而且可以幫助你減少在 tree 內的巢狀 component。

### Hook 對於 Redux `connect()` 和 React Router 等等其他流行的 API 意味著什麼？ {#what-do-hooks-mean-for-popular-apis-like-redux-connect-and-react-router}

你可以繼續使用與以往完全相同的 API；它們依然可以正常使用。

React Redux 從 v7.1.0 [支援 Hooks API](https://react-redux.js.org/api/hooks) 並提供像是 `useDispatch` 或 `useSelector` 的 hooks。

React Router 從 v5.1 版本後[支援 Hooks](https://reacttraining.com/react-router/web/api/Hooks)。

其他像是 React Router 可能在未來會支援 Hooks。

### Hook 可以使用靜態型別嗎？ {#do-hooks-work-with-static-typing}

Hook 的設計考慮到了靜態型別。因為它們是 function，比 Higher-Order Component 等其他模式的 component 更容易正確的定義。最新的 Flow 和 TypeScript 定義包含對 React Hook 的支援。

重要的是，如果你想要以某種嚴格的方式定義 React API，自訂的 Hook 讓你有權利限制。React 為你提供了 primitive，但你可以將它與我們提供的方式，用不同的方式組合在一起。

### 如何測試使用 Hook 的 component？ {#how-to-test-components-that-use-hooks}

從 React 的角度來看，使用 Hook 的 component 就只是一個正常的 component。如果你的測試方案不依賴在 React 內部，測試使用 Hook 的 component 通常與你測試 component 的方式相同。

>注意
>
>[測試方法](/docs/testing-recipes.html)包含許多範例，讓你可以複製貼上。

例如，如果我們有一個計數器 component：

```js
function Example() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
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

我們將會使用 React DOM 測試它。為了確保它在瀏覽器發生的行為，我們將會把程式碼透過呼叫  `ReactTestUtils.act()` 來 render 和更新：

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // 第一次測試 render 和 effect
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // 第二次測試 render 和 effect
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});
```

對  `act()`的呼叫也會更新它內部的 effect。

如果你需要測試自定義的 Hook，你可以透過在測試中建立你的 component，並從中使用 Hook。接著你可以測試你撰寫的 component。

為了減少 boilerplate，我們推薦使用 [`react-testing-library`](https://testing-library.com/react)，它的設計理念是鼓勵你撰寫像使用者在使用 component 的測試。

更多資訊，請參考[測試方法](/docs/testing-recipes.html)。

### [Lint 規則]((https://www.npmjs.com/package/eslint-plugin-react-hooks))究竟強制了些什麼？ {#what-exactly-do-the-lint-rules-enforce}

我們提供一個 [ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) 強制 [Hook 的規則](/docs/hooks-rules.html) 來避免 bug。它假設任何以「`use`」為開頭的 function 和緊跟在它之後的大寫字母是 Hook。我們認知到這個啟發式的搜尋不是完美而且可能有一些誤判，但是如果沒有一個全生態系統的慣例，就沒有辦法讓 Hook 良好的運作 -- 而且，較長的命名會阻礙人們採用 Hook 或是遵循慣例。

特別是，該規範強制執行：

* 呼叫 Hook 要麼是在一個 `PascalCase` function（假設是一個 component）內，或者是其他 `useSomething`  function （假設是一個字定義的 Hook）。
* 在每次的 render 上以相同的順序呼叫 Hook。

這裡還有一些啟發式的方法，當我們發現錯誤並微調規則以平衡避免誤判時，這些規則可能會隨著時間而改變。

## 從 Class 到 Hook {#from-classes-to-hooks}

### 生命週期方法與 Hook 如何對應？ {#how-do-lifecycle-methods-correspond-to-hooks}

* `constructor`：Function component 不需要 constructor。你可以在呼叫 [`useState`](/docs/hooks-reference.html#usestate) 時初始化 state。如果初始化 state 的操作代價很高，你可以傳遞一個  function 到 `useState`。

* `getDerivedStateFromProps`：改為[在 render](#how-do-i-implement-getderivedstatefromprops) 時安排更新。

* `shouldComponentUpdate`：參考 `React.memo` [如下](#how-do-i-implement-shouldcomponentupdate)。

* `render`：這是 function component body 本身。

* `componentDidMount`、`componentDidUpdate`、`componentWillUnmount`：[`useEffect` Hook](/docs/hooks-reference.html#useeffect) 可以表達這些所有的組合（包含[少見](#can-i-skip-an-effect-on-updates)和[常見](#can-i-run-an-effect-only-on-updates)）的情況

* `getSnapshotBeforeUpdate`、`componentDidCatch` 和 `getDerivedStateFromError`：現在沒有 Hook 等價於這些方法，，但是它們未來很快會被加入。

### 我如何使用 Hook fetch 資料？ {#how-can-i-do-data-fetching-with-hooks}

這裡有一個[範例](https://codesandbox.io/s/jvvkoo8pq3)讓你可以開始。想要學習更多，閱讀這篇關於使用 Hook fetch 資料的[文章](https://www.robinwieruch.de/react-hooks-fetch-data/)。

### 是否有類似 Instance 變數的東西？ {#is-there-something-like-instance-variables}

是的！[`useRef()`](/docs/hooks-reference.html#useref) Hook 不只是針對 DOM 的 ref。「ref」object 是一個 generic container，其 `current` 屬性是可變的，可以保存任何值，類似於 class 上的 instance 屬性。

你可以從 `useEffect` 內撰寫它：

```js{2,8}
function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    const id = setInterval(() => {
      // ...
    });
    intervalRef.current = id;
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  // ...
}
```

如果我們想要設定一個計時器，我們不需要 ref（`id` 可能是在 effect），但是如果我們想要從一個 event handler 清除定時器它會很有幫助：

```js{3}
  // ...
  function handleCancelClick() {
    clearInterval(intervalRef.current);
  }
  // ...
```

概念上，你可以將 ref 視為類似於 class 中 instance 的變數。除非你正在做[延遲初始化](#how-to-create-expensive-objects-lazily)，避免在 render 時設定 ref -- 這可能會造成非預期的行為。相反的，通常你會在 event handler 和 effect 中修改 ref。

### 我應該使用一個或是多個 state 變數？ {#should-i-use-one-or-many-state-variables}

如果你原來是使用 class component，你可能會想要呼叫 `useState()` 並一次放入所有的 state 到一個 object，你想要的話可以這麼做。這裡是一個隨著滑鼠移動的 component 範例。我們保持它的位置和大小在 local state 內：

```js
function Box() {
  const [state, setState] = useState({ left: 0, top: 0, width: 100, height: 100 });
  // ...
}
```

現在我們想要撰寫一些邏輯，當使用者移動滑鼠時，改變 `left` 和 `top`。注意我們如何手動合併這些欄位至先前的 state object：

```js{4,5}
  // ...
  useEffect(() => {
    function handleWindowMouseMove(e) {
      // 使用展開運算子「...state」確保我們不會「漏掉」width 和 height
      setState(state => ({ ...state, left: e.pageX, top: e.pageY }));
    }
    // 注意：這個實作是相當簡化的
    window.addEventListener('mousemove', handleWindowMouseMove);
    return () => window.removeEventListener('mousemove', handleWindowMouseMove);
  }, []);
  // ...
```

這是因為當我們更新 state 變數時，我們*替換*它的值。這與 class 中的`this.setState`不同，將被更新的欄位*合併*到 object 中。

如果你漏掉了自動合併，你可以撰寫一個自訂的 `useLegacyState` Hook 來合併 object state 的更新。然而，**我們建議根據哪些值是趨於一起變化的，拆分為多個 state 變數**

例如，我們可以拆分 component state 成 `position` 和 `size` object，並總是替換 `position` 而不需要合併：

```js{2,7}
function Box() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [size, setSize] = useState({ width: 100, height: 100 });

  useEffect(() => {
    function handleWindowMouseMove(e) {
      setPosition({ left: e.pageX, top: e.pageY });
    }
    // ...
```

分離獨立的 state 變數也有另一個好處。稍後可以輕鬆地將一些相關邏輯提取到自定義的 Hook 中，例如：

```js{2,7}
function Box() {
  const position = useWindowPosition();
  const [size, setSize] = useState({ width: 100, height: 100 });
  // ...
}

function useWindowPosition() {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  useEffect(() => {
    // ...
  }, []);
  return position;
}
```

注意我們是如何移動 `position` state 變數的 `useState` 呼叫，並且在不改變我們程式碼的情況下，將相關 effect 寫到自定義的 Hook。如果所有的 state 在一個單一的 object，提取它會變得困難。

以上兩者都將所有 state 放到各自的 `useState`，並可以被呼叫。當你在這兩個極端之間找到平衡時，component 往往最具可讀性，並且將相關 state 變成一些獨立的 state 變數。如果 state 邏輯變得複雜，我們推薦[用 reducer 管理](/docs/hooks-reference.html#usereducer)或者是一個自定義的 Hook。

### 我可以只在更新時執行 effect 嗎？ {#can-i-run-an-effect-only-on-updates}

這是一個特殊的情況，如果你有需要的話，可以[使用 mutable ref](#is-there-something-like-instance-variables) 來手動的儲存對應於第一次或是後續的 render，然後檢查在你 effect 內的 flag。（如果你發現自己經常這樣做，可以為其建立一個自定義的 Hook。）

### 如何取得先前的 prop 或 state？ {#how-to-get-the-previous-props-or-state}

目前來說，你可以手動的[藉由 ref](#is-there-something-like-instance-variables)：

```js{6,8}
function Counter() {
  const [count, setCount] = useState(0);

  const prevCountRef = useRef();
  useEffect(() => {
    prevCountRef.current = count;
  });
  const prevCount = prevCountRef.current;

  return <h1>Now: {count}, before: {prevCount}</h1>;
}
```

這可能有點複雜，但你可以將它提取到自定義的 Hook 中：

```js{3,7}
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```

請注意這對於 props、state 或任何其他被計算值是如何工作的。

```js{5}
function Counter() {
  const [count, setCount] = useState(0);

  const calculation = count + 100;
  const prevCalculation = usePrevious(calculation);
  // ...
```

未來 React 可能將會內建提供 `usePrevious` Hook，因為它是一個相對常見的使用。

另外請參考 [derived state 的推薦模式](#how-do-i-implement-getderivedstatefromprops)。

### 為什麼我在 function 內看到舊的 prop 或 state？ {#why-am-i-seeing-stale-props-or-state-inside-my-function}

任何在 component 內的 function，包括 event handler 和 effect，從被建立的 render 中「看見」props 和 state。例如，思考一下這個程式碼：

```js
function Example() {
  const [count, setCount] = useState(0);

  function handleAlertClick() {
    setTimeout(() => {
      alert('You clicked on: ' + count);
    }, 3000);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={handleAlertClick}>
        Show alert
      </button>
    </div>
  );
}
```

如果你第一次點擊「Show alert」並且遞增 counter，那麼 alert 將會顯示**你當時點擊「Show alert」按鈕**時的 count 變數。假設 prop 和 state 沒有改變的話，這可以避免 bug。

如果你想要從一些非同步的 callback 讀取*最新的* state，你可以把它保留在 [ref](/docs/hooks-faq.html#is-there-something-like-instance-variables)，mutate 它，並從中讀取。

最後，如果你使用「dependency array」做最佳化，但沒有正確的指定所有的依賴，你可能會看到舊的 props 或是 state。例如，如果在 effect 指定 `[]` 作為第二個參數，但是在內部讀取 `someProp`，它將只會「看到」`someProp` 的初始值。解決方式是移除 dependency array 或者是修正它。這裡是[你如何處理這些 function](#is-it-safe-to-omit-functions-from-the-list-of-dependencies)，以及[其他常見的策略](#what-can-i-do-if-my-effect-dependencies-change-too-often)在不錯誤地跳過依賴項的情況下減少執行 effect。

>注意
>
>我們提供了一個 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) 的 ESLint 規則作為 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package 的一部份。它會在指定錯誤的依賴時，發出警告並提供建議修復。

### 我該如何實作 getDerivedStateFromProps？ {#how-do-i-implement-getderivedstatefromprops}

雖然你可能[不需要它](/blog/2018/06/07/you-probably-dont-need-derived-state.html)，但在極少數情況下（例如實作`<Transition>` component），你可以在 render 期間更新 state。React 將會在第一次的 render 退出後，重新執行 component 並且立即更新 state，這個操作代價不會很昂貴。

在這裡，我們將 `row` prop 先前的值存儲在 state 變數中，讓我們可以方便的比較：

```js
function ScrollView({row}) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [prevRow, setPrevRow] = useState(null);

  if (row !== prevRow) {
    // Row 在最後一次 render 被改變。更新 isScrollingDown
    setIsScrollingDown(prevRow !== null && row > prevRow);
    setPrevRow(row);
  }

  return `Scrolling down: ${isScrollingDown}`;
}
```

這個第一眼看起來可能很奇怪，但是 render 過程中的更新正是 `getDerivedStateFromProps` 的概念。

### 有類似 forceUpdate 的東西嗎？ {#is-there-something-like-forceupdate}

如果新的值與先前相同的話，`useState` 和 `useReducer` Hook 兩者都可以從[更新中跳脫](/docs/hooks-reference.html#bailing-out-of-a-state-update)。

通常來說，你不應該在 React 內 mutate local state，然而，你可以使用一個 increment couter 來作為跳脫方式，強迫重新 render，即使 state 沒有改變。

```js
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```

如果可以的話，盡量避免使用這個方式。

### 我可以對 function component 建立一個 ref 嗎？ {#can-i-make-a-ref-to-a-function-component}

雖然你不應該經常這樣做，但是你可以使用 [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle) Hook expose 一些 imperative 方法給 parent component。

### 我該如何測量一個 DOM node？ {#how-can-i-measure-a-dom-node}

為了測量 DOM node 的位置或是大小，你可以使用 [callback ref](/docs/refs-and-the-dom.html#callback-refs)。只要 ref 被 attach 到不同的 node，React 將會呼叫這個 callback。這裡是一個[簡易的範例](https://codesandbox.io/s/l7m0v5x4v9)：

```js{4-8,12}
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```

在這個範例我們不選擇 `useRef` 是因為一個 object 的 ref 不會通知我們目前的 ref 值的*改變*。使用一個 callback ref 確保[即使 child component 延遲顯示測量的 node](https://codesandbox.io/s/818zzk8m78) （例如：在 response click），我們仍然會在 parent component 中收到有關它的通知，並可以更新測量結果。

這確保我們的 ref callback 不會在 re-render 時改變，因此 React 不需要呼叫它。

在這個範例，callback ref 只會在當 component mount 以及 unmount 時被呼叫，由於被 render 的 `<h1>` component 在所有 render 都保持存在。如果你想要在任何時候在 component resize 時被通知，你可以使用 [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) 或其他第三方的 Hook。

如果你希望呼叫它的話，你可以[抽出這個邏輯](https://codesandbox.io/s/m5o42082xy)變成一個可重複使用的 Hook：

```js{2}
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```


### `const [thing, setThing] = useState()` 是什麼意思？ {#what-does-const-thing-setthing--usestate-mean}

如果你不熟悉這個語法的話，可以參考在 State Hook 文件的[解釋](/docs/hooks-state.html#tip-what-do-square-brackets-mean)。


## 效能最佳化 {#performance-optimizations}

### 我可以在更新時忽略 effect 嗎？ {#can-i-skip-an-effect-on-updates}

可以的。請參考[條件式觸發 effect](/docs/hooks-reference.html#conditionally-firing-an-effect)。請注意，忘記處理更新通常[導致 bug](/docs/hooks-effect.html#explanation-why-effects-run-on-each-update)，這就是為什麼這不是預設行為。

### 在依賴項目的列表中忽略 function 是安全的嗎？ {#is-it-safe-to-omit-functions-from-the-list-of-dependencies}

一般來說，不是。

```js{3,8}
function Example({ someProp }) {
  function doSomething() {
    console.log(someProp);
  }

  useEffect(() => {
    doSomething();
  }, []); // 🔴 這個不安全（呼叫 `doSomething` 的 function 使用了 `someProp`）
}
```

要記住 effect 之外的 function 使用了哪些 props 或 state 是很困難的。這也是為什麼**通常你需要在 effect *內*宣告所需要的 function。**然後可以很容易的看出 effect 依賴了 component 範圍內的值：

```js{4,8}
function Example({ someProp }) {
  useEffect(() => {
    function doSomething() {
      console.log(someProp);
    }

    doSomething();
  }, [someProp]); // ✅ OK（我們的 effect 只使用 `someProp`）
}
```

如果之後我們仍然不使用 component 範圍內的任何值，則可以安全的指定為 `[]`：

```js{7}
useEffect(() => {
  function doSomething() {
    console.log('hello');
  }

  doSomething();
}, []); // ✅ OK，在這個範例中，因為我們不使用 component 範圍中的*任何*值
```

根據你的使用情境，還有一些選項如下所述。

>注意
>
>我們提供了 [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) ESLint 規則作為 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package 的一部份。它可以幫助你找到不一致的處理更新的 component。

讓我們看看這個為什麼很重要。

如果你在 `useEffect`、`useLayoutEffect`、`useMemo`、`useCallback` 或是 `useImperativeHandle` 的最後指定了[依賴項目的列表](/docs/hooks-reference.html#conditionally-firing-an-effect)，它必須包含在 callback 內使用的值以及參與 React 的資料流。包含了 props、state 和從它們取得的任何值。

如果沒有任何內容（或由它呼叫的 function）reference 到 props、state 或是從它們取得的值，那麼從依賴項目中省略一個 function 是*唯一*安全的。這個範例有一個 bug：

```js{5,12}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  async function fetchProduct() {
    const response = await fetch('http://myapi/product/' + productId); // 使用 productId prop
    const json = await response.json();
    setProduct(json);
  }

  useEffect(() => {
    fetchProduct();
  }, []); // 🔴 無效，因為 `fetchProduct` 使用 `productId`
  // ...
}
```

**推薦修正的方法是將 function 移動到你的 effect _內部_。**這樣可以很容易地看到你的 effect 使用了哪些 props 或 state，並確保他們都被宣告：

```js{5-10,13}
function ProductPage({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 透過將這個 function 移動到 effect 內部，我們可以清楚地看到值的使用。
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      setProduct(json);
    }

    fetchProduct();
  }, [productId]); // ✅ 有效，因為我們的 effect 只使用 productId
  // ...
}
```

這也可以允許你處理在 effect 內使用 local 變數處理無序的 response：

```js{2,6,10}
  useEffect(() => {
    let ignore = false;
    async function fetchProduct() {
      const response = await fetch('http://myapi/product/' + productId);
      const json = await response.json();
      if (!ignore) setProduct(json);
    }

    fetchProduct();
    return () => { ignore = true };
  }, [productId]);
```

我們搬移 function 到 effect 內部，所以它不需要被加入在依賴列表。

>Tip
>
>查看[這個簡易的範例](https://codesandbox.io/s/jvvkoo8pq3)以及[這篇文章](https://www.robinwieruch.de/react-hooks-fetch-data/)來學習關於如何使用 Hooks 來取得資料。

**如果有一些因素讓你_不能_搬移 function 到 effect 內，這裡有一些其他的選項：**

* **你可以嘗試將 function 搬移到 component 之外**。在這個情況下， function 可以保證不 reference 到任何的 props 或 state，而且也不需要在依賴項目的列表中。
* 如果你正在呼叫的 function 是 pure 的計算，而且可以在 render 時被安全的呼叫，**你可以在 effect 外呼叫它，**並讓 effect 取決於回傳的值。
* 作為最後的手段，你可以**加入一個 function 到 effect 依賴項目，但是_封裝它的定義_**成 [`useCallback`](/docs/hooks-reference.html#usecallback) Hook。這可以確保它不會在每次 render 時改變，除非*它自己*的依賴項目也改變：

```js{2-5}
function ProductPage({ productId }) {
  // ✅ 藉由 useCallback 封裝可以避免在每次 render 時改變
  const fetchProduct = useCallback(() => {
    // ... Does something with productId ...
  }, [productId]); // ✅ 所有 useCallback 依賴已經被指定

  return <ProductDetails fetchProduct={fetchProduct} />;
}

function ProductDetails({ fetchProduct })
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]); // ✅ 所有 useEffect 依賴已經被指定
  // ...
}
```

注意，在上面的範例中，我們*需要*保持 function 在依賴列表內。這可以確保 `ProductPage` 中的 `productId` 改變自動會觸發 `ProductDetails` component 的 refetch。

### 如果我的 effect 依賴項目經常變化的話該怎麼辦？ {#what-can-i-do-if-my-effect-dependencies-change-too-often}

有時候，你的 effect 可能使用 state 而且它經常改變。你可能想從依賴的項目列表中省略該 state，但這通常會導致 bug：

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // 這個 effect 依賴於 `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []); // 🔴 Bug：`count` 沒有被指定作為一個依賴

  return <h1>{count}</h1>;
}
```

設定空的依賴 `[]`，意味著 effect 將只會在 component mount 的時候只執行一次，而不是在每次 re-render。問題在於內部的 `setInterval` callback，`count` 值並不會改變，因為我們已經建立一個 closure 並且設定 `count` 為 `0`，就像執行 effect callback 時一樣。在每秒鐘，這個 callback  呼叫 `setCount(0 + 1)`，所以 count 永遠不會大於 1。

指定 `[count]` 作為依賴項目可以修正這個 bug，但會導致每次更改時重置間隔。實際上，每個 `setInterval` 在被清除之前都有一次機會執行（類似於 `setTimeout`。）這可能並不理想。要修正這個問題，我們可以使用 [`setState` 的 functional 更新的形式](/docs/hooks-reference.html#functional-updates)。它允許我們指定*如何* state 需要改變而不引用*目前*的 state：

```js{6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // ✅ 這不會依賴於外部的 `count` 變數
    }, 1000);
    return () => clearInterval(id);
  }, []); // ✅ 我們的 effect 不使用 component 範圍內的任何變數

  return <h1>{count}</h1>;
}
```

（`setCount` function 的 identity 的保證是穩定的，因此省略它是安全的。）

現在，`setInterval` callback 每秒執行一次，但每次對 `setCount` 內部的呼叫都可以使用 `count` 最新的值（在 callback 中被呼叫的 `c`。）

在許多複雜的情況下（例如，一個 state 依賴另一個 state），嘗試使用 [`useReducer` Hook](/docs/hooks-reference.html#usereducer) 將 state 的更新邏輯搬移到 effect 外。[這篇文章](https://adamrackis.dev/state-and-use-reducer/)提供了一個如何做到的範例。**`useReducer` 中的 `dispatch` function 的 identity 是穩定的** — 即使 reducer function 被宣告在 component 內並讀取它的 props。

作為最後的手段，如果你需要像是 class 內的 `this`，你可以[使用 ref](/docs/hooks-faq.html#is-there-something-like-instance-variables) 來持有一個 mutable 變數。然後你可以寫入和讀取它。例如：

```js{2-6,10-11,16}
function Example(props) {
  // 保持最新的 props 在 ref。
  const latestProps = useRef(props);
  useEffect(() => {
    latestProps.current = props;
  });

  useEffect(() => {
    function tick() {
      // 在任何時候讀取最新的 props
      console.log(latestProps.current);
    }

    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []); // 這個 effect 永遠不會重新執行
}
```

如果你真的找不到其他更好的方式才這麼做，因為依賴 mutation 會讓 component 的可預測性降低。如果有一個特定的模式不能很好地轉換，請[提出 issue](https://github.com/facebook/react/issues/new) 並附上可執行的範例程式碼，我們可以嘗試提供幫助。

### 我該如何實作 shouldComponentUpdate？ {#how-do-i-implement-shouldcomponentupdate}

你可以藉由 `React.memo` 封裝 function 來對它的 props 進行淺比較：

```js
const Button = React.memo((props) => {
  // 你的 component
});
```

它不是一個 Hook，因為它並不像 Hooks 那樣的組成。`React.memo` 相等於 `PureComponent`，但是它只比較 props。（你也可以加入第二參數，指定一個舊 props 和新 props 的比較 function 。如果它回傳 true，則跳過更新。）

`React.memo` 不比較 state，因為沒有單一的 state object 可以比較。但你也可以讓 children 變成 pure，甚至可以[透過 `useMemo` 來最佳化個別的 children](/docs/hooks-faq.html#how-to-memoize-calculations)。

### 如何 memoize 計算？ {#how-to-memoize-calculations}

[`useMemo`](/docs/hooks-reference.html#usememo) Hook 讓你可以透過「記住」先前的計算來快取多個 render 之間的計算：

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

這個程式碼呼叫 `computeExpensiveValue(a, b)`。但是如果 `[a, b]` 依賴自上一個值沒有改變，那麼 `useMemo` 會跳過第二次的呼叫並只重複使用它回傳的最後一個值。

記住，被傳到 `useMemo` 的 function 會在 render 期間執行。不要在 render 期間做一些通常不會做的事情。例如，side effects 屬於在 `useEffect` 被處理，而不是 `useMemo`。

**你可以依賴 `useMemo` 作為效能的最佳化，而不是依賴語意的保證。** 未來 React 可能會選擇「忘記」一些先前 memoize 的值，並在下一次 render 重新計算，例如，釋放螢幕以外的 component 記憶體。撰寫你的程式碼，讓它在沒有 `useMemo` 的狀況下依然可以執行 - 並且加上它來最佳化效能。（對於極少數的情況，值*永遠*不會被重新計算，你可以[延遲初始化](#how-to-create-expensive-objects-lazily) ref。）

方便的是，`useMemo` 也可以讓你跳過一個 child 昂貴的 re-render：

```js
function Parent({ a, b }) {
  // 只會在 `a` 改變時 re-render：
  const child1 = useMemo(() => <Child1 a={a} />, [a]);
  // 只會在 `b` 改變時 re-render：
  const child2 = useMemo(() => <Child2 b={b} />, [b]);
  return (
    <>
      {child1}
      {child2}
    </>
  )
}
```

注意，這個方法在一個迴圈中無法執行，因為 Hook [不能](/docs/hooks-rules.html)被放在迴圈內。但是你可以提取一個清單列表的獨立 component，並在這裡呼叫 `useMemo`。

### 如何延遲建立昂貴的 object？ {#how-to-create-expensive-objects-lazily}

如果依賴相同的話，`useMemo` 讓你可以 [memoize 一個昂貴的計算](#how-to-memoize-calculations)。然而，它只是個提示，並不能*保證*計算不會重新執行。但有時候你需要確保一個 object 只被建立一次。

**第一個常見的情況是建立昂貴的初始 state：**

```js
function Table(props) {
  // ⚠️ createRows() 在每次 render 被呼叫
  const [rows, setRows] = useState(createRows(props.count));
  // ...
}
```

為了避免重新建立初始 state，我們可以傳遞一個 **function** 給 `useState`：

```js
function Table(props) {
  // ✅ createRows() 只會被呼叫一次
  const [rows, setRows] = useState(() => createRows(props.count));
  // ...
}
```

React 只會在第一次 render 時呼叫這個 function。參考 [`useState` API](/docs/hooks-reference.html#usestate)。

**你偶爾可能也想要避免重新建立 `useRef()` 初始值。**例如，或許你想要確保某些 imperative class 只被建立一次：

```js
function Image(props) {
  // ⚠️ IntersectionObserver 在每次 render 時被建立
  const ref = useRef(new IntersectionObserver(onIntersect));
  // ...
}
```

`useRef` **不**接受像 `useState` 這樣特殊的重載 function。你可以撰寫你自己的 function 來建立並延遲設定：

```js
function Image(props) {
  const ref = useRef(null);

  // ✅ IntersectionObserver 會延遲被建立一次
  function getObserver() {
    if (ref.current === null) {
      ref.current = new IntersectionObserver(onIntersect);
    }
    return ref.current;
  }

  // 當你需要它的時候，呼叫 getObserver()
  // ...
}
```

這是避免了在第一次真正需要之前建立昂貴的 object。如果你使用 Flow 或者是 TypeScript，為了方便你也可以給定 `getObserver()` 一個 non-nullable 的型別。


### 在 render 時建立 function，Hooks 會變慢嗎？ {#are-hooks-slow-because-of-creating-functions-in-render}

不會，在現代瀏覽器中，除了在極端情況下，closure 的原生效能與 class 相較之下沒有明顯的差異。

此外，考慮到 Hooks 的設計在以下幾個方面很有效：

* Hook 可以避免 class 的大量開銷，像是建立 class instance 並在 constructor 綁定 event hanlder。

* **習慣使用 Hooks 的程式碼後，就不需要深層的巢狀 component**，這在 higher-order component、render props 和 context 等其他流行函式庫中普遍存在，使用較小的 component tree，React 可以減少更多的工作量。

傳統上，在 React inline function 的效能問題與如何在 child component 中，在每個 render 打破 `shouldComponentUpdate` 最佳化傳遞新的 callback 有關。Hooks 從三個方面來處理這個問題。

* The [`useCallback`](/docs/hooks-reference.html#usecallback) Hook 讓你可以在重新 render 之間保持相同的 callback，所以 `shouldComponentUpdate` 依然可以運作：

    ```js{2}
    // 除非 `a` 或 `b` 改變，否則不改變
    const memoizedCallback = useCallback(() => {
      doSomething(a, b);
    }, [a, b]);
    ```

* [`useMemo`](/docs/hooks-faq.html#how-to-memoize-calculations) Hook 讓獨立的 children 更新時，可以更容易的被控制，減少對 pure component 的需求。

* 最後，[`useReducer`](/docs/hooks-reference.html#usereducer) Hook 減少傳遞深層的 callback 需要，我們將會在下面解釋。

### 如何避免向下傳遞 callback？ {#how-to-avoid-passing-callbacks-down}

我們發現大部分的人不喜歡透過 component tree 的每一層手動傳遞 callback。即使它是更明確，它可以感覺像是有許多「管道」。

在大型的 component tree 中，我們推薦另一個方法是透過 context 從 [`useReducer`](/docs/hooks-reference.html#usereducer) 傳遞一個 `dispatch` function：

```js{4,5}
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 注意：`dispatch` 在 re-render 之間不會改變
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```

任何在 `TodosApps` 內的 child component 可以使用 `dispatch` function 來傳遞 action 到 `TodosApp`：

```js{2,3}
function DeepChild(props) {
  // 如果我們想要執行一個 action，我們可以從 context 取得 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```

從維護的角度來看更方便（不需要持有轉發 callback），並且完全避免了 callback 問題。像這樣傳遞 `dispatch` 是深度更新的推薦模式。

請注意，你仍然可以選擇是否將應用程式的 *state* 向下傳遞為 props（更明確）還是作為 context（對於非常深的更新更方便）。如果你也使用 context 傳遞 state，使用兩個不同的 context type -- `dispatch` context 永遠不會改變，因此讀取它的 component 不需要重新 render，除非它們也需要應用程式的 state。

### 如何從 `useCallback` 讀取一個經常變化的值？ {#how-to-read-an-often-changing-value-from-usecallback}

>注意
>
>我們建議[在 context 中傳遞 `dispatch`](#how-to-avoid-passing-callbacks-down)，而不是在 props 中傳遞單獨的 callback。下面的方法僅在此處提及完整性和跳脫方法。
>
>另外請注意，在這個模式可能會導致 [concurrent 模式](/blog/2018/03/27/update-on-async-rendering.html)出現問題。我們計畫在未來提供更多解決方案，但目前最安全的解決方式是，如果有些值取決於更改，則會使 callback 無效。

在極少數的情況下你可能會透過 [`useCallback`](/docs/hooks-reference.html#usecallback) memoize 一個 callback，但是因為內部 function 必須常常被重新建立，所以 memoize 沒有辦法很好個運作。如果你要 memoize 的 function 是一個 event hanlder，而且它不會被在 render 時被使用，你可以使用 [ref 作為一個 instance 變數](#is-there-something-like-instance-variables)，並手動儲存最後被 commit 的值：

```js{6,10}
function Form() {
  const [text, updateText] = useState('');
  const textRef = useRef();

  useEffect(() => {
    textRef.current = text; // 將它寫到 ref
  });

  const handleSubmit = useCallback(() => {
    const currentText = textRef.current; // 從 ref 讀取它
    alert(currentText);
  }, [textRef]); // 不要像 [text] 那樣重新建立 handleSubmit

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}
```

這是一個相當複雜的模式，但如果你需要，可以執行這個跳脫最佳化。如果你提取它到自訂的 Hook：

```js{4,16}
function Form() {
  const [text, updateText] = useState('');
  // 如果 `text` 改變，將會被 memoize：
  const handleSubmit = useEventCallback(() => {
    alert(text);
  }, [text]);

  return (
    <>
      <input value={text} onChange={e => updateText(e.target.value)} />
      <ExpensiveTree onSubmit={handleSubmit} />
    </>
  );
}

function useEventCallback(fn, dependencies) {
  const ref = useRef(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(() => {
    const fn = ref.current;
    return fn();
  }, [ref]);
}
```

在任何一種情況下，我們**都不推薦這種模式**，僅在此呈現完整性。相反的，最好[避免在深處傳遞 callback](#how-to-avoid-passing-callbacks-down)。


## 深入理解 {#under-the-hood}

### React 如何將 Hook 呼叫與 component 關聯？ {#how-does-react-associate-hook-calls-with-components}

React 會持續追蹤目前 render 的 component。感謝 [Hooks 的規則](/docs/hooks-rules.html)，我們知道 Hook 只能從 React component（或自訂的 Hook -- 它們也只能從 React component 中被呼叫）被呼叫。

每一個 component 有一個「memory cell」的內部列表。它們只是我們可以放入一些資料的 JavaScript object。當你呼叫像是  `useState()` 的 Hook，它會讀取目前的 cell（或在第一次 render 時初始化它），並將指標移動到下一個。這就是多個 `useState()` 的呼叫，取得每個獨立的 local state。

### Hook 現有的技術是什麼？ {#what-is-the-prior-art-for-hooks}

Hooks 綜合了幾個不同來源的想法：

* 在 [react-future](https://github.com/reactjs/react-future/tree/master/07%20-%20Returning%20State) repository 中，我們使用 functional APIs 的舊實驗。
* React 社群使用 render props APIs 的實驗，包括 [Ryan Florence](https://github.com/ryanflorence) 的 [Reactions Component](https://github.com/reactions/component)。
* [Dominic Gannaway](https://github.com/trueadm) 的 [`adopt` keyword](https://gist.github.com/trueadm/17beb64288e30192f3aa29cad0218067) 提案作為 render props 的語法糖。
* [DisplayScript](http://displayscript.org/introduction.html) 中的 state 變數以及 state 單元。
* ReasonReact 中的 [Reducer components](https://reasonml.github.io/reason-react/docs/en/state-actions-reducer.html)。
* Rx 中的 [Subscriptions](http://reactivex.io/rxjs/class/es6/Subscription.js~Subscription.html)。
* Multicore OCaml 中的 [Algebraic effects](https://github.com/ocamllabs/ocaml-effects-tutorial#2-effectful-computations-in-a-pure-setting)。

[Sebastian Markbåge](https://github.com/sebmarkbage) 想出了 Hook 的原始設計，之後由 [Andrew Clark](https://github.com/acdlite)、[Sophie Alpert](https://github.com/sophiebits)、[Dominic Gannaway](https://github.com/trueadm) 以及其他 React 團隊的成員加以完善。
