import { NextFunction, Request, Response } from 'express';

const routeNotFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(400).json({
    success: false,
    message: 'API not found !!',
    err: '',
  });
};

export default routeNotFound;
