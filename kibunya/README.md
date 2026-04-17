# キブンヤ (KIBUNYA)

ちょい飲み気分通知アプリ。
友達がいきますかーしてるかもしれない。誘ってないから大丈夫。気分を置いておくだけ。

## 📱 なにができる？
- 🍺 「いきますかー」ボタンで友達全員に気分通知
- 🔔 友達からの気分アラート受信+「かー」リアクション
- 👥 招待リンクで友達追加
- 🔐 Apple / メールでログイン

## 🏗️ 技術スタック
- **フレームワーク**: Expo (React Native) + TypeScript
- **バックエンド**: Firebase (Auth / Firestore)
- **通知**: Expo Push Notifications
- **認証**: Apple Sign-In / Email

## 📂 ファイル構成

```
kibunya/
├─ App.tsx                  … エントリーポイント
├─ app.json                 … Expo 設定
├─ eas.json                 … EAS Build 設定
├─ package.json             … 依存関係
├─ tsconfig.json
├─ babel.config.js
├─ firestore.rules          … Firestore セキュリティルール
├─ firestore.indexes.json
├─ firebase.json
├─ .gitignore
├─ assets/                  … アイコン・スプラッシュ (要追加)
└─ src/
   ├─ config/
   │  ├─ firebase.ts        … Firebase 初期化
   │  └─ colors.ts          … カラーパレット
   ├─ hooks/
   │  ├─ useAuth.ts         … 認証状態+サインイン
   │  ├─ useFriends.ts      … 友達一覧+追加
   │  └─ useNotifications.ts… 通知購読+リアクション
   ├─ utils/
   │  ├─ pushNotifications.ts … Expo Push + FCMトークン登録
   │  └─ inviteLink.ts      … 招待ディープリンク
   ├─ components/
   │  ├─ SendOverlay.tsx    … 送信完了モーダル
   │  ├─ NotificationCard.tsx … 通知カード
   │  └─ FriendPill.tsx     … 友達ステータスピル
   └─ screens/
      ├─ OnboardingScreen.tsx
      ├─ HomeScreen.tsx
      ├─ NotificationsScreen.tsx
      └─ FriendsScreen.tsx
```

---

## 🚀 セットアップ手順

### 0. 前提
- PC (Mac推奨) or Codespaces / クラウドシェル環境
- Node.js 18以上
- iPhone (実機テスト用)

> ⚠️ iPhone のみでのセットアップは `npm install` が重いため現実的でない。
> カネさんは **GitHub Codespaces** か **Replit** のようなクラウドIDEを使うことを推奨。

### 1. リポジトリをクローン
```bash
git clone <kibunyaリポジトリURL>
cd kibunya
```

### 2. 依存関係をインストール
```bash
npm install
npm install -g eas-cli firebase-tools
```

### 3. Firebase プロジェクト作成
```bash
firebase login
firebase projects:create kibunya-app --display-name "KIBUNYA"
firebase use kibunya-app
firebase init firestore   # firestore.rules を指定
firebase deploy --only firestore:rules
```

### 4. Firebase iOS / Android アプリ登録
Firebase Console → プロジェクト設定 → アプリを追加
- iOS: bundleId = `com.kibunya.app`
- Android: package = `com.kibunya.app`

取得した config を `.env` に書き込む:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=xxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=kibunya-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=kibunya-app
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=kibunya-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
EXPO_PUBLIC_FIREBASE_APP_ID=xxx
```

### 5. Firebase Console で手動設定
- **Authentication** → Sign-in method
  - ✅ Apple を有効化
  - ✅ Email/Password を有効化
- **Cloud Messaging** (iOS用APNsキーをアップロード)
  - Apple Developer → Keys → APNs Authentication Key作成 (.p8)
  - Firebase Console → Project Settings → Cloud Messaging → iOS APNs → アップロード

### 6. アセット追加
`assets/` に以下を配置:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024) …Android用

### 7. EAS Build 初期化
```bash
eas login
eas build:configure
```
→ `app.json` の `extra.eas.projectId` が自動で書き換わる。

### 8. 開発起動
```bash
npx expo start
```
iPhoneに **Expo Go** アプリを入れて QR コードをスキャン。

---

## 🏗️ ビルドコマンド

```bash
# テストビルド(iOS, TestFlight配布前の内部テスト)
eas build --platform ios --profile preview

# 本番ビルド(iOS)
eas build --platform ios --profile production

# App Store申請
eas submit --platform ios
```

---

## 🧍 人間がやること

| 項目 | 備考 |
|---|---|
| Apple Developer Program 登録 ($99/年) | https://developer.apple.com/programs/enroll/ |
| Firebase Console で Apple/Email 認証を有効化 | 上記STEP5 |
| Cloud Messaging 用 APNs キーアップロード | 上記STEP5 |
| アセット画像を `assets/` に置く | 上記STEP6 |
| `.env` に Firebase config を記入 | 上記STEP4 |

---

## 🗄️ Firestoreデータ構造

```
users/{userId}
  name: string
  email: string
  fcmToken: string
  lastSeen: timestamp
  createdAt: timestamp

friends/{userId}/friendsList/{friendId}
  addedAt: timestamp

notifications/{notificationId}
  senderId: string
  senderName: string
  receiverId: string
  type: "kibun" | "reaction"
  createdAt: timestamp
  isRead: boolean
  reactedBy: string | null
```

---

## 🎨 カラーパレット
- `#FFF9EC` 生成(なるみ) … 背景
- `#F5C518` 山吹(やまぶき) … アクセント
- `#E8391F` 朱(しゅ) … CTA
- `#1B3A6B` 藍(あい) … 見出し

---

## 📝 今後の展開
- Android リリース
- カスタム気分メッセージ
- グループ機能(家族グループ等)
- 位置情報ベースの近距離通知
