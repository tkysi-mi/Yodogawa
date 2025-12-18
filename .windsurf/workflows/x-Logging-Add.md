---
description: 構造化ログを実装し、本番環境での問題調査とモニタリングを効率化するワークフロー
auto_execution_mode: 1
---

# Logging-Add (x-Logging-Add)

## 目的

- アプリケーションに構造化ログを実装し、本番環境での問題調査を効率化する。
- ログレベル（DEBUG, INFO, WARN, ERROR）を適切に使い分ける。
- 機密情報（パスワード、トークン、個人情報）をログに出力しない。
- ログ集約サービス（CloudWatch, Datadog, Sentry）との統合を実現する。
- リクエスト ID によるトレーサビリティを確保する。

## 前提

- アプリケーションが動作している（Node.js, Python, Ruby など）。
- ログライブラリが利用可能（Winston, Pino, Python logging, など）。
- ログ出力先が決まっている（ファイル、標準出力、ログ集約サービス）。
- Git リポジトリが初期化されている。

## 手順

### 1. ログ戦略の決定

**ログフォーマットの選択**:

- **構造化ログ（JSON）**: 推奨。ログ集約サービスで検索・分析しやすい
- **テキストログ**: シンプルだが検索・分析が困難
- **ハイブリッド**: 開発環境では可読性優先、本番環境では JSON

**ログレベルの設計**:

- **ERROR**: エラー発生時（例外、失敗）
- **WARN**: 警告（非推奨 API 使用、リトライ）
- **INFO**: 重要なイベント（ユーザーログイン、支払い完了）
- **DEBUG**: デバッグ情報（SQL クエリ、API レスポンス）
- **TRACE**: 詳細なトレース（関数呼び出し）

**ログ出力先の決定**:

- **標準出力**: Docker/Kubernetes 環境推奨
- **ファイル**: ローテーション設定が必要
- **ログ集約サービス**: CloudWatch, Datadog, Sentry, Loggly

### 2. ログライブラリのインストール

**Node.js**:

```bash
# Winston (人気、多機能)
npm install winston

# Pino (高速、軽量)
npm install pino

# Morgan (Express 用 HTTP ログ)
npm install morgan
```

**Python**:

```bash
# 標準ライブラリの logging を使用
# または
pip install structlog  # 構造化ログ
pip install python-json-logger  # JSON フォーマット
```

**Ruby (Rails)**:

```bash
# 標準の Logger を使用
# または
gem install lograge  # Rails のログを構造化
```

### 3. ロガーの設定

#### 3.1. Node.js + Winston

**logger.ts**:

```typescript
import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.metadata(),
    isProduction
      ? winston.format.json()  // 本番: JSON
      : winston.format.combine(  // 開発: 可読性優先
          winston.format.colorize(),
          winston.format.printf(({ level, message, timestamp, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
          })
        )
  ),
  transports: [
    new winston.transports.Console(),
    // ファイル出力（オプション）
    ...(isProduction ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ] : []),
  ],
});

export default logger;
```

#### 3.2. Node.js + Pino

**logger.ts**:

```typescript
import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport: !isProduction ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  } : undefined,
});

export default logger;
```

#### 3.3. Python + structlog

**logger.py**:

```python
import structlog
import logging
import sys

def setup_logging():
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=logging.INFO,
    )

    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()  # JSON 出力
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

logger = structlog.get_logger()
```

### 4. リクエスト ID の追加

リクエスト ID を各ログエントリに追加することで、分散システムでのトレーサビリティを確保します。

#### 4.1. Web フレームワークのミドルウェア実装

**Express (Node.js) の例**:

**requestLogger.ts**:

```typescript
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  // リクエストログ
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });

  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
}
```

**app.ts**:

```typescript
import express from 'express';
import { requestLoggerMiddleware } from './middleware/requestLogger';

const app = express();

app.use(requestLoggerMiddleware);
```

#### 4.2. Django ミドルウェア

**middleware.py**:

```python
import uuid
import time
import structlog

logger = structlog.get_logger()

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = request.headers.get('X-Request-ID', str(uuid.uuid4()))
        request.request_id = request_id

        logger.info(
            "incoming_request",
            request_id=request_id,
            method=request.method,
            path=request.path,
            user_agent=request.META.get('HTTP_USER_AGENT'),
            ip=request.META.get('REMOTE_ADDR'),
        )

        start_time = time.time()
        response = self.get_response(request)
        duration = (time.time() - start_time) * 1000

        logger.info(
            "request_completed",
            request_id=request_id,
            method=request.method,
            path=request.path,
            status_code=response.status_code,
            duration_ms=round(duration, 2),
        )

        response['X-Request-ID'] = request_id
        return response
```

