import jwt from 'jsonwebtoken';

const key = process.env.TOKEN_KEY;

if (!key) throw new Error("TOKEN_KEY ins't specified");

export const createToken = (data: any, expiresIn = '2d') => {
  return jwt.sign(data, key, {
    expiresIn,
  });
};
