import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: string,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);

  return token;
};

export const verifyToken = (token: string, secret: string) => {
  const verifyToken = jwt.verify(token, secret);

  return verifyToken;
};
