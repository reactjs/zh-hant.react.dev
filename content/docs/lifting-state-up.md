---
id: lifting-state-up
title: 提升 State
permalink: docs/lifting-state-up.html
prev: forms.html
next: composition-vs-inheritance.html
redirect_from:
  - "docs/flux-overview.html"
  - "docs/flux-todo-list.html"
---

通常來說，有一些 component 需要反映相同的資料變化。我們建議將共享的 state 提升到最靠近它們的共同 ancestor。讓我們來看這是如何運作的。

在這個章節，我們將建立一個溫度計算器來計算水是否會在給定的溫度下沸騰。

我們將會建立一個 component 叫做 `BoilingVerdict`。它接受 `celsius` 溫度作為一個 prop，並印出它是否足夠煮沸開水：

```js{3,5}
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

接下來，我們將會建立一個叫做 `Calculator` 的 component。它 render 一個 `<input>` 讓你輸入溫度，並且將它的值儲存在 `this.state.temperature`。

此外，它 render 目前輸入值在 `BoilingVerdict`。

```js{5,9,13,17-21}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />
        <BoilingVerdict
          celsius={parseFloat(temperature)} />
      </fieldset>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## 加入秒數輸入 {#adding-a-second-input}

這是我們的新需求，除了攝氏輸入，我們提供一個華氏輸入，它們彼此保持同步。

我們會從 `Calculartor` 抽離出一個 `TemperatureInput` component。我們將會加入一個新的 `scale` prop，它可以是「`c`」或「`f`」：

```js{1-4,19,22}
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

我們現在可以改變 `Calculator` 來 render 兩個獨立的溫度輸入：

```js{5,6}
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

現在我們有兩個輸入，但是當你輸入其中一個溫度輸入時，另外一個輸入並沒有更新。這和我們的需求產生了矛盾：我們希望它們可以保持同步。

我們也無法從 `Calculator` 顯示 `BoilingVerdict`。`Calculator` 並不知道目前的溫度，因為它被隱藏在 `TemperatureInput` 內。

## 撰寫轉換 Function {#writing-conversion-functions}

首先，我們將撰寫兩個 function 來轉換攝氏和華氏：

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

這兩個 function 轉換 number。我們將撰寫其他 function，它將 `temperature` string 和轉換 function 作為參數，並回傳 string。我們將使用它來計算基於另一個輸入的輸入值。

當 `temperatrue` 無效時，回傳一個空的 string，它的輸出會四捨五入到小數點後第三位：

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

例如，`tryConvert('abc', toCelsius)` 回傳一個空的 string，而 `tryConvert('10.22', toFahrenheit)` 回傳 `'50.396'`。

## Lifting State Up {#lifting-state-up}

目前兩個 `TemperatureInput` component 都有它們各自的 local state：

```js{5,9,13}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...
```

然而，我們想要這兩個輸入可以彼此同步。當我們更新攝氏輸入時，華氏輸入應該反映被轉換後的溫度，反之亦然。

在 React 中，共享 state 是透過將 state 搬移到需要它的 component 共同最近的 ancestor 來完成的。這被稱為「提升 state」。我們將從 `TemperatureInput` 移除 local state 並且搬移它到 `Calculator`。

如果 `Calculator` 擁有共享 state，它將成為目前兩個溫度輸入的「真相來源」。這可以說明它們兩者具有一致的值。由於這兩個 `TemperatureInput` component 的 prop 都是來自相同的 `Calculator` parent component，所以這兩個輸入會彼此同步。

讓我們來一步一步看它是如何執行的。

首先，我們將會把 `TemperatureInput` component 的 `this.state.temperature` 替換為 `this.props.temperature`。現在，讓我們假設 `this.props.temperature` 已經存在，雖然我們之後需要從 `Calculator` 傳遞它：

