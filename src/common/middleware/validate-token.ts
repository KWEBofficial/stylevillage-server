import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const validateToken: RequestHandler = (req, res, next) => {
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    const token = req.headers.authorization;
    if (!token) return next();

    req.user = jwt.verify(
      token.substring(7),
      process.env.JWT_SECRET_KEY as string,
    );
    return next();
  } catch (error) {
    // 인증 실패
    console.log(error);
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};

export default validateToken;
