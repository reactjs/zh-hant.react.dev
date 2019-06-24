---
id: forms
title: 表單
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

HTML 表單的 element 和 React 中其他的 DOM element 不太一樣，因為表單的 element 很自然地有一些內部的 state。例如，這個表單在下面簡單的 HTML 中接受一個名稱：

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

當使用者提交表單時，此表單具有瀏覽到新頁面的預設 HTML 表單行為。如果你想要在 React 中也有這樣的行為的話，直接用 HTML 是可行的。但是在大多數的情況中，有一個 JavaScript function 來處理提交表單的功能並讀取使用者在表單中填入的資料是很方便的。要做到這樣，標準的方法是使用「controlled component」：

## Controlled Component {#controlled-components}

在 HTML 中，表單的 element 像是 `<input>`、`<textarea>` 和 `<select>` 通常會維持它們自身的 state，並根據使用者的輸入來更新 state。在 React 中，可變的 state 通常是被維持在 component 中的 state property，並只能以 [`setState()`](/docs/react-component.html#setstate) 來更新。

我們可以透過將 React 的 state 變成「唯一真相來源」來將這兩者結合。如此，render 表單的 React component 同時也掌握了後續使用者的輸入對表單帶來的改變。像這樣一個輸入表單的 element，被 React 用這樣的方式來控制它的值，就被稱為「controlled component」。

例如，如果我們想要讓上一個範例在一個名字被輸入表單時印出，我們可以把這個表單寫成一個 controlled component：

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

由於 `value` attribute 是被設定在我們的表單 element 上，顯示的 value 會永遠是 `this.state.value`，這使得 React 的 state 成為了資料來源。由於 `handleChange` 在每一次鍵盤被敲擊時都會被執行，並更新 React 的 state，因此被顯示的 value 將會在使用者打字的同時被更新。

在這樣的 controlled component 中，每一個 state 的 mutation 都會有一個相對應的 handler function。這使得修改或驗證使用者輸入變得很容易。例如，如果我們想要確認名字全部都是用大寫字母寫成的話，我們可以把 `handleChange` 寫成：

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## Textarea 標籤 {#the-textarea-tag}

在 HTML 中，一個 `<textarea>` 的 element 是經由它的 children 來定義它的文字：

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

在 React 中，一個 `<textarea>` 則是使用一個 `value` 的 attribute。如此一來，一個使用 `<textarea>` 的表格和一個只寫一行 input 的表格可以用非常類似的方法來寫成：

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

請注意 `this.state.value` 是在 constructor 內被初始化的，所以上述的 text area 一開始會有一些文字。

## Select 標籤 {#the-select-tag}

在 HTML 中，`<select>` 會建立一個下拉式選單。例如，這個 HTML 會建立一個有各種水果的下拉式選單：

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

請注意在這裡，椰子的選項是一開始就被選定的，因為它有一個 `selected` attribute。但是在 React 中並不是用 `selected` attribute，而是在 `select` 的標籤上用一個 `value` attribute。對一個 controlled component 來說這是比較方便的，因為你只需要在一個地方更新它。例如：


```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

整體來說，這使得 `<input type="text">`，`<textarea>` 和 `<select>` 使用起來都很類似。它們全都會接收一個你在實作一個 controlled component 時會使用到的 `value` attribute。

> 注意
>
> 你可以將一個 array 傳給 `value` 這個 attribute，這使得你可以在一個 `select` 中選取多個選項：
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## 檔案 input 標籤 {#the-file-input-tag}

在 HTML 中，`<input type="file">` 讓使用者從它們的儲存裝置中選擇一個至多個檔案，並把它們上傳到伺服器或透過 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) 被 JavaScript 處理。

```html
<input type="file" />
```

由於它的值是唯讀，它在 React 中是一個 **uncontrolled** component。[在稍後的文件中](/docs/uncontrolled-components.html#the-file-input-tag)有其他關於它和其他 uncontrolled component 的討論。

## 處理多個輸入 {#handling-multiple-inputs}

當你需要處理多個 controlled `input` element，你可以在每個 element 中加入一個 `name` attribute，並讓 handler function 選擇基於 `event.target.name` 的值該怎麼做：

例如：

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

注意我們使用了 ES6 的 [computed property name](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) 語法來更新與輸入中的 name 相對應的 state key：

```js{2}
this.setState({
  [name]: value
});
```

這和下面的 ES5 程式碼是ㄧ樣的：

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

此外，由於 `setState()` 自動 [merge 一部分的 state 和現在的 state](/docs/state-and-lifecycle.html#state-updates-are-merged)，我們只需要在有改變的地方呼叫它即可。

## Controlled 輸入值為 Null {#controlled-input-null-value}

在一個 [controlled component](/docs/forms.html#controlled-components) 上指明 value prop 可避免使用者改變輸入，除非你希望使用者這樣做。如果你已經指明了 `value` 但輸入仍然是可以被修改的，你很可能是不小心將 `value` 的值設定為 `undefined` 或 `null`。

下面的程式碼就是一個範例。（輸入原先是被鎖住的，但在短暫的延遲後，變得可以被修改了。）

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Controlled component 的替代方案 {#alternatives-to-controlled-components}

有時候使用 controlled component 是很乏味的，因為你需要為每一個資訊可以改變的方式寫一個 event handler，並將所有的輸入 state 透過一個 React component 來傳遞。這在你將一個舊的 codebase 改寫成 React 時或將一個 React 的應用程式與一個非 React 的函式庫整合時會變得特別麻煩。在這種情況中，你也許會想參考 [uncontrolled component](/docs/uncontrolled-components.html)，也就是另一種取代輸入表格的方式。

## 成熟的解決方案 {#fully-fledged-solutions}

如果你想找出一個完整的、包含驗證、可追蹤 visited field 並能處理提交表格等功能的解決方案，[Formik](https://jaredpalmer.com/formik) 是一個很熱門的選擇。然而，它是在與 controlled component 和維持 state 相同的原則上所建立的，所以別忘了學習它。