```js{3}
  render() {
    // 先前：const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

我們知道 [prop 是唯讀的](/docs/components-and-props.html#props-are-read-only)。當 `temperature` 在 local state 時，`TemperatureInput` 可以呼叫 `this.setState()` 來改變它。然而，現在 `temperature` prop 是來自它的 parent，`TemperatureInput` 無法控制它。

在 React 中，這通常透過讓 component「被控制」來解決。就像 DOM `<input>` 同時接受 `value` 和 `onChange` prop，所以可以自訂 `TemperatureInput` 同時接受來自 `Calculator` parent component 的 `temperature` 和 `onTemperatureChange` prop。

現在，當 `TemperatureInput` 想要更新溫度時，它呼叫 `this.props.onTemperatureChange`：

```js{3}
  handleChange(e) {
    // 先前：this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

>注意：
>
>Component 中自訂的 `temperature` 或 `onTemperatureChange` prop 名稱並沒有特殊含義。我們可以將它們命名為任何名稱，像是 `value` 和 `onChange`，這是常見的慣例。

`onTemperatureChange` prop 與 `temperature` prop 將會由 `Calculator` parent component 提供。它將透過修改本身的 local state 來處理更改，因此會重新 render 兩個輸入與新的值。我們將快速地看一下 `Calculator` 的實作。

在深入改變 `Calculator` 之前，讓我們回顧先前對 `TemperatureInput` 的修改。我們移除了它的 local state，並且不讀取 `this.state.temperature`，我們現在讀取 `this.props.temperature`。當我們想要改變時不呼叫 `this.setState()`，我們現在呼叫 `this.props.onTemperatureChange()`，它是由 `Calculator` 提供的：

```js{8,12}
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

現在讓我們轉回到 `Calculator` component。

我們將 store 目前輸入的 `temperature` 和 `scale` 在它的 local state。這是我們從輸入「提升」的 state，而且同時為輸入的「真相來源」。它是我們為了 render 兩個輸入而需要知道的最小表示資料。

例如，如果我們輸入 37 到攝氏輸入，`Calculator` component 的 state 將會是：

```js
{
  temperature: '37',
  scale: 'c'
}
```

如果我們之後更改華氏欄位為 212，`Calculator` component 的 state 將會是：

```js
{
  temperature: '212',
  scale: 'f'
}
```

我們可以 store 兩個輸入的值，但事實證明它是不需要的。它只要 store 最近修改的輸入值，以及溫度單位就夠了我們可以根據目前的 `temperature` 和 `scale` 來推斷其他輸入值。

輸入值會保持同步是因為它們的計算都是來自相同的 state：

```js{6,10,14,18-21,27-28,31-32,34}
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```

[**在 CodePen 上試試看吧！**](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)

現在，無論輸入如何改變，在 `Calculator` 的 `this.state.temperature` 和 `this.state.scale` 都會被更新。其中一個輸入保留任何使用者的輸入，並且總是根據使用者的輸入重新計算另一個輸入值。

讓我們回顧一下當你編輯輸入時會發生什麼事情：

* React 在 DOM `<input>` 上呼叫被指定為 `onChange` 的 function。在我們的範例中，這是在 `TemperatureInput` component 內的 `handleChange` 方法。
* 在 `TemperatureInput` component 的 `handleChange` 方法呼叫 `this.props.onTemperatureChange()` 與新的期望值。它的 prop 包含 `onTemperatureChange`，是由 `Calculator` parent component 所提供的。
* 當它被 render 之前，`Calculator` 指定攝氏 `TemperatureInput` 的 `onTemperatureChange` 是 `Calculator` 的 `handleCelsiusChange` 方法，而華氏溫度的 `TemperatureInput` 的 `onTemperatureChange` 方法是 `Calculator` 的 `handleFahrenheitChange` 方法。因此根據我們編輯的輸入呼叫這兩個 `Calculator` 方法中的其中一個。
* 在這些方法中，`Calculator` component 要求 React 根據我們編輯的新輸入值和目前的溫度單位的輸入呼叫 `this.setState()` 來重新 render 本身。
* React 呼叫 `Calculator` component 的 `render` 方法來了解 UI 應該是怎麼樣子。根據目前溫度和溫度單位重新計算兩個輸入的值。溫度轉換會在這裡執行。
* 透過 `Calculator` 指定新的 prop，React 呼叫各個 `TemperatureInput` component 的 `render` 方法，它們應該了解 UI 是什麼樣子。
* React 呼叫 `BoilingVerdict` component 的 `render` 方法，以攝氏溫度做為 prop。
* React DOM 使用沸騰判定更新 DOM 並匹配所需的輸入值。我們剛剛編輯的輸入它接收目前的值，而另一個輸入被更新成轉換後的溫度。

每次更新都會執行相同的步驟，保持輸入的同步。

## 經驗學習 {#lessons-learned}

在 React 應用程式中，對於資料的變化只能有一個唯一的「真相來源」。通常來說，state 會優先被加入到需要 render 的 component。接著，如果其他的 component 也需要的話，你可以提升 state 到共同最靠近的 ancestor。你應該依賴[上至下的資料流](/docs/state-and-lifecycle.html#the-data-flows-down)，而不是嘗試在不同 component 之間同步 state。

提升 state 涉及撰寫更多的「boilerplate」程式碼，而不是雙向綁定的方法，但它對於隔離和尋找 bug 時更加容易。由於任何 state「存活」在一些 component 中，而且 component 本身可以改變它，bug 的產生大幅的減少。此外，你也可以實作任何自訂的邏輯來拒絕或轉換使用者的輸入。

如果某樣東西可以從 prop 或 state 被取得，它可能不應該在 state。例如，我們只 store 最後編輯的 `temperature` 和它的 `scale`，而不是 store `celsiusValue` 和 `fahrenheitValue`。其他輸入的值總是可以從它們的 `render()` 方法被計算出來。這讓我們可以清除或將四捨五入應用於另一個欄位, 而不會在使用者輸入中失去任何精度。

當你在 UI 上看到一些錯誤時，你可以使用 [React Developer Tools](https://github.com/facebook/react-devtools) 來檢查 prop 並往 tree 的上方尋找，直到找到負責更新 state 的 component。這讓你可以追蹤到錯誤的來源：

<img src="../images/docs/react-devtools-state.gif" alt="Monitoring State in React DevTools" max-width="100%" height="100%">

