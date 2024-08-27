import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

interface Error {
    msg: string;
}

const handleValidationErrorsForLogin = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error: Error) => error.msg);
        res.json({ message: errorMessages.join(', ') });
    }
    next();
};

const handleValidationErrorsForRegister = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error: Error) => error.msg);
        res.json({ message: errorMessages.join(', ') });
        return;
    }
    next();
};

const handleValidationErrorsForPosts = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error: Error) => error.msg);
        res.json({ message: errorMessages.join(', ') });
        return;
    }
    next();
};

export { handleValidationErrorsForLogin, handleValidationErrorsForRegister, handleValidationErrorsForPosts };
