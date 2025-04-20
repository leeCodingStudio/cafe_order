import express from 'express';
import Order from '../model/order.js';

let wss = null;
export function setWSS(server) {
    wss = server;
}

const router = express.Router();

router.get('/', (req, res) => {
    res.render('order');
});

router.post('/', async (req, res) => {
    const { menuList } = req.body;

    if (!Array.isArray(menuList) || menuList.length === 0) {
        return res.status(400).json({ error: '메뉴 목록이 비어있음' });
    }

    try {
        const newOrder = await Order.create({ menuList });

        if (wss) {
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'newOrder', data: newOrder }));
                }
            });
        }

        res.status(201).json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
});

router.patch('/:id/done', async (req, res) => {
    const id = req.params.id;

    try {
        const order = await Order.findByPk(id);
        if (!order) return res.status(404).json({ error: '주문 없음' });

        order.status = 'done';
        await order.save();

        if (wss) {
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        type: 'orderCompleted',
                        data: { id }
                    }));
                }
            });
        }

        res.status(200).json({ message: '완료 처리됨' });
    } catch (err) {
        console.error(err);
        res.status(500).send('서버 오류');
    }
});

export default router;
