//DB 패스워드 암호화 모듈
//1회성, cmd창에서 해당 파일 폴더 경로에서 node encrypt-existing-passwords.js 실행

const pool = require('../db.js'); // db 연결 모듈
const bcrypt = require('bcryptjs');

(async () => {
  const conn = await pool.getConnection();

  try {
    const users = await conn.query('SELECT user_id, user_password FROM user');

    for (const user of users) {
      const { user_id, user_password } = user;

      // 이미 암호화된 비밀번호는 건너뛴다 (bcrypt 해시의 특징인 $2a$로 시작)
      if (user_password.startsWith('$2a$') || user_password.startsWith('$2b$')) {
        console.log(`✅ [${user_id}] 이미 암호화됨`);
        continue;
      }

      const hashed = await bcrypt.hash(user_password, 10);

      await conn.query(
        'UPDATE user SET user_password = ? WHERE user_id = ?',
        [hashed, user_id]
      );

      console.log(`🔐 [${user_id}] 암호화 완료`);
    }

    console.log('✅ 모든 사용자 비밀번호 암호화 완료');
  } catch (err) {
    console.error('❌ 비밀번호 암호화 실패:', err);
  } finally {
    conn.release();
  }
})();