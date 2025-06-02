const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: "192.168.0.191",
  user: "3team",
  password: "3team",
  database: "3team",
  port: 3306,
  connectionLimit: 30,        // ✅ 최대 연결 수 늘리기 (기본: 10)
  acquireTimeout: 20000 
});

module.exports = pool;