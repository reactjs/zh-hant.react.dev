---
title: useCallback
---

<Intro>

`useCallback` 是一個允許你在每個重新 render 之間緩存函數的一個 React Hook。

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<InlineToc />

---

## 參考 {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

在頂層的component使用 `useCallback` 來在每個重新 render 之間緩存函數：

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[參見以下更多例子](#usage)

#### 參數 {/*parameters*/}

* `fn`：想要緩存的函數。此函數可以接受任何參數並且返回任何值。在初次的 render 中，React 會返回(不是呼叫) 此函數. 在下一次的 render 中, 假如 `dependencies` 在上一次的 render 之後沒有改變的話，React 將會返回相同的函數。否則，React 會返回在最新一次的 render 中傳入的函數，並且將其緩存以便之後使用。 React 不會呼叫此函數，React 只會把此函數返回給你，並讓你決定何時以及是否呼叫此函數。

* `dependencies`：包含了所有在 `fn` 的程式碼裡被參考的 reactive 的值的一個清單。 Reactive 值包括 props， state，和所有在你 component 內直接申報的變數和函數。 假如你的 linter 是 [配置了 React](/learn/editor-setup#linting)，那麼它將會核對每一個 reactive 的值是被正確地指定成 dependency。 Dependencies 的清單必須具有確切數量的項目和像 `[dep1, dep2, dep3]`一樣編寫。 React 會使用 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 的對照演算法來讓每一個 dependency 和它之前的值進行比較。

#### 返回值 {/*returns*/}

在初次的 render 中， `useCallback` 會返回你已經傳入的 `fn` 函數。

在之後的render中, 如果 dependencies 沒有改變的話，`useCallback` 會返回上一次 render 中緩存的 `fn`函數。否則， `useCallback`會返回在這次 render 中傳入的 `fn` 函數。

#### 注意 {/*caveats*/}

* `useCallback` 是一個 Hook，所以你只能在 **在你頂層的component** 或者自定義的 Hooks 裡使用. 你不能夠在 loops 或者 conditions 裡面使用`useCallback`。如果你需要這樣做, 請新建一個 component 並將 state 移入其中。
* 除非有特定的原因，React **不會丟棄已緩存的函數** 例如，在開發中，當你編輯 component 檔案時，React 會丟棄緩存。在生產和開發環境中，如果你的component在初次mount的時候暫停了，React 將會丟棄緩存。在未來，React 可能會增加更多丟棄緩存機制的功能。比如說，假如 React 未來增加了對虛擬清單的內建支持功能，那麼對於在滾動虛擬清單的視窗中的項目，丟棄緩存是有意義的。如果你依賴`useCallback`作為一個性能最佳化的途徑，這些應該會符合你的期望。否則，請考慮使用 [state variable](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) 或 [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents)。

---

## 用法 {/*usage*/}

### 跳過 components 的 重新 render {/*skipping-re-rendering-of-components*/}

當你在優化 rendering 的表現時，有時候你會需要緩存你傳遞給 child components 的函數。讓我們先看一下這語法如何實現，然後理解在哪種情況下它是有用的。

為了緩存每個你的 component 重新 render 之間的函數，你需要把它的定義包裝進`useCallback` Hook 中：

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

你需要傳遞兩個參數給 `useCallback`：

1. 在重新 render 中，你想緩存的函數的定義。
2. 一份包括了所有你在 component 中的函數的 <CodeStep step={2}>dependencies 清單</CodeStep>

在初次 render 中，你在`useCallback`獲得的 <CodeStep step={3}> 返回函數</CodeStep> 將會是你已經傳入的函數。

在之後的render中，React 會比較 <CodeStep step={2}>dependencies</CodeStep> 和你在之前的 render 裡傳入的 dependencies。如果dependencies 沒有改變的話 (相比起 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is))，`useCallback` 會返回跟之前一樣的函數。否則， `useCallback` 會返回你在 *此次* render 中傳入的函數。

換句話說，`useCallback` 緩存在各個重新 renders 之間的函数直到它的 dependencies 改變。

**讓我們透過一個範例看看它何時有用。**

假設你從 `ProductPage` 傳入一個 `handleSubmit` 函数到 `ShippingForm` component：

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

你會注意到切換 `theme` prop 會讓應用程式停滯一下， 但假如你將 `<ShippingForm />` 從你的 JSX 中移除了, 應用程式會更快反應. 這告訴了你 我們值得嘗試去優化 `ShippingForm` component。

**預設情況下, 當一個 component 重新 render 時, React 會遞迴式的 重新 render 這 component 的所有 children。** 這就是為什麼當 `ProductPage` 使用另一個 `theme` 重新 render 時，`ShippingForm` component *也會* 重新 render。這對於不需要太量計算來重新 render的component來說是沒問題的。 但假如你發現一個重新 render 特別的慢，當 `ShippingForm` 的 props 是和上次的 render 一樣時，你可以把`ShippingForm` 包裝進 [`memo`](/reference/react/memo) 裡面，從而讓 `ShippingForm` 跳過重新 render。

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**當程式碼像上面一樣改變後，假如`ShippingForm` 所有的 props 都跟在上一個 render 時相同的話，`ShippingForm` 會跳過重新 render。**這時緩存函數就變得很重要了。你在沒有使用 `useCallback` 的情況下定義了 `handleSubmit`：

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 每當 theme 改變時，都會產生一個不同的函數...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }
  
  return (
    <div className={theme}>
      {/* 這將導致 ShippingForm's props 不會再是一樣的, 並且它每次都會重新 render*/}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**在 JavaScript 中, 一個 `function () {}` 或者 `() => {}` 總是會產生出來不一樣的函數，** 就像 `{}`總是會產生新的物體。正常情況下來說，這不會有問題，但這代表了 `ShippingForm` props 不會再是一樣了，而且你的 [`memo`](/reference/react/memo) 的性能優化方法也不會生效。這就是 `useCallback` 起作用的地方：

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // 告訴 React 在每次重新 render 中間去緩存你的函數...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...只要這些 dependencies 都不改變...

  return (
    <div className={theme}>
      {/* ...ShippingForm 會收到一樣的 props 並且會跳過重新 render */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**把 `handleSubmit` 包裝進 `useCallback`中, 你便確保了 它在每次重新 render 之間都是 *一樣的* 函數** (直到 dependencies 改變)。除非出於某種特定原因，你不需要將一個函數包裝進 `useCallback` 中。在這個例子當中，你把它傳入到一個包裝進[`memo`,](/reference/react/memo) 中的 component，從而讓它跳過了重新 render。至於其他需要用到 `useCallback`的原因，本頁將對此有進一步的描述。

<Note>

**你應該只使用 `useCallback` 來達成性能最佳化** 假如你的程式碼在沒有它的情況下運作不了，請先找到根本問題並先修復它，然後再使用 `useCallback`。

</Note>

<DeepDive>

#### `useCallback` 與 `useMemo` 有何關聯? {/*how-is-usecallback-related-to-usememo*/}

你會經常看到 [`useMemo`](/reference/react/useMemo) 和 `useCallback`一起使用。當你嘗試優化 child component時，它們都很有幫助。它們會 [memoize](https://en.wikipedia.org/wiki/Memoization) (換句話說，緩存) 正在傳入的東西：

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // 使用你的函數並且緩存它的結果
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // 緩存你的函數
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

分別在於它們讓你緩存 *甚麼*：

* **[`useMemo`](/reference/react/useMemo) 緩存 使用你的函數的 *結果*。** 在這個例子裡，它緩存了使用 `computeRequirements(product)` 的結果。所以除非 `product` 改變了，否則它也不會改變。 這讓你向下傳遞 `requirements` 的物件不會讓 `ShippingForm` 發生不必要的重新 render。必要時, React 會使用你在 rendering 時傳入的函數來計算結果。
* **`useCallback` 緩存 *函數本身。*** 不像 `useMemo`, 它不會使用你提供的函數. 相反，它會緩存你提供的函數。因此除非 `productId` 或 `referrer` 發生改變，`handleSubmit` *本身* 是不會改變的。 這讓你向下傳遞 `handleSubmit` 的函數時不會讓 `ShippingForm` 發生不必要的重新 render。 你的程式碼不會運行直到用戶提交了表格。

如果你已經熟悉了 [`useMemo`](/reference/react/useMemo)，你可能會發現把 `useCallback` 視為以下內容的時候會很有幫助：

```js
// 在 React 裡面簡化的執行
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[閱讀更多關於 `useMemo` 和 `useCallback` 之間的區別。](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### 你是否應該在所有地方添加 useCallback ? {/*should-you-add-usecallback-everywhere*/}

如果你的應用程式是像本網頁一樣，而且大部分的互動都是粗略的 (像是更換頁面或整個部分)，memoization 是通常不必要的。 如果你的應用程式是像一個繪圖編輯器，而且大部分的互動都是精細的 (像是移動形狀)，那麼你會發現 memoization 會變得非常有用。 

使用 `useCallback` 緩存函數僅在少數情況下是有價值的：

- 你將它當成一個 prop 來傳入到包裝在 [`memo`.](/reference/react/memo) 中的 component。假如這個 prop 的值沒有變化的話， 你會想要跳過 重新 render。 Memoization 允許你的 component 在只有 dependencies 改變的情況下才會重新 render。
- 你傳入的函數之後作為某些 Hook 的 dependency。比如說，另一個放在 `useCallback` 裡的函數依賴於它，或者你依賴於 [`useEffect.`](/reference/react/useEffect) 中的函數。

在其他情況下，把函數包裝在`useCallback`中是沒有意義的。不過即便這樣子做了，也不會帶來壞處。所以有些團隊選擇不考慮個別例子，並盡可能memoize。這樣的壞處是你的程式碼可能變得難以閱讀。而且不是所有 memoization 都是有效的：一個新的值就足以打破整個 component 的 memoization。

請注意 `useCallback` 不會阻止 *建立* 函數。 你總是會在建立函數(而這是沒問題的!), 但假如沒有東西改變的話 React 會忽略它並返回一個緩存的函數給你。

**在實際應用上, 你可以遵守以下幾個原則來減少不必要的 memoization：**

1. 當一個 component 在視覺上包裝著別的 components 時, 讓他 [接受 JSX 作為 children](/learn/passing-props-to-a-component#passing-jsx-as-children)。 然後, 如果包裝 component 更新了它自己的 state 的話，React 會知道它的 children 不需要重新 render.
1. 建議使用 local state 並且不要 [lift state up](/learn/sharing-state-between-components) 超過任何必要的程度。不要把像是清單和項目是否懸停等的 transient state 保存在樹的最頂部或者在一個 global state library。
1. 保持你的 [rendering 邏輯純粹。](/learn/keeping-components-pure) 如果把一個 component 重新 render 會導致問題或者產生一些明顯的視覺瑕疵， 那代表了你的 component 裡面有自身的問題! 請把component的問題修復好，而不是增加 memoization。
1. 避免 [非必要且會更新你的 state 的 Effects](/learn/you-might-not-need-an-effect) 大部分 React 應用程式裡的性能問題都是因為從 Effects 開始的一連串更新引起的，並且導致你的 components 不停地 render。
1. 嘗試 [從 Effects 中 移除不必要的 dependencies](/learn/removing-effect-dependencies) 比如說, 相比起 memoization, 把某些物件或在 Effect 裡或者 Component 外面的函數移除通常會更加簡單。

假如某一個互動仍然感覺滯後，[請使用 React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) 來看看哪一個 components 最能從 memoization 中得益，並且在適當的地方增加 memoization。這些原則會讓你的 components 更容易偵錯和理解，因此在任何情況下都最好遵循它們。 長遠來說，我們正在研究 [把 memoization 自動化](https://www.youtube.com/watch?v=lGEMwh32soc) 以便於徹底的解決這個問題。

</DeepDive>

<Recipes titleText="使用 useCallback 和直接申報函數的區別" titleId="examples-rerendering">

#### 使用 `useCallback` and `memo` 來跳過重新 render {/*skipping-re-rendering-with-usecallback-and-memo*/}

在這裡例子裡，`ShippingForm` 這個 component 是 **被人為減慢了速度** 所以你可以看清楚當一個 rendering 的 React component 真正變慢會發生什麼情況。嘗試遞增計數器和切換主題。

遞增計數器感覺很慢是因為它強行把已變慢的 `ShippingForm` 重新render。這是意料之中的因為計數器已經改變了，而你要把用戶新的選擇反映到屏幕上。

接下來, 嘗試切換主題。 **把 `useCallback` 和 [`memo`](/reference/react/memo) 結合一起使用後, 儘管它被人為減慢了速度，它還是運行得很快** `ShippingForm` 跳過了重新的 rendering 因為 `handleSubmit` 這函數沒有被改變。 `handleSubmit` 這函數沒有被改變是因為 `productId` 和 `referrer` (你的 `useCallback` dependencies) 從上一次的 render之後就沒有被改變。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 想像這裡發送了一個請求
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500 毫秒內不執行任何操作來模擬極慢的程式碼
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### 經常重新 render 一個 component {/*always-re-rendering-a-component*/}

在這例子裡，`ShippingForm` 被 **被人為減慢了速度** 這樣你可以看到當你 render 的某些 React component 運行得很緩慢時會發生什麼情況。嘗試遞增計數器和切換主題。

和上面的例子不一樣，現在切換主題也變得很慢了! 這是因為 **在這個版本裡沒有使用 `useCallback`** 所以 `handleSubmit` 永遠都是一個新的function， 而且同樣慢下來的 `ShippingForm` component 也不能跳過重新 render。

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 想像這裡發送了一個請求
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[ARTIFICIALLY SLOW] Rendering <ShippingForm />');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // 500 毫秒內不執行任何操作來模擬極慢的程式碼
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Note: <code>ShippingForm</code> is artificially slowed down!</b></p>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


然而，這裡的程式碼是一樣的 **只是人為減慢速度的部分被移除了**。 此時缺少 `useCallback` 的感覺明不明顯？

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Dark mode
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // 想像這裡發送了一個請求
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('Rendering <ShippingForm />');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of items:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Street:
        <input name="street" />
      </label>
      <label>
        City:
        <input name="city" />
      </label>
      <label>
        Postal code:
        <input name="zipCode" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>


很多時候，就算程式碼沒有使用 memoization 也可以運行正常。如果你的互動已經足夠快的話，就不必使用 memoization 了。

注意如果你需要在生產模式下運行 React， 請避免使用 [React Developer Tools](/learn/react-developer-tools)，並且使用與你應用程式的用戶類似的設備以便真實地了解實際減慢了你應用程式的原因。

<Solution />

</Recipes>

---

### 從 memoized callback 中更新 state {/*updating-state-from-a-memoized-callback*/}

有時候，你需要根據從 memoized callback 中基於之前的 state 來更新 state。

這個 `handleAddTodo` 函數把 `todos` 指定為 dependency 因為它從中計算了下一個 todos：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

你通常會想把 memoized 函數的 dependencies 盡量減少。當你閱讀到某些 state 只是用來計算下一個 state，你可以傳入一個 [updater function](/reference/react/useState#updating-state-based-on-the-previous-state) 來把 dependency 移除掉：

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ No need for the todos dependency
  // ...
```

這裡，相比起把 `todos` 變成一個 dependency 並從內部讀取它，你可以傳入一個關於 *如何* 更新 state 的指令 (`todos => [...todos, newTodo]`) 給 React。 [閱讀更多有關於 updater functions 的內容](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### 防止頻繁觸發 Effect {/*preventing-an-effect-from-firing-too-often*/}

有時候，你可能會想從一個 [Effect](/learn/synchronizing-with-effects) 裡面呼叫一個函數。

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    // ...
```

這產生了一個問題。 [每一個 reactive 的值都必須申明為 Effect 的 dependency。](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) 但是，如果你申明 `createOptions` 作為一個 dependency，它會導致你的 Effect 不斷重新連線到聊天室：


```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 問題: 這個 dependency 會在每一次 render 中改變
  // ...
```

為了解決這個問題，你可以把你想從 Effect 呼叫的函數包裝到 `useCallback` 裡面：

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ 僅會在 roomId 改變時改變

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ 僅會在 createOptions 改變時改變
  // ...
```

這確保了如果 `roomId` 是一樣的話， `createOptions` 函數在每次重新 render 當中都會是一樣的。 **但是，更好的方法是移除對函數的 dependency 的需求** 將你的函數移入到 the Effect *裡面*：

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ 無需使用 useCallback 或函數的dependencies！
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 僅會在 roomId 改變時改變
  // ...
```

現在你的程式碼變得更簡單且不需要 `useCallback`。 [閱讀更多關於移除 Effect dependencies 的內容](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### 優化自定義的 Hook {/*optimizing-a-custom-hook*/}

假如你在編寫一個 [自定義的 Hook](/learn/reusing-logic-with-custom-hooks)，建議把任何 Hook 會返回的函數包裝在 `useCallback` 裡面：

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

這確保了你的 Hook 的使用者可以在需要的時候優化他們的程式碼。

---

## 疑難解答 {/*troubleshooting*/}

### 我的 component 每一次 render 時，`useCallback` 都返回了不一樣的函數 {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

請確保你已經將 dependency array 設定成第二個參數!

假如你忘記使用 dependency array， `useCallback` 會每一次都返回一個新的函數：

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 每一次都返回一個新函數：沒有 dependency array
  // ...
```

這是把 dependency array 設定成第二個參數的正確版本：

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ 如非必要不會返回一個新的函數
  // ...
```

假如這沒有幫助，那問題就是至少你有一個 dependency 是跟上一次 render 的時候不一樣。 你可以通過手動將你的 dependencies 記錄到控制台裡來偵錯這問題：

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

你也可以從控制台中右鍵單按來自不同重新 renders 的 arrays 並且為它們選擇 "儲存為全域變數"。假設第一個被儲存為`temp1` 然後第二個被儲存為 `temp2`，然後你可以使用 瀏覽器的控制台來檢查在兩個 array 裡面的每一個 dependency 是否相同：

```js
Object.is(temp1[0], temp2[0]); // Arrays 之間的第一個 dependency 是否相同?
Object.is(temp1[1], temp2[1]); // Arrays 之間的第二個 dependency 是否相同?
Object.is(temp1[2], temp2[2]); // ... 如此類推 ...
```

當你找到哪一個 dependency 破壞了 memoization, 請嘗試將其刪掉, 或者 [也同樣對其進行 memoize ](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### 我需要為循環中每一個清單裡的項目呼叫 `useCallback`，但這不被允許 {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

假如 `Chart` 的 component 是被包裝在 [`memo`](/reference/react/memo)裡面. 你會想在`ReportList` component 重新render時，跳過重新 render 每一個在清單裡的 `Chart`。 但是，你不能在一個循環中呼叫 `useCallback`：

```js {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 你不能在循環中呼叫 useCallback：
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

相反，從一個單獨的項目中提取一個 component，然後使用 `useCallback`：

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ 在最頂層使用useCallback
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

或者你可以在最後一段程式碼中移除 `useCallback`並把 `Report` 本身包裝到 [`memo`](/reference/react/memo) 中。如果 `item` prop 沒有改變，`Report` 會跳過重新 render，所以 `Chart` 也會一樣跳過重新 render：

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
