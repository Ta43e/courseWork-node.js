import { Request, Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/Interfaces';
import Users, {IUserModel} from '../model/User'

export const checkBlocking = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const idCurrentUser: any = req['_id'];
        const idContactUser: any = req.params['userId'];
        const contact: IUserModel | null = await Users.findById(idContactUser);
        const currentUser: IUserModel | null = await Users.findById(idCurrentUser);
        if (contact && currentUser) {
            if(contact.blocked.includes(idCurrentUser)) {
                res.render('blockingNoAccess.ejs', {user: contact, blockingStatus: currentUser.blocked.includes(idContactUser), currentUser: currentUser});
            }
            else {
                next();
            }
        } else {
            res.redirect('/');   
        }
    } catch (err) {
        res.status(404).json(err);
    }
};