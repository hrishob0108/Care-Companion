const { body } = require('express-validator');

const signupValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 2 })
        .withMessage('name must be at least 2 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be valid')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('email must be valid')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters'),
];

module.exports = {
    signupValidation,
    loginValidation,
};
