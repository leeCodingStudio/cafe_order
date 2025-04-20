import express from 'express';
import Order from '../model/order.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const orders = await Order.findAll({
        where: { status: 'pending' },
        order: [['createdAt', 'DESC']]
    });
    res.render('board', { orders });
});

export default router;
