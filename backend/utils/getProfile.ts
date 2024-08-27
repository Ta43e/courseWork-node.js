import Users, {IUserModel} from '../model/User'
import { IAuthRequest } from "../interfaces/Interfaces";
import { Request, Response } from 'express';

export async function getUser(id: string, res: Response): Promise<IUserModel | null> {
    try {
        const user = await Users.findById(id);
        return user;  
    } catch (err) {
        res.status(501).json(err);
        throw err;
    }
}