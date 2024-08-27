import { Request, Response } from 'express';
import { MailService } from '../mailSend/mailSend';
import { validationResult } from 'express-validator';
import { IAuthRequest } from '../interfaces/Interfaces';
import Users, {IUserModel} from '../model/User'
import BannedUsers, {IBannedUserModel} from '../model/BannedUsers'
import { getUser } from '../utils/getProfile';


const adminPanel = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
        const { page = 1, perPage = 4 } = req.query;
        

        const totalCount: number = await Users.countDocuments();

        const totalPages: number = Math.ceil(totalCount / +perPage);
        const startIndex: number = (+page - 1) * +perPage;
        const filter: any = {};
        filter._id = { $ne: req._id };
        const users: IUserModel[] | null = await Users.find(filter).skip(startIndex).limit(+perPage);

        if (users) {
            const currentUser: IUserModel | null = await getUser(req._id as any, res); 
            if (currentUser) {
                res.render('adminindex.ejs', { 
                    data: users, 
                    currentUser: currentUser,
                    page: +page,  
                    perPage: +perPage,  
                    totalPages: totalPages  
                });
            } else {
                res.status(404).json({ message: 'Users not found' });
            }
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteUserPage = async (req: IAuthRequest, res: Response): Promise<void> => {
    const user: IUserModel | null = await Users.findById(req.params['userId']);
    const currentUser: IUserModel | null = await Users.findById(req._id);
    if (user) {
        res.render('adminDeleteUser.ejs', {user: user, currentUser: currentUser})
    }
    else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteUser  = async (req: IAuthRequest, res: Response): Promise<void> => {
    const mail: MailService = new MailService();
    const userId = req.params.userId;
    const reason = req.query.reason;

    const user: IUserModel | null = await Users.findById(req.params['userId']);
    if (user) {
        const message = reason === '' ?  'Домой очередняра' : reason as string;
        const bannedUser: IBannedUserModel = new BannedUsers({
            email:  user.email,
            message: message,
        }) 
        await bannedUser.save();
        await Users.deleteOne({_id: userId});
        mail.sendMail(message, user.email);
        res.redirect('/adminPanel');
    } else {
        res.redirect('/adminPanel');  
    }

}

export {adminPanel, deleteUserPage, deleteUser};