**settings.py**:

```python
MIDDLEWARE = [
    'myapp.middleware.RequestLoggingMiddleware',
    # ...
]
```

### 5. ログの追加

#### 5.1. エラーログ

**Node.js**:

```typescript
import logger from './logger';

try {
  // 処理
} catch (error) {
  logger.error('Failed to process payment', {
    error: error.message,
    stack: error.stack,
    userId: user.id,
    orderId: order.id,
  });
  throw error;
}
```

**Python**:

```python
from logger import logger

try:
    # 処理
except Exception as e:
    logger.error(
        "failed_to_process_payment",
        error=str(e),
        user_id=user.id,
        order_id=order.id,
        exc_info=True,  # スタックトレースを含める
    )
    raise
```

#### 5.2. 情報ログ

**Node.js**:

```typescript
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
  loginMethod: 'password',
});

logger.info('Payment completed', {
  orderId: order.id,
  amount: order.amount,
  currency: order.currency,
});
```

**Python**:

```python
logger.info(
    "user_logged_in",
    user_id=user.id,
    email=user.email,
    login_method="password",
)

logger.info(
    "payment_completed",
    order_id=order.id,
    amount=order.amount,
    currency=order.currency,
)
```

#### 5.3. デバッグログ

**Node.js**:

```typescript
logger.debug('Database query executed', {
  query: 'SELECT * FROM users WHERE id = ?',
  params: [userId],
  duration: '12ms',
});

logger.debug('API response', {
  endpoint: '/api/users',
  statusCode: 200,
  responseTime: '45ms',
});
```

### 6. 機密情報の除外

ログに機密情報が含まれないよう、適切なマスキング処理を実装します。

**除外すべき情報**:

- パスワード
- API キー / トークン
- クレジットカード番号
- 社会保障番号
- 個人情報（住所、電話番号）

**logger.ts（フィルター追加）**:

```typescript
import winston from 'winston';

const sensitiveKeys = ['password', 'token', 'apiKey', 'creditCard', 'ssn'];

const maskSensitiveData = winston.format((info) => {
  const maskValue = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    for (const key in obj) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        obj[key] = '***REDACTED***';
      } else if (typeof obj[key] === 'object') {
        maskValue(obj[key]);
      }
    }
    return obj;
  };

  return maskValue(info);
});

const logger = winston.createLogger({
  format: winston.format.combine(
    maskSensitiveData(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  // ...
});
```

**使用例**:

```typescript
logger.info('User registration', {
  email: 'user@example.com',
  password: 'secret123',  // ***REDACTED*** として出力される
});
```

### 7. ログローテーション

ログファイルが肥大化しないよう、ローテーション設定を行います。

**主要なログライブラリでのローテーション設定例**:

**Winston + daily-rotate-file (Node.js)**:

```bash
npm install winston-daily-rotate-file
```

```typescript
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',  // 14日間保持
    }),
  ],
});
```

**Linux logrotate** (`/etc/logrotate.d/myapp`):

```
/var/log/myapp/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
}
```

### 8. ログ集約サービスとの統合

本番環境では、ログ集約サービスを使用して複数サーバーのログを一元管理します。

**主要なログ集約サービス**: AWS CloudWatch, Datadog, Sentry, Loggly, Splunk

#### 8.1. AWS CloudWatch との統合

**Node.js**:

```bash
npm install winston-cloudwatch
```

```typescript
import CloudWatchTransport from 'winston-cloudwatch';

const logger = winston.createLogger({
  transports: [
    new CloudWatchTransport({
      logGroupName: '/aws/lambda/my-app',
      logStreamName: () => {
        const date = new Date().toISOString().split('T')[0];
        return `${date}-${process.env.NODE_ENV}`;
      },
      awsRegion: 'us-east-1',
    }),
  ],
});
```

#### 8.2. Datadog

**Node.js**:

```bash
npm install dd-trace
```

```typescript
import tracer from 'dd-trace';
tracer.init({
  logInjection: true,  // ログに trace ID を自動追加
});

import logger from './logger';

logger.info('User action', {
  userId: user.id,
  action: 'purchase',
});
```

#### 8.3. Sentry（エラートラッキング）

**Node.js**:

