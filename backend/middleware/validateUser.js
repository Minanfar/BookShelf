import { body } from 'express-validator';

export const validateUser= [
  body('email')
    .isEmail()
    .withMessage('Invalid email address.')
    .isLength({ min: 10, max: 40 })
    .withMessage('Email should be between 10 and 40 characters.')
    .trim(),

  body('password')
    .isLength({ min: 4 })
    .withMessage('Password should have at least 4 characters.')
    .trim(),
];
