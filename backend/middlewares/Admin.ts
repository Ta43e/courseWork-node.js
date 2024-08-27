import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/Interfaces';
import jwt from 'jsonwebtoken';

export const Admin = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (req.cookies.token) {
            const token: string = req.cookies.token;
            const decoded: any = jwt.verify(token, 'secret');
            req._id = decoded._id;
            req.admin = decoded.admin;
            if(req.admin) {
                res.redirect('/adminPanel');
            } else {
                next();
            }
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};