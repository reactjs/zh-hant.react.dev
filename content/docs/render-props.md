---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

[「render prop」](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)這個詞指的是一種用一個其值為函式的 prop 來在 React component 之間共享程式碼的技巧。

一個有 render prop 的 component 會接受一個函式，此函式不會實作他自己的 render 邏輯，而是會回傳並且呼叫一個 React element。

```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

使用 render props 的函式庫包含 [React Router](https://reacttraining.com/react-router/web/api/Route/render-func)、[Downshift](https://github.com/paypal/downshift) 和 [Formik](https://github.com/jaredpalmer/formik)。

以下我們會討論為什麼 render props 如此有用，以及怎麼實作自己的 render props。

## 為橫切關注點使用 Render Props{#use-render-props-for-cross-cutting-concerns}

Component 是 React 中主要的程式碼重用單位，但如何將一個 component 所包含的 state 或行為共享給其他也同樣需要這些狀態或行為的 component 並不是那麼直觀。

例如，下面這個 component 負責在一個網頁應用中追蹤滑鼠游標的位置：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

當游標在螢幕中移動時，這個 component 會在一個 `<p>` 中顯示它的 (x,y) 座標。

現在問題來了：我們該如何在其他 component 中重用這個行為呢？換句話說，如果另一個 component 需要知道游標的位置，我們能不能將這個行為封裝起來，讓其他的 component 能輕鬆地共享呢？

既然 component 是 React 中程式碼基本重用單位，我們來試試看重構這段程式碼，改成用一個 `<Mouse>` component 來封裝這些需要在其他地方重用的行為。

```js
// <Mouse> component 封裝我們所需的行為...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ...但我們如何 render 除了 <p> 以外的東西？ */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </>
    );
  }
}
```

現在 `<Mouse>` component 封裝了全部跟監聽 `mousemove` 事件有關的行為，也儲存了游標的 (x,y) 位置，但它還不算真的可重用。

舉例來說，假設我們有一個 `<Cat>` component ，它會在螢幕中 render 追著滑鼠跑的貓咪圖片。我們可能會用一個 `<Cat mouse={{ x, y }}>` 的 prop 來告訴這個 component 滑鼠的座標，它便知道該把這張圖片放在螢幕中何處。

作為第一次嘗試，你可能會試著把 `<Cat>` 從 *`<Mouse>`的 `render` 方法裡面* render 出來，像這樣：

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          我們大可以在這裡把 <p> 換成 <Cat> ...但這樣我們就必須在每次用到它時，
          創建另外一個 <MouseWithSomethingElse> component，
          所以 <MouseWithCat> 的可重用性還不夠。
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

此方法在特定案例中可行，但我們還未能以可重用的方法把這個行為封裝起來。現在，每次在不同案例中，如果我們需要知道滑鼠位置，便必須另外創建一個特定為該案例 render 某些東西的 component （換句話說，就是另一個 `<MouseWithCat>` ）

這就是 render prop 發揮功用的地方了：我們提供  `<Mouse>` 一個 function prop --- render prop，讓它能夠動態決定該 render 什麼，而不是把 `<Cat>` 寫死在 `<Mouse>` component 裡。

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          用 `render` prop 去動態決定該 render 什麼，而不是將 <Mouse> render 的東西靜態表示出來。
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

現在，我們提供一個 `render` prop 給 `<Mouse>` ，讓它能夠動態決定它該 render 什麼，而不是為了一些特定案例，去複製 `<Mouse>` component 並在它的 `render` 方法中硬性寫入某些東西。

更具體地說，**render prop 是一個讓 component 知道該 render 什麼的 function prop。**


這個技巧讓我們想共享的行為變得極為可轉移。要使用這個行為時，就 render 一個有 `render` prop 的 `<Mouse>`，讓 `render` prop 來告訴 `<Mouse>` 該用現在游標的 (x,y) render 什麼。

關於 render props 一件有趣的事是，你可以用包含 render prop 的普通 component 來實作最  [higher-order component](/docs/higher-order-components.html)。舉例來說，如果你偏好用 `withMouse` HOC 而不是 `<Mouse>` component 的話，你可以輕易地用一個普通的 `<Mouse>` 加上 render prop 來建立：

```js
// 如果你真的想用 HOC ，你可以輕易地用一個
// 有 render prop 的普通 component 來建立！
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

因此 render prop 讓兩種模式皆可使用。

## 使用 Props 代替 `render` {#using-props-other-than-render}

記住，只因為這個模式稱為 「render props」，不代表*你一定要用一個名為 `render` 的 prop來使用這個模式*。事實上，[*任何*是函式且被 component 用來認知該 render 什麼的 prop，都叫做 「redner prop」](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)。

雖然上述範例使用 `render`，我們可以同樣輕易地使用 `children` prop！

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

記得，`children` prop 不需要在 JSX element 的屬性列表中註明。你可以直接把它放在 element *裡面*！

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

你會看到這個技巧在 [react-motion](https://github.com/chenglou/react-motion) API 中被使用。

因為這個技巧有一點不常見，在設計像這樣的 API 時，你可能會想在 `propTypes` 明確地把 `children` 定義為一個函式。

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## 警告 {#caveats}

### 注意當 Render Props 使用在 React.PureComponent 時{#be-careful-when-using-render-props-with-reactpurecomponent}

如果你在 `render` 方法中建立函式，使用 render prop 會讓 [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) 帶來的好處作廢。這是因為對新的 props 而言，prop 的淺比較會永遠回傳 `false`，並且每次 `render` 都會為 render prop 產生新的值。

例如，繼續我們上述的 `<Mouse>` component，如果 `Mouse` 繼承 `React.PureComponent` 而不是 `React.Component` 的話，我們的範例會像這樣：

```js
class Mouse extends React.PureComponent {
  // 如上述實作內容...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          這很不好！render prop 的值在每次 render 都會不一樣。
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

在這個範例中，每次 `<MouseTracker>` render 時，它會產生一個新的函式，作為 `<Mouse render>` prop 的值，便使一開始 `<Mouse>` 繼承 `React.PureComponent` 的效果作廢！

為了避開這個問題，你有時候可以把這個 prop 定義為一個 instance 方法，像是：

```js
class MouseTracker extends React.Component {
  // `this.renderTheCat` 被定義成一個 instance 方法
  // 當我們在 render 使用到時，會永遠指向*相同的*函式
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

在不能把 prop 定義成靜態的案例中（例：因為你需要封閉 component 的 props 和/或 state），`<Mouse>` 應改為繼承 `React.Component`。
