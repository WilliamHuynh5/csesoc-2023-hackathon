import jwt, { JwtPayload } from 'jsonwebtoken';
import { TOKEN_SECRET } from '../../shared/constants';
import createHttpError from 'http-errors';
import expressAsyncHandler from 'express-async-handler';
import { NextFunction, Request, Response } from 'express';
import { getUserById } from '../controllers/auth';
import { getData } from './data';

const authorisation = () => expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token as string;
  if (token === undefined) {
    throw new createHttpError.Unauthorized('Token not found in headers!');
  }
  jwt.verify(token, TOKEN_SECRET, async (err, payload) => {
    try {
      if (err) {
        throw new createHttpError.Unauthorized(`Invalid token provided: '${err.message}'. Please log back in!`);
      }
      const { userId, sessionId } = (payload as JwtPayload);
      if (!getData().sessions.has(sessionId)) {
        throw new createHttpError.Unauthorized('Token does not refer to a valid session');
      }
      res.locals.user = getUserById(userId);
      res.locals.sessionId = sessionId;
      next();
    } catch (err) {
      next(err);
    }
  });
});

export default authorisation;
