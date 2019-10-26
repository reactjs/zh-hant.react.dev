---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React 和 [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) 是為了解決不同的問題所建立的。Web Components 為了可重複使用的元件提供了強大的封裝，而 React 提供了一個宣告式函式庫，使 DOM 與你的資料保持同步。這兩個目標是相輔相成的。作為開發人員，你可以自由地在 Web Components 中使用 React，或在 React 中使用 Web Components，或兩者都是。

大部分使用 React 的人沒有使用 Web Components，但你可能會想要使用，尤其是你用到了使用 Web Components 所寫的第三方介面的元件。

## 在 React 裡使用 Web Components {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> 注意：
>
> Web Components 通常會公開命令式的 API。例如，一個 `video` Web Component 可能會公開 `play()` 和 `pause()` 函式。為了能夠使用 Web Component 的命令式 API，你會需要使用 ref 來跟 DOM 節點直接互動。如果你使用第三方的 Web Components，最好的解法是寫一個 React 元件來包住你的 Web Component。
>
> Web Component 所發出的事件可能不會被正確的傳遞到 React 的 render 樹。
> 你將會需要手動把event handlers 附上來處理在你的 React 元件裡的事件。

一個常見的困惑是 Web Components 使用 "class" 而不是 "className"。

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## 在你的 Web Components 裡使用 React  {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

>注意：
>
>如果你用 Babel 轉換了 classes，這段程式碼 **將不會** 正常運作。看[這個 issue](https://github.com/w3c/webcomponents/issues/587) 裡面的討論。
>在加載 web components 之前引入 [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs)來解決這個問題。
