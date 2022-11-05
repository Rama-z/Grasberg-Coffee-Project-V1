const sendResponse = require("../helper/response");

module.exports = (...allowedRole) => {
  return (req, res, next) => {
    const payload = req.userPayload;
    let isAllowed = false;
    for (let role of allowedRole) {
      if (role !== payload.role) continue;
      isAllowed = true;
      break;
    }
    if (!isAllowed) {
      return sendResponse.error(res, 403, {
        msg: "Forbidden",
        error: "You don't have the right to do that",
      });
    }
    next();
  };
};
