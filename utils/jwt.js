import jwt from 'jsonwebtoken';
import logger from './logger.js';
import { TokenError } from './error.js';

export const createAccessToken = (id) => {
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET is not defined');
    throw new TokenError('Missing JWT_SECRET');
  }
  if (!id || typeof id !== 'string') {
    logger.error('Invalid user ID for token generation', { id });
    throw new TokenError('Invalid user ID');
  }

  logger.debug('Creating access token', { userId: id });

  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30m' });
    logger.debug('Access token generated', { userId: id, token: token.substring(0, 20) + '...' });
    return token;
  } catch (err) {
    logger.error('JWT sign error', { error: err.message, stack: err.stack });
    throw new TokenError(`Failed to generate access token: ${err.message}`);
  }
};

export const createRefreshToken = (id) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    logger.error('JWT_REFRESH_SECRET is not defined');
    throw new TokenError('Missing JWT_REFRESH_SECRET');
  }
  if (!id || typeof id !== 'string') {
    logger.error('Invalid user ID for refresh token generation', { id });
    throw new TokenError('Invalid user ID');
  }

  logger.debug('Creating refresh token', { userId: id });

  try {
    const token = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    logger.debug('Refresh token generated', { userId: id, token: token.substring(0, 20) + '...' });
    return token;
  } catch (err) {
    logger.error('JWT sign error for refresh token', { error: err.message, stack: err.stack });
    throw new TokenError(`Failed to generate refresh token: ${err.message}`);
  }
};