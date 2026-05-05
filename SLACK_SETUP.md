# Slack App セットアップ手順（30秒）

## 1. https://api.slack.com/apps を開く

すでにログイン済みなので即「Your Apps」が見える。

## 2. 「Create New App」ボタンをクリック

## 3. 「From an app manifest」を選択

（「From scratch」じゃない方）

## 4. workspace を選択

mint で使う workspace（既存の `komugi` でOK）→ Next

## 5. YAML タブで下記を全選択して貼り付け

`~/Projects/mint-agent/config/slack-manifest.yaml` の内容：

```yaml
display_information:
  name: Mint Agent
  description: Slack で @AI に話しかけて業務代行 - 議事録・メール・データ集計を自動化
  background_color: "#0d0d0d"
features:
  bot_user:
    display_name: Mint
    always_online: true
oauth_config:
  redirect_urls:
    - https://agent.komugi-ai.jp/api/slack/callback
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - channels:read
      - chat:write
      - groups:history
      - groups:read
      - im:history
      - im:read
      - im:write
      - users:read
settings:
  event_subscriptions:
    request_url: https://agent.komugi-ai.jp/api/slack/events
    bot_events:
      - app_mention
      - message.im
  interactivity:
    is_enabled: false
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

## 6. Next → Create クリック

OAuth scope / redirect URL / events URL が**全て自動設定**される。

## 7. 「Install to Workspace」 → Allow

Bot Token を取得（後で Vercel env で使う）。

## 8. 取得して俺に教えてほしい3つの値

App の左サイドバーから：

### Basic Information ページ：
- **App ID**（`AXXXXXXXX` 形式）
- **Client ID**（`XXX.XXX` 形式）
- **Client Secret**（`Show` クリックして表示）
- **Signing Secret**（`Show` クリックして表示、これが超重要）

### OAuth & Permissions ページ：
- **Bot User OAuth Token**（`xoxb-XXX` 形式）

## 9. 値をテキストで俺に渡す

下記フォーマットで貼り付けてくれれば即 Vercel env 反映する：

```
SLACK_APP_ID=A...
SLACK_CLIENT_ID=...
SLACK_CLIENT_SECRET=...
SLACK_SIGNING_SECRET=...
SLACK_BOT_TOKEN=xoxb-...
```

完了！その後の動作確認は俺がやる。
