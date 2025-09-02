export const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Para ver el stack trace en la consola

  const statusCode = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    status: 'error',
    message,
  });
};