---
id: hooks-rules
title: Hook 規則
permalink: docs/hooks-rules.html
next: hooks-custom.html
prev: hooks-effect.html
---

*Hook* 是 React 16.8 新加入的功能，它們讓你可以不用寫 class 就能使用 state 與其他 React 的功能。

Hook 是 JavaScript function，但你在使用他們時需要遵守兩個規則。 我們提供了一個 [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) 來自動化地實行這些規則：

### 只在最上層呼叫 Hook {#only-call-hooks-at-the-top-level}

**別在 loop、condition 或是 nested function 裡呼叫 Hook。** 反而總是將 Hook 用在你 React function 的最上層。藉由遵循這規則，你可以確保當每次一個 component render 時 Hook 都依照正確的順序被呼叫。正是這個使得 React 有辦法在多個 `useState` 和 `useEffect` 呼叫間，正確地保存 Hook 的 state。 (如果你感到好奇，我們將深入地在[下方](#explanation)解釋它。)

### 只在 React Function 中呼叫 Hook {#only-call-hooks-from-react-functions}

**別在一般的 JavaScript function 中呼叫 Hook。** 反而，你可以：

* ✅ 在 React function component 中呼叫 Hook。
* ✅ 在自定義的 Hook 中呼叫 Hook。 (我們將會[在下一頁](/docs/hooks-custom.html)瞭解它們)。

藉由遵循這規則，你確保了在 component 中所有 stateful 的邏輯在其 source code 中可以清楚地被看見。

## ESLint Plugin {#eslint-plugin}

我們釋出了一個 ESLint plugin 叫做 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 來強制施行這兩個規則。 如果你想嘗試的話，可以將這個 plugin 加到你的專案中: 

```bash
npm install eslint-plugin-react-hooks --save-dev
```

```js
// 你的 ESLint 配置
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // 檢查 Hook 的規則
    "react-hooks/exhaustive-deps": "warn" // 檢查 effect 的相依性
  }
}
```

在未來，我們打算在 Create React App 和相關的 toolkit 中將這個套件設為預設。

**你現在可以先跳過，下一頁將解釋如何撰寫[你自己的 Hooks](/docs/hooks-custom.html)。** 在這頁，我們將會繼續解釋這些規則背後的原因。

## 解說 {#explanation}

如我們 [先前學到的](/docs/hooks-state.html#tip-using-multiple-state-variables)， 我們可以在單一的 component 中使用多個 State 或 Effect Hook：

```js
function Form() {
  // 1. 使用 name state 變數
  const [name, setName] = useState('Mary');

  // 2. 使用一個 effect 來保存表單
  useEffect(function persistForm() {
    localStorage.setItem('formData', name);
  });

  // 3. 使用 surname state 變數
  const [surname, setSurname] = useState('Poppins');

  // 4. 使用一個 effect 來更新 title
  useEffect(function updateTitle() {
    document.title = name + ' ' + surname;
  });

  // ...
}
```

所以 React 是如何知道哪個 state 要對應到哪個 `useState` 的呼叫？ 答案是 **React 仰賴於 Hook 被呼叫的順序**. 我們的範例能運作是因為在每一次的 render 中 Hook 都是依照一樣的順序被呼叫：

```js
// ------------
// 第一次 render
// ------------
useState('Mary')           // 1. 用 'Mary' 來初始化 name state 變數 
useEffect(persistForm)     // 2. 增加一個 effect 來保存表單
useState('Poppins')        // 3. 用 'Poppins' 來初始化 surname state 變數
useEffect(updateTitle)     // 4. 增加一個 effect 來更新 title

// -------------
// 第二次 render
// -------------
useState('Mary')           // 1. 讀取 name state 變數 (參數被忽略了)
useEffect(persistForm)     // 2. 替換了用來保存表單的 effect
useState('Poppins')        // 3. 讀取 surname state 變數 (參數被忽略了)
useEffect(updateTitle)     // 4. 替換了用來更新 title 的 effect

// ...
```

只要 Hook 在 render 間被呼叫的順序是一致的，React 可以將一些 local state 和它們一一聯繫在一起。但如果我們把一個 Hook 呼叫  (例如， `persistForm` effect) 放在 condition 中會發生什麼事呢？

```js
  // 🔴 我們違反了第一個規則，在 condition 中使用 Hook
  if (name !== '') {
    useEffect(function persistForm() {
      localStorage.setItem('formData', name);
    });
  }
```

這個 `name !== ''` condition 在初次 render 時為 `true` ， 所以我們運行了此 Hook。 然而，在下一次 render 時使用者可能清除了表單，使得 condition 變為 `false`。 而現在我們在 render 期間跳過了這一個 Hook ， Hook 的呼叫順序有所不同：

```js
useState('Mary')           // 1. 讀取 name state 變數 (參數被忽略了)
// useEffect(persistForm)  // 🔴 這個 Hook 被跳過了！
useState('Poppins')        // 🔴 2 (但之前是 3). 未能讀取 surname state 變數
useEffect(updateTitle)     // 🔴 3 (但之前是 4). 未能取代 effect
```

React 不會知道第二個 `useState` Hook 呼叫要 return 什麼。 React 預期在這個 conponent 中的第二個 Hook 呼叫和 `persistForm` effect 是相對應的，就如同在前一次的 render 一樣，但它不再一樣了。 從那時起，在我們跳過的那個 Hook 後面，每下一個 Hook 呼叫都會 shift 一個，導致 bug 的發生。

**這就是為何必須在我們的 component 之上層來呼叫 Hook。** 如果我們想要有條件地運行 effect ，我們可以把那個 condition 放在我們的 Hook *裡*：

```js
  useEffect(function persistForm() {
    // 👍 我們不再違反第一個規則
    if (name !== '') {
      localStorage.setItem('formData', name);
    }
  });
```

**注意你不需要擔心這個問題，如果你使用[提供的 lint 規則](https://www.npmjs.com/package/eslint-plugin-react-hooks)。** 但現在你也瞭解了*為何* Hook 是這樣運作的，和這些用來避免而制定的規則。

## 下一步 {#next-steps}

最後, 我們準備好學習 [撰寫你自己的 Hook](/docs/hooks-custom.html)! 自定義的 Hook 讓你能結合由 React 提供的 Hook 到你自己的 abstraction 中， 且在不同的 component 間重複使用相同的 stateful 邏輯。
