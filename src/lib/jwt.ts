import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
export const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
export interface JwtPayload {
  userId: string;
  sessionId: string;
}

export const createJwt = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyJwt = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
