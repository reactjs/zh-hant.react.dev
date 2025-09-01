---
title: 安裝
---

<Intro>

React 從一開始就被設計成可以逐步採用。你可以根據自己的需要使用更多或更少的 React。不論你想要嘗試 React、在 HTML 頁面中增加一些互動功能，或是開始一個複雜的 React 應用程式，本章節將幫助你入門。

</Intro>

<<<<<<< HEAD
<YouWillLearn isChapter={true}>

* [如何開始一個新的 React 專案](/learn/start-a-new-react-project)
* [如何將 React 加入到一個現有的專案](/learn/add-react-to-an-existing-project)
* [如何設定編輯器](/learn/editor-setup)
* [如何安裝 React 開發者工具](/learn/react-developer-tools)

</YouWillLearn>

## 嘗試 React {/*try-react*/}
=======
## Try React {/*try-react*/}
>>>>>>> 2774ddfa0c39b8c2f0563b987dcb90a01ee723cf

你不需要安裝任何東西來嘗試 React。試試看編輯這個 sandbox！

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

你可以直接編輯它，或按右上角的「Fork」按鈕在新的頁面中打開它。

React 文件中的大多數頁面都包含像這樣的 sandbox 範例。在 React 文件之外，有許多支援 React 的線上 sandbox，例如  [CodeSandbox](https://codesandbox.io/s/new)、[StackBlitz](https://stackblitz.com/fork/react) 或 [CodePen](https://codepen.io/pen?template=QWYVwWN)。

<<<<<<< HEAD
### 在本機端嘗試 React {/*try-react-locally*/}

在你的電腦本機端嘗試 React，[下載這個 HTML 頁面。](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) 在你的編輯器和瀏覽器打開它！

## 開始一個新的 React 專案 {/*start-a-new-react-project*/}

如果你想要完全使用 React 建立一個應用程式或是網站，[開始一個新的 React 專案。](/learn/start-a-new-react-project)
=======
To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!

## Creating a React App {/*creating-a-react-app*/}

If you want to start a new React app, you can [create a React app](/learn/creating-a-react-app) using a recommended framework.

## Build a React App from Scratch {/*build-a-react-app-from-scratch*/}

If a framework is not a good fit for your project, you prefer to build your own framework, or you just want to learn the basics of a React app you can [build a React app from scratch](/learn/build-a-react-app-from-scratch).
>>>>>>> 2774ddfa0c39b8c2f0563b987dcb90a01ee723cf

## 將 React 加入到一個現有的專案 {/*add-react-to-an-existing-project*/}

<<<<<<< HEAD
如果你想要在你現有的應用程式或網站嘗試使用 React，[將 React 加入到一個現有的專案。](/learn/add-react-to-an-existing-project)
=======
If want to try using React in your existing app or a website, you can [add React to an existing project.](/learn/add-react-to-an-existing-project)


<Note>

#### Should I use Create React App? {/*should-i-use-create-react-app*/}

No. Create React App has been deprecated. For more information, see [Sunsetting Create React App](/blog/2025/02/14/sunsetting-create-react-app).

</Note>
>>>>>>> 2774ddfa0c39b8c2f0563b987dcb90a01ee723cf

## 下一步 {/*next-steps*/}

前往[快速入門](/learn)指南，了解你每天會遇到的 React 重要概念。
