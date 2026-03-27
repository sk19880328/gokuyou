# 御供養 プロジェクトメモ

## 基本情報
- 運営者：カネ（匿名・会社バレNG）
- GitHub：gokuyou-official/gokuyou
- 公開URL：https://gokuyou-official.github.io/gokuyou/
- Twitter：@gokuyou_bot
- GA：G-8990S70XB8

## 完了済み（2026-03-08）
- [x] GitHub リポジトリ作成（gokuyou-official/gokuyou）
- [x] GitHub Pages 自動デプロイ設定（pushで自動反映）
- [x] OGP設定（両ページ）
- [x] Google Analytics設置（G-8990S70XB8）
- [x] sitemap.xml作成
- [x] レスポンシブ対応（PC：左サイドバー＋右コンテンツ、SP：現状維持）
- [x] チャコール（#3d3d3d）差し色導入
- [x] Twitter・LINEシェアボタン追加（全金言カード）
- [x] ジャンル表記統一（Entertainment/Creative/Sports/Study/Business/Others）
- [x] メンバーバッジ統一（挑戦中・諦めた・探し中）
- [x] 最新記事セクション追加（index.html）
- [x] gokuyou_kingen.htmlの読みやすさ改善

## 次にやること（優先度順）
1. 投稿一覧ページ作成（Googleスプレッドシート連携）
2. 第二回インタビューページ追加（インタビュー確定後）
3. カレンダー投稿機能
4. コメント投稿機能
5. OGP画像（サムネイル）追加
6. 「相方からAIに変えてみた」シリーズ（フェーズ3以降）

## 自律的に進めてよいこと
- 上記機能追加の実装
- デザイン改善
- コンテンツページの新規作成

## 技術スタック
- フロントエンド：HTML/CSS/JS（フレームワークなし）
- ホスティング：GitHub Pages
- デプロイ：GitHub Actions（.github/workflows/deploy.yml）
- データ収集：Googleフォーム → スプレッドシート
- 分析：Google Analytics 4

## ファイル構成
- index.html：トップページ
- gokuyou_kingen.html：敗北者の金言ページ
- sitemap.xml
- .github/workflows/deploy.yml：自動デプロイ設定
- tweets/content.json：X自動投稿コンテンツ（A/Bテスト対応）
- scripts/post_tweet.py：X自動投稿スクリプト
- .github/workflows/twitter_bot.yml：X自動投稿ワークフロー（JST 9時/21時）

## スキル定義

### x-article
X（旧Twitter）の長文記事を執筆するスキル。

文体ルール：
- 一人称は「僕」
- 敬体ベース、感情が乗る箇所は常体を混ぜる
- 1文は60文字以内
- 改行を多用し、スマホでの視認性を最優先
- 「正直に言うと」「ぶっちゃけ」等の口語を戦略的に配置
- 専門用語には（）で補足説明

構成ルール：
- 冒頭3行で「読まないと損」を確信させるフック
- 各章にコピペ可能なプロンプト例を最低1つ
- 各章に筆者の体験談を含める
- 章末に簡潔なまとめ

禁止事項：
- 太字マークダウン記法の使用
- 「いかがでしたか？」等のテンプレ表現
- 根拠のない数字の捏造

### x-short-post
X（旧Twitter）の短文投稿を作成するスキル。

文体ルール：
- 一人称は使わないか「俺」
- 常体（だ・である）ベース
- 140文字以内を目安
- 1ツイートで完結する

構成パターン（ローテーション）：
- A. 人からもらった一言＋前フリ＋属性（営業会社エリアマネージャー 30代男性 等）
- B. 有名人の夢を諦めた話への引用RT＋一言
- C. サイトリンク付きコンセプト紹介

トーンルール：
- ポエム禁止、情報商材っぽさ禁止
- ユーモアを入れる。部下の返しがオチになるパターン推奨
- 「クスッ」と笑えるのが理想
- 共感 > 感動

禁止事項：
- 「夢を諦めた経験は消えない」系の臭いフレーズ
- ハッシュタグ3個以上
- 毎回サイトリンクを入れない（3回に1回程度）
