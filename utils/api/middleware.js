export const checkCookies = (req, res, next) => {
  const { 'peeps-auth': auth } = req.cookies;
  if (!auth) { return res.status(401).send("Authorization required") }
  next();
}
