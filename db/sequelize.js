import { config } from '../config/config.js';
import SQ from 'sequelize';
import mysql from 'mysql2/promise';

// DB 자동 생성
const { host, user, password, database, port } = config.db;

const ensureDatabaseExists = async () => {
    const connection = await mysql.createConnection({ host, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
};

await ensureDatabaseExists();

export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
    logging: false,
    timezone: 'Asia/Seoul',
});
