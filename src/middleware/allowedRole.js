module.exports = (...allowedRole) => {
  return (req, res, next) => {
    const payload = req.userPayload;
    let isAllowed = false;
    for (let role of allowedRole) {
      if (role !== payload.role) continue;
      isAllowed = true;
      break;
    }
    if (!isAllowed)
      return res.status(403).json({ msg: "Forbidden", data: null });
    next();
  };
};
