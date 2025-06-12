const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: "192.168.0.191",
  user: "3team",
  password: "3team",
  database: "3team",
  port: 3306,
  connectionLimit: 10,        // ✅ 최대 연결 수 늘리기 (기본: 10)
  acquireTimeout: 20000 
});

//DB 연결확인 
/*
async function testConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log("MariaDB 연결 성공!");
    } catch (err) {
        console.error("MariaDB 연결 실패:", err);
    } finally {
        if (conn) conn.release(); // 커넥션을 풀에 반납
    }
}

testConnection();
*/
module.exports = pool;