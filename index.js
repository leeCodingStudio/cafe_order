import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config/config.js';

import { sequelize } from './db/sequelize.js';
import orderRouter, { setWSS } from './router/order.js';
import boardRouter from './router/board.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
setWSS(wss);

app.use(cors({ origin: config.client }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => res.redirect('/order'));
app.use('/order', orderRouter);
app.use('/board', boardRouter);

app.use((req, res) => res.sendStatus(404));
app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});

wss.on('connection', (socket) => {
    console.log('📡 WebSocket 연결됨');
    socket.send(JSON.stringify({ type: 'welcome', message: '연결 완료!' }));
});

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log('✅ DB 연결 및 테이블 동기화 완료');
        server.listen(config.port, () => {
            console.log(`🚀 서버 실행 중: http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error('❌ DB 연결 실패:', error);
    }
}

startServer();
