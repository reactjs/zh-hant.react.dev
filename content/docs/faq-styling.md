---
id: faq-styling
title: Styling and CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### 如何在 Component 中加入 CSS Class？ {#how-do-i-add-css-classes-to-components}

傳遞一個 string 作為 `className` 的 prop：

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

通常 CSS class 會依賴 component 的 prop 或 state：

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>小技巧
>  
>如果你發現你常寫類似的程式碼，可使用 [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) 函式庫簡化。

### 可以使用 Inline Style 嗎？ {#can-i-use-inline-styles}

可以，請見[此處](/docs/dom-elements.html#style) 文件關於 styling 部分。

### Inline Style 不好嗎？ {#are-inline-styles-bad}

CSS class 通常比 inline style 效能更好。

### CSS-in-JS 是什麼？ {#what-is-css-in-js}

「CSS-in-JS」指的是使用 JavaScript 組成 CSS 而非將其定義於外部檔案的一種模式。

_請注意此功能為第三方函式庫所提供，並非 React 的一部份。_ React 對 style 是如何定義並無意見。若有疑問，照常地將你的 style 定義於另一個 `*.css` 檔案中然後使用 [`className`](/docs/dom-elements.html#classname) 去引用會是個好的開始。

### 我可以在 React 中做動畫嗎？ {#can-i-do-animations-in-react}

React 可以支援動畫。範例請見 [React Transition Group](https://reactcommunity.org/react-transition-group/) 和 [React Motion](https://github.com/chenglou/react-motion) 或 [React Spring](https://github.com/react-spring/react-spring)。
