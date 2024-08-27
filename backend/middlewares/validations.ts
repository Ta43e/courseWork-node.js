import { body, ValidationChain } from 'express-validator';
import { RequestHandler } from 'express';

const registerValidation: ValidationChain[] = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be at least 3 characters long').isLength({ min: 3 }),
    body('firstName', 'First name must be at least 3 characters long').isLength({ min: 3 }),
    body('lastName', 'Last name must be at least 3 characters long').isLength({ min: 3 }),
];

const updateUserValidation: ValidationChain[] = [
    body('firstName', 'First name must be at least 3 characters long').isLength({ min: 3 }),
];

const loginValidation: ValidationChain[] = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Password must be at least 3 characters long').isLength({ min: 3 }),
];

const postCreateValidation: ValidationChain[]= [
    body('title', 'Minimum title length is 3 characters').isLength({ min: 3 }).isString(),
    body('description', 'Minimum text length is 10 characters').isLength({ min: 10 }).isString(),
];

export {
    registerValidation,
    loginValidation,
    postCreateValidation,
    updateUserValidation
}
