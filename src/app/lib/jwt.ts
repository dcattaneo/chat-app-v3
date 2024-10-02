import jwt from "jsonwebtoken";

export function createAccessToken(payload: object): Promise<string> {
  return new Promise((resolve, reject) => {
    const secretKey = process.env.PRIVATE_KEY;

    if (!secretKey) {
      return reject(new Error("JWT secret key is missing"));
    }
    jwt.sign(payload, secretKey, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      if (token) resolve(token);
    });
  });
}
