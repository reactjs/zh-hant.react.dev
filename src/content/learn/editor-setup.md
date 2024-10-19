---
title: 編輯器設定
---

<Intro>

一個正確設定的編輯器可以使程式碼讀起來更清晰，寫起來更快。它甚至可以幫助你在撰寫的過程中抓出 bug！如果這是你第一次設定一個編輯器，或者你想調整你目前的編輯器，我們有幾個建議。

</Intro>

<YouWillLearn>

* 最受歡迎的編輯器是誰
* 如何自動格式化你的程式碼

</YouWillLearn>

## 你的編輯器 {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) 是現在最受歡迎的編輯器之一。它有一個龐大的擴充功能市集，並與 GitHub 等流行服務很好的整合。下面列出的大多數功能也可以作為擴充功能加入到 VS Code 中，使其具有高度的可性！

其他在 React 社群使用的流行文字編輯器包括：

* [WebStorm](https://www.jetbrains.com/webstorm/) 是一個專門為 JavaScript 設計的完整開發環境。
* [Sublime Text](https://www.sublimetext.com/) 支援 JSX 和 TypeScript，內建 [syntax highlighting](https://stackoverflow.com/a/70960574/458193) 和 autocomplete。
* [Vim](https://www.vim.org/) 是一個高度可配置的文字編輯器，可以非常有效的建立和修改任何類型的文本。它作為「vi」被內建在大多數 UNIX 系統和 Apple OS X 系統中。

## 推薦的文字編輯器功能 {/*recommended-text-editor-features*/}

一些編輯器內建了這些功能，但其他編輯器可能需要增加一個擴充功能。檢查一下你所選擇的編輯器提供了哪些支援！

### Linting {/*linting*/}

Code linter 可以在你撰寫程式碼的時候發現問題，幫助你儘早解決這些問題。[ESLint](https://eslint.org/)是一個流行的、開放原始碼的 JavaScript 的 linter。

* [用 React 推薦的設定安裝 ESLint](https://www.npmjs.com/package/eslint-config-react-app)（請確認你[安裝了 Node！](https://nodejs.org/en/download/current/)）
* [在 VSCode 中用官方擴充功能整合 ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**確認你有在你的專案內啟動所有 [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) 規則。**它們是不可少的，可以及早發現嚴重的錯誤。推薦的 [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) preset 已經包含了它們。

### 格式化 {/*formatting*/}

當你與另一個貢獻者分享你的程式時，你最不想做的事情就是陷入關於 [tabs 與 spaces](https://www.google.com/search?q=tabs+vs+spaces) 的討論中！幸運的是，[Prettier](https://prettier.io/) 將通過重新格式化來清理你的程式碼，使其符合預設的、可配置的規則。執行 Prettier，你所有的 tab 將被轉換為 space 以及你的縮排、引號等也將全部被改變，以符合設定。在理想的設定中，Prettier 將在你儲存文件時執行，快速的為你進行這些編輯。

你可以透過以下幾個步驟安裝[在 VSCode 內安裝 Prettier 擴充套件](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)：

1. 啟動 VS Code
2. 使用快速開啟（按下 `CTRL/Cmd + P`）
3. 貼上 `ext install esbenp.prettier-vscode`
4. 按下 enter

#### 儲存時格式化 {/*formatting-on-save*/}

理想情況下，你應該在每次儲存時對你的程式碼進行格式化。 在 VS Code 可以設定！

1. 在 VS Code 內，按下 `CTRL/CMD + SHIFT + P`。
2. 輸入「settings」
3. 按下 enter
4. 在搜尋欄中，輸入「format on save」
5. 確認「format on save」選項是打勾的！

> 如果你的 ESLint 預設有格式規則，它們可能與 Prettier 衝突。我們建議使用 [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) 禁用 ESLint 預設中的所有格式規則，以便 ESLint *僅*用於捕獲邏輯錯誤。如果你想強制在 pull request 被合併之前，對程式碼進行格式化，在你的 continuous integration 中使用 [`prettier --check`](https://prettier.io/docs/en/cli.html#--check)。
