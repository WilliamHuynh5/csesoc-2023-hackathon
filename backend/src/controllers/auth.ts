import { randomUUID } from 'crypto';
import { TOKEN_SECRET } from '../../shared/constants';
import jwt from 'jsonwebtoken';
import { getData, saveData } from '../app/data';
import createHttpError from 'http-errors';
import validator from 'validator';
import { User } from '../../shared/types';

const generateToken = (userId: string, sessionId: string) => jwt.sign({ userId, sessionId }, TOKEN_SECRET);

const getUserByEmailNoError = (email: string) => {
  for (const user in getData().users) {
    if (getData().users[user].email === email) {
      return getData().users[user];
    }
  }
};

const getUserByEmail = (email: string) => {
  const user = getUserByEmailNoError(email);
  if (user === undefined) {
    throw new createHttpError.BadRequest(`No such user with email ${email}`);
  }
  return user;
};

export const getUserById = (userId: string) => {
  const user = getData().users[userId];
  if (user === undefined) {
    throw new createHttpError.BadRequest(`No such user with userId ${userId}`);
  }
  return user;
};

export const register = (email: string, password: string) => {
  const userId = randomUUID();
  const sessionId = randomUUID();
  const token = generateToken(userId, sessionId);
  if (!validator.isEmail(email)) {
    throw new createHttpError.BadRequest(`Email ${email} is not accepted`);
  }
  if (!password) {
    throw new createHttpError.BadRequest('Password is empty');
  }
  if (getUserByEmailNoError(email)) {
    throw new createHttpError.BadRequest(`A user with email ${email} already exists`);
  }
  getData().users[userId] = { userId, email, password, itineraryIds: new Set() };
  getData().sessions.add(sessionId);
  saveData();
  return { token, userId };
};

export const login = (email: string, password: string) => {
  const user = getUserByEmail(email);
  if (user.password !== password) {
    throw new createHttpError.BadRequest(`Incorrect details for ${email}`);
  }
  const sessionId = randomUUID();
  const token = generateToken(user.userId, sessionId);
  getData().sessions.add(sessionId);
  saveData();
  return { token, userId: user.userId };
};

export const logout = (sessionId: string) => {
  getData().sessions.delete(sessionId);
  saveData();
  return {};
};

export const profile = (user: User, userToViewId: string) => {
  const { password, ...details } = getUserById(userToViewId);
  return details;
};
