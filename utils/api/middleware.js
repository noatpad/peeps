export const checkCookies = (req, res, next) => {
  const { token, secret } = req.cookies;
  if (!token || !secret) {
    return res.status(401).send("Authorization required");
  }
  next();
}
