const express = require('express');
const { Server } = require('ws');
const path = require('path');

// 1. 設定連接埠（Render 會注入 process.env.PORT，本地測試預設 3000）
const PORT = process.env.PORT || 3000;

// 2. 建立 Express 網頁伺服器，用來提供前端畫面
const app = express();

// 讓 Express 託管名為 public 的資料夾
app.use(express.static(path.join(__dirname, 'public')));

// 監聽 0.0.0.0 確保 Render 外部可以連線
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器正運行於連接埠 ${PORT}`);
});

// 3. 將 WebSocket 伺服器掛載到 HTTP 伺服器上
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('客戶端已連線');

  // 接收到客戶端訊息時的回應邏輯
  ws.on('message', (message) => {
    // 確保訊息轉為字串
    const msgString = message.toString();
    console.log(`收到訊息: ${msgString}`);
    
    // 回傳一樣的訊息給客戶端 (Echo)
    ws.send(`伺服器回應: ${msgString}`);
  });

  ws.on('close', () => {
    console.log('客戶端已斷開連線');
  });
});
