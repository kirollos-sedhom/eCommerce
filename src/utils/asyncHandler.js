export const asyncHandler = (controller) => {
  return (req, res, next) => {
    controller(req, res, next).catch((error) => next(error)); // the next() will send it to our global error handler (in the app.router.js)
  };
};
