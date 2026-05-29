---
title: useId
---

<Intro>

`useId` 是一個 React Hook，用於產生可傳遞給無障礙屬性（accessibility attributes）的唯一 ID。

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## 參考 {/*reference*/}

### `useId()` {/*useid*/}

在元件的最上層呼叫 `useId`，以產生唯一 ID：

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[參考下方更多範例。](#usage)

#### 參數 {/*parameters*/}

`useId` 不接受任何參數。

#### 回傳值 {/*returns*/}

`useId` 回傳一個唯一的 ID 字串，與這個元件中此特定的 `useId` 呼叫相關聯。

#### 注意事項 {/*caveats*/}

* `useId` 是一個 Hook，所以你只能在**元件的最上層**或你自己的 Hook 中呼叫它。你不能在迴圈或條件式中呼叫它。如果有這個需求，請抽離出一個新的元件，並將 state 移到其中。

* `useId` **不應該被用來產生列表中的 key**。[key 應該根據你的資料來產生。](/learn/rendering-lists#where-to-get-your-key)

* `useId` 目前無法在 [async 的 Server Component](/reference/rsc/server-components#async-components-with-server-components) 中使用。

---

## 用法 {/*usage*/}

<Pitfall>

**不要呼叫 `useId` 來產生列表中的 key。** [key 應該根據你的資料來產生。](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### 為無障礙屬性產生唯一 ID {/*generating-unique-ids-for-accessibility-attributes*/}

在元件的最上層呼叫 `useId`，以產生唯一 ID：

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

接著你可以將<CodeStep step={1}>產生的 ID</CodeStep>傳遞給不同的屬性：

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**讓我們透過一個範例來了解這在什麼時候有用。**

[HTML 無障礙屬性](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)，例如 [`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby)，讓你能指定兩個標籤彼此相關。舉例來說，你可以指定某個元素（像是 input）由另一個元素（像是段落）來描述。

在一般的 HTML 中，你會這樣寫：

```html {5,8}
<label>
  Password:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  The password should contain at least 18 characters
</p>
```

然而，像這樣把 ID 寫死在 React 中並不是好的做法。一個元件在頁面上可能會被渲染不只一次——但 ID 必須是唯一的！與其把 ID 寫死，不如使用 `useId` 來產生唯一 ID：

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}
```

如此一來，即使 `PasswordField` 在畫面上出現多次，產生的 ID 也不會互相衝突。

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

[觀看這部影片](https://www.youtube.com/watch?v=0dNzNcuEuOo)，了解使用輔助技術時使用者體驗的差異。

<Pitfall>

使用 [server 渲染](/reference/react-dom/server)時，**`useId` 要求 server 與 client 上的元件樹完全相同**。如果你在 server 與 client 上渲染的樹不完全相符，產生的 ID 也不會相符。

</Pitfall>

<DeepDive>

#### 為什麼 useId 比遞增的計數器更好？ {/*why-is-useid-better-than-an-incrementing-counter*/}

你可能會好奇，為什麼 `useId` 比遞增一個全域變數（像是 `nextId++`）更好。

`useId` 主要的好處在於 React 確保它能與 [server 渲染](/reference/react-dom/server)一起運作。在 server 渲染期間，你的元件會產生 HTML 輸出。之後在 client 端，[hydration](/reference/react-dom/client/hydrateRoot) 會將你的事件處理函式附加到產生的 HTML 上。為了讓 hydration 正常運作，client 的輸出必須與 server 的 HTML 相符。

要用遞增的計數器來保證這一點非常困難，因為 Client Component 被 hydrate 的順序，可能與 server HTML 輸出的順序不一致。透過呼叫 `useId`，你可以確保 hydration 正常運作，並讓 server 與 client 之間的輸出相符。

在 React 內部，`useId` 是根據呼叫它的元件的「父層路徑（parent path）」產生的。這就是為什麼，只要 client 與 server 的樹相同，無論渲染順序為何，「父層路徑」都會吻合。

</DeepDive>

---

### 為多個相關的元素產生 ID {/*generating-ids-for-several-related-elements*/}

如果你需要為多個相關的元素賦予 ID，可以呼叫 `useId` 來為它們產生一個共用的前綴：

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

這讓你不必為每一個需要唯一 ID 的元素都各自呼叫一次 `useId`。

---

### 為所有產生的 ID 指定共用前綴 {/*specifying-a-shared-prefix-for-all-generated-ids*/}

如果你在單一頁面上渲染多個獨立的 React 應用程式，請將 `identifierPrefix` 作為選項傳遞給你的 [`createRoot`](/reference/react-dom/client/createRoot#parameters) 或 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 呼叫。這能確保兩個不同應用程式所產生的 ID 永遠不會衝突，因為每個使用 `useId` 產生的識別碼，都會以你指定的、彼此不同的前綴開頭。

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Password:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
    </>
  );
}
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

---

### 在 client 與 server 上使用相同的 ID 前綴 {/*using-the-same-id-prefix-on-the-client-and-the-server*/}

如果你[在同一個頁面上渲染多個獨立的 React 應用程式](#specifying-a-shared-prefix-for-all-generated-ids)，而其中某些應用程式是 server 渲染的，請確保你在 client 端傳遞給 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) 呼叫的 `identifierPrefix`，與你傳遞給 [server API](/reference/react-dom/server)（例如 [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream)）的 `identifierPrefix` 相同。

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```

如果你的頁面上只有一個 React 應用程式，則不需要傳遞 `identifierPrefix`。
