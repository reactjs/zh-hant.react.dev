---
title: React 開發者工具
---

<Intro>

使用 React 開發者工具檢查 React [component](/learn/your-first-component)、編輯 [props](/learn/passing-props-to-a-component) 和 [state](/learn/state-a-components-memory)，並辨認效能問題。

</Intro>

<YouWillLearn>

* 如何安裝 React 開發者工具

</YouWillLearn>

## 瀏覽器擴充元件 {/*browser-extension*/}

要除錯用 React 建構的網站最簡單的方式是安裝 React 開發者瀏覽器擴充元件。它可以在一些流行的瀏覽器上使用：

* [Install for **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Install for **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Install for **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

現在，如果你拜訪**用 React 建構**的網站，你將會看到 _Components_ 和 _Profiler_ 控制面板。

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari 和其他瀏覽器 {/*safari-and-other-browsers*/}
對於其他的瀏覽器（例如，Safari），安裝 [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package：
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

接著從 terminal 打開開發者工具：
```bash
react-devtools
```

然後透過在你的網站 `<head>` 的起始加入以下 `<script>` tag 來連接你的網站：
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

重新載入網頁現在你可以看到開發者工具。

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

<<<<<<< HEAD
## 行動裝置（React Native） {/*mobile-react-native*/}
React 開發者工具也可以用來檢測由 [React Native](https://reactnative.dev/) 建構的應用程式。

使用 React 開發者工具最簡單的方式就是全域安裝它：
```bash
# Yarn
yarn global add react-devtools
=======
## Mobile (React Native) {/*mobile-react-native*/}

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/debugging/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

<<<<<<< HEAD
接著從 terminal 打開開發者工具：
```bash
react-devtools
```

它應該連接到你任何在本機端執行的 React Native 應用程式。

> 如果在幾秒鐘內沒有連接上開發者工具，請嘗試重新載入應用程式。

[學習更多關於除錯 React Native 的方式。](https://reactnative.dev/docs/debugging)
=======
> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682