```bash
npm install @sentry/node
```

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// エラーを Sentry に送信
try {
  // 処理
} catch (error) {
  Sentry.captureException(error);
  logger.error('Error occurred', { error: error.message });
  throw error;
}
```

### 9. パフォーマンスメトリクスの追加

パフォーマンス分析のため、実行時間やレスポンスタイムをログに記録します。

**汎用的な実装パターン（関数実行時間の記録）**:

**TypeScript/JavaScript の例**:

```typescript
import logger from './logger';

function withTiming<T>(fn: () => T, operationName: string): T {
  const start = Date.now();
  try {
    const result = fn();
    const duration = Date.now() - start;
    logger.debug('Operation completed', {
      operation: operationName,
      duration: `${duration}ms`,
      status: 'success',
    });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('Operation failed', {
      operation: operationName,
      duration: `${duration}ms`,
      status: 'error',
      error: error.message,
    });
    throw error;
  }
}

// 使用例
const users = withTiming(() => {
  return db.query('SELECT * FROM users');
}, 'database.query.users');
```

### 10. ログの動作確認

**ローカル環境でのログ確認方法**:

```bash
# ファイル出力の場合
tail -f logs/combined.log

# Docker の場合
docker logs -f <container_name>

# JSON ログを見やすく表示
tail -f logs/combined.log | jq .
```

**確認すべき項目**:

- ログレベルが適切に設定されているか
- リクエスト ID が各ログエントリに含まれているか
- 機密情報が適切にマスキングされているか
- JSON 形式が正しいか（本番環境の場合）
- タイムスタンプが正しく記録されているか

### 11. テストの実行

既存のテストスイートを実行し、ログ機能が既存の機能に影響を与えていないことを確認します。

```bash
# 例: npm/yarn/pnpm
npm test

# 例: pytest
pytest

# 例: Rails
bundle exec rspec
```

### 12. Git コミット

```bash
git add src/utils/logger.ts
git add src/middleware/requestLogger.ts
git add src/

git commit -m "feat: add structured logging with Winston

- Add Winston logger with JSON format for production
- Add request logging middleware with request ID
- Mask sensitive data (password, token, apiKey)
- Add log rotation with daily-rotate-file
- Integrate with CloudWatch for centralized logging
- Add performance metrics logging

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 完了条件

- ログライブラリがインストールされている
- ロガーが設定され、構造化ログが出力される
- リクエスト ID が追加され、トレーサビリティが確保されている
- 機密情報がマスキングされている
- ログレベル（ERROR, WARN, INFO, DEBUG）が適切に使い分けられている
- ログローテーションが設定されている（必要に応じて）
- ログ集約サービスとの統合が完了している（必要に応じて）
- すべてのテストが通る
- ログが期待通りに出力される

## エスカレーション

- **ログが出力されない**:
  - 「ログが出力されません。以下を確認してください：」
    - ログレベルが適切か（DEBUG ログが INFO レベルで実行されていないか）
    - ロガーが正しくインポートされているか
    - 環境変数 `LOG_LEVEL` が設定されているか
    - ファイル出力の場合、ディレクトリのアクセス権限

- **機密情報が漏洩している**:
  - 「ログに機密情報が含まれています。以下を実施してください：」
    - マスキングフィルターを追加
    - 機密情報のキーワードリストを更新
    - 既存ログを削除またはローテーション
    - セキュリティチームに報告

- **ログが多すぎる / パフォーマンス影響**:
  - 「ログ出力がパフォーマンスに影響しています。以下を検討してください：」
    - ログレベルを INFO 以上に制限
    - 非同期ログライブラリを使用（Pino など）
    - サンプリング（1% のリクエストのみログ）
    - 不要なログを削除

- **ログ集約サービスのコストが高い**:
  - 「ログ集約サービスのコストが高騰しています。以下を検討してください：」
    - ログレベルの見直し
    - ログのサンプリング
    - 保持期間の短縮
    - ログ圧縮の有効化

## ベストプラクティス

- **構造化ログ（JSON）を使用**: 検索・分析が容易
- **リクエスト ID を追加**: トレーサビリティの確保
- **ログレベルを適切に使い分け**: ERROR は即座に対応、INFO は重要なイベントのみ
- **機密情報を絶対に出力しない**: GDPR / PCI-DSS 違反に注意
- **環境による出力形式の切り替え**: 開発環境では可読性優先、本番環境では JSON
- **エラーにはスタックトレースを含める**: 問題調査の効率化
- **ログローテーションを設定**: ディスク容量の枯渇を防ぐ
- **ログ集約サービスの活用**: 分散システムでのログ統合
- **パフォーマンスメトリクスを追加**: レスポンスタイム、DB クエリ時間
- **ログレベルを環境変数で制御**: 本番環境で動的に変更可能に
