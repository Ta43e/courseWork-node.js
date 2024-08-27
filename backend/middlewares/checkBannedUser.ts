import e, { Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/Interfaces';
import BannedUsers, {IBannedUserModel} from '../model/BannedUsers'

export const checkBannedUser = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const email: string = req.body.email;
       await BannedUsers.findOne({email: email}).then((data) =>  {
        if (data) {
            res.render('banPage.ejs', {bannedUser: data});
        } else {
            next();
        } 
        }).
        catch((err) => {
            console.log(err);
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};