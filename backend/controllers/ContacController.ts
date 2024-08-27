import { Response } from 'express';
import Users, {IUserModel} from '../model/User'
import { IAuthRequest } from '../interfaces/Interfaces';
import { checkNotification } from '../utils/chekNotification';
import { getUser } from '../utils/getProfile';

export async function getContacts(req: IAuthRequest, res: Response): Promise<void> {
    const user: IUserModel | null = await Users.findById(req['_id']);
    const notification: Boolean = await checkNotification(req._id as string);
    if (user) {
        const contacts: IUserModel[] = [];
        for (const element of user.contacts) {
            const contact: IUserModel | null = await Users.findById(element.toString());
            if(contact) {
                contacts.push(contact);
            }
        }
        return res.render('contacts.ejs', { contacts: contacts, currentUser: user, checkNotification: notification });
    } else {
        console.log('Давайте добавим контактик)');
    }
}

export async function removecontacts(req: IAuthRequest, res: Response): Promise<void> {
    const user: IUserModel | null = await Users.findById(req._id);
    if (user) {
        const idUser: any =  req.params['userId']
        if(user.contacts.includes(idUser)) {
            user.contacts = user.contacts.filter(element => element.toString() !== idUser.toString());
            await user.save();
            return res.redirect('/contacts');
        }
        else {
            return res.redirect('/contacts');
        }
    } else {
        console.log('Давайте добавим контактик)');
    }
}

export async function favorites(req: IAuthRequest, res: Response): Promise<void> {
    const user: IUserModel | null = await Users.findById(req._id);
    if (user) {
        const notification: Boolean = await checkNotification(req._id as string);
        const myLikedUserIds = user.mylikes;
        const likedUsers = await Users.find({ _id: { $in: myLikedUserIds } });
        return res.render('favorites.ejs', {users: likedUsers, currentUser: user, checkNotification: notification })
    } else {
        console.log('ddddd')
        res.redirect('/')
    }
}
    
export async function deleteFavorites(req: IAuthRequest, res: Response): Promise<void> {
    const user: IUserModel | null = await Users.findById(req._id);
    if (user) {
        const idUser: any =  req.params['userId']
        if(user.mylikes.includes(idUser)) {
            user.mylikes = user.mylikes.filter(element => element.toString() !== idUser.toString());
            console.log(idUser);
            console.log(user.mylikes);
            await user.save();  
            res.status(201).json('OK')
        }
        else {
            res.status(501).json('error')
        }
    } else {
        console.log('Давайте добавим контактик)');
    }
}