/**
 * This small middleware will check if the user performing certain actions is the user him self
 * for exemple you cannot change another user is password
 */

module.exports = (req, res, next) => {
  try {
    const userId = req.params.id;
    const userTokenId = res.body.tokenData.id;
    if (userId === userTokenId) {
      next();
    } else {
      return res.status(403).json({
        valid: false,
        message: "This action can be applied only for your account",
      });
    }
  } catch (err) {
    res.status(403).json({
      valid: false,
      message: "Action error",
    });
  }
};
