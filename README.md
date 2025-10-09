## 開発者向け

### 大会情報取得

コンソールで以下コマンドを実行

```
npm run fetch:pools -- <大会slug>
```

Event not found のエラーが出たら少し時間を空けて再実行

### 新規団体登録

players 配下に json ファイルを作成。groupName に表示したい団体名を、names にプレイヤーネームの一覧を記述。完全一致で情報を取得するので名前の表記漏れに注意。

### 隠し団体

App.tsx の hiddenPlayers に選択肢に表示したくない団体の json ファイル名を記述。これでホーム画面の players に表示されなくなる。この団体の情報を見るには url の `players= `に json ファイル名を入力すれば見れる
