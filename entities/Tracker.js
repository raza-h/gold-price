import { sqliteDb } from '../config/index.js';

class Tracker {
    async getNotifiedGoldRate() {
        return new Promise((resolve, reject) => {
            sqliteDb.get(
                `SELECT PRICE
               FROM gold_prices
               ORDER BY CREATED_AT DESC
               LIMIT 1`,
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(null);
                    resolve(row?.price);
                }
            );
        });
    }

    async setNotifiedGoldRate(rate) {
        return new Promise((resolve, reject) => {
            sqliteDb.run(
                `INSERT INTO gold_prices (PRICE, CREATED_AT)
               VALUES (?, datetime('now'))`,
                [rate],
                function (err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    };
};

export default Tracker;
