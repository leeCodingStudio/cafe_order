import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    if (value == null) {
        throw new Error(`key ${key} is undefined`);
    }
    return value;
}

export const config = {
    base: required('BASE_URL'),
    client: required('CLIENT_URL'),
    port: parseInt(required('PORT', 3000)),
    db: {
        host: required('DB_HOST'),
        port: parseInt(required('DB_PORT', 3306)),
        user: required('DB_USER'),
        password: required('DB_PASSWORD'),
        database: required('DB_DATABASE'),
    },
};
