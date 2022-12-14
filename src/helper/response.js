module.exports = {
  success: (res, status, result) => {
    const results = {
      status,
      meta: result.meta || null,
      msg: result.message,
      data: result.data || null,
    };
    res.status(status).json(results);
  },
  error: (res, status, error) => {
    res.status(status).json({
      status: status || 500,
      msg: error.message,
      data: error.data || null,
      err: error.err,
    });
  },
};
