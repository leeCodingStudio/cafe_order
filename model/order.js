import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js';

const Order = sequelize.define('Order', {
    menuList: {
        type: DataTypes.JSON,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending',
    }
}, {
    timestamps: true
});

export default Order;
