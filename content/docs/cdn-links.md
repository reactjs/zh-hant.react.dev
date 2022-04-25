---
id: cdn-links
title: CDN 連結
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

通過 CDN 載入 React 和 React DOM。

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

以上的版本只適用於開發環境，並不適合用於線上環境。你可以在以下找到已壓縮和最佳化的 React 線上版本：

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
請更改版本號碼 `17` 來載入指定版本的 `react` 和 `react-dom`。
=======
To load a specific version of `react` and `react-dom`, replace `18` with the version number.
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892

### 為什麼要使用 `crossorigin` Attribute? {#why-the-crossorigin-attribute}

如果你通過 CDN 載入 React，我們建議你保留 [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) 的設定：

```html
<script crossorigin src="..."></script>
```

我們也建議你驗證你所使用的 CDN 是否設定了 `Access-Control-Allow-Origin: *` HTTP header：

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

這能為 React 16 或以上的版本帶來更好的[錯誤處理體驗](/blog/2017/07/26/error-handling-in-react-16.html)。
