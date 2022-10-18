const verifyToken = (request, response, next) => {
  // ambil token
  const token = request.header("Authorization").replace("Bearer ", "");
  if (!token) {
    response.status(403).send({
      message: "No token provided!",
    });
  }
  // verifikasi token
  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return response.status(401).send({
        status: "error",
        message: error.message,
      });
    }
    request.userId = decoded.id;
    request.tokenExp = decoded.exp;
    request.token = token;
    next();
  });
};
