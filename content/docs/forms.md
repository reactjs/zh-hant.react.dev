---
id: forms
title: 表格
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

HTML 表格的 element 和 React 中其他的 DOM element 不太一樣，因為表格的 element 很自然地有一些內部的 state。例如，下面的這個表格在純粹的 HTML 中接收單一的名稱：

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

這個表格有 HTML 表格的預設行為，也就是在使用者遞交一個表格的時候去瀏覽一個新頁面。如果你想要在 React 中也有這樣的行為的話，直接用 HTML 是可行的。但是在大多數的情況中，有一個 JavaScript function 來處理遞交表格的功能並讀取使用者在表格中填入的資料是很方便的。要做到這樣，標準的方法是使用「controlled component」：

## Controlled Component {#controlled-components}

在 HTML 中，表格的 element，像是 `<input>`、`<textarea>` 和 `<select>` 通常會維持他們自身的 state，並根據使用者的輸入來更新 state。在 React 中，可變的 state 通常是被維持在 component 中的 state property，並只能以 [`setState()`](/docs/react-component.html#setstate) 來更新。

我們可以透過將 React 的 state 變成「單一資料來源」（ single source of truth ）來將這兩者結合。如此，render 表格的 React component 同時也掌握了後續使用者的輸入對表格帶來的改變。像這樣一個輸入表單的 element，被 React 用這樣的方式來控制他的值，就被稱為「controlled component」。

例如，如果我們想要讓上一個例子在一個名字被輸入表格時印出，我們可以把這個表格寫成一個 controlled component：

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

既然 `value` attribute 被放在我們的 form element 裡面，被展示的 value 便永遠會是 `this.state.value`，這使得 React 的 state 成為了資料來源（the source of truth）。由於 `handleChange` 在每一次鍵盤被敲擊時都會被執行，並更新 React 的 state，因此被展示的 value 將會在使用者打字的同時被更新。

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

## The file input Tag {#the-file-input-tag}

In HTML, an `<input type="file">` lets the user choose one or more files from their device storage to be uploaded to a server or manipulated by JavaScript via the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Because its value is read-only, it is an **uncontrolled** component in React. It is discussed together with other uncontrolled components [later in the documentation](/docs/uncontrolled-components.html#the-file-input-tag).

## Handling Multiple Inputs {#handling-multiple-inputs}

When you need to handle multiple controlled `input` elements, you can add a `name` attribute to each element and let the handler function choose what to do based on the value of `event.target.name`.

For example:

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

Note how we used the ES6 [computed property name](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) syntax to update the state key corresponding to the given input name:

```js{2}
this.setState({
  [name]: value
});
```

It is equivalent to this ES5 code:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Also, since `setState()` automatically [merges a partial state into the current state](/docs/state-and-lifecycle.html#state-updates-are-merged), we only needed to call it with the changed parts.

## Controlled Input Null Value {#controlled-input-null-value}

Specifying the value prop on a [controlled component](/docs/forms.html#controlled-components) prevents the user from changing the input unless you desire so. If you've specified a `value` but the input is still editable, you may have accidentally set `value` to `undefined` or `null`.

The following code demonstrates this. (The input is locked at first but becomes editable after a short delay.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatives to Controlled Components {#alternatives-to-controlled-components}

It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component. This can become particularly annoying when you are converting a preexisting codebase to React, or integrating a React application with a non-React library. In these situations, you might want to check out [uncontrolled components](/docs/uncontrolled-components.html), an alternative technique for implementing input forms.

## Fully-Fledged Solutions {#fully-fledged-solutions}

If you're looking for a complete solution including validation, keeping track of the visited fields, and handling form submission, [Formik](https://jaredpalmer.com/formik) is one of the popular choices. However, it is built on the same principles of controlled components and managing state — so don't neglect to learn them.
