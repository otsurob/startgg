### Startgg の予選トナメをまとめます

## 新規情報作成手順

- constans/playerList.ts の playerNames に名前のリストを追加（既存の団体ならスキップ）
- pages/dev.tsx の apiPlayers を変更
- 大会を指定して叩く関数を作成
- ローカルで起動して/dev でボタンをクリック　コンソールからオブジェクトをまるごとコピー
- コピーしたオブジェクトを consts/poolData.ts に追加
- pages/PoolPage.tsx の groupMap に追加
- 必要に応じて App.tsx に遷移ボタンを追加
