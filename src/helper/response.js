module.exports = {
  success: (res, status, result) => {
    const results = {
      status,
      meta: result.meta || null,
      msg: result.msg,
      data: result.data || null,
    };
    res.status(status).json(results);
  },
  error: (res, status, error) => {
    res
      .status(status)
      .json({ status, msg: error.msg, data: error.data || null });
  },
};
