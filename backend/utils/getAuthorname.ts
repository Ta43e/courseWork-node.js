import { Request, Response } from 'express';
import {users} from '../model/users';
import { IAuthRequest } from '../interfaces/Interfaces';

export const getAuthorName = (req: Request | IAuthRequest, res: Response): string | undefined => {
    if ('email' in req) {
        const user = users.find(user => user.email === req.email);
        if(user) {
            return user.firstName;
        } else {
            res.status(403).json({message: 'User not found'});
        }
    }
};