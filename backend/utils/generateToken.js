import jwt from "jsonwebtoken";

export const generateToken = (res, customerId) => {
  const secret = process.env.JWT_SECRET || "shopkart_super_secret_jwt_key_2026_very_secure";
  const token = jwt.sign({ id: customerId }, secret, {
    expiresIn: "7d",
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
