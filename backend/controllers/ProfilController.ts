import { Response } from 'express';
import { IAuthRequest } from '../interfaces/Interfaces';
import Users, {IUserModel} from '../model/User'
import { getUser } from '../utils/getProfile';

export async function block(req: IAuthRequest, res: Response) {
    const user: IUserModel | null = await Users.findById(req._id);
    if (user) {
        const id: any = req.params['userId'];
        user.blocked.push(id);
        await user.save();
        res.redirect(`/`);
    } else {
        res.redirect(`/users/${req.params['userId']}`);
    }
}

export async function unblockingUserProfile (req: IAuthRequest, res: Response): Promise<void> {
    if ('_id' in req) {
        const currentUser: IUserModel | null = await getUser(req._id as any, res);
        if (currentUser) {
            const id: any = req.params['userId'];
            currentUser.blocked = currentUser.blocked.filter((id) =>  id !== id);
            currentUser.mylikes = currentUser.mylikes.filter((id) =>  id !== id);
            await currentUser.save();
            res.redirect(`/users/${id}`);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
};

export async function like(req: IAuthRequest, res: Response) {
    const id: any = req.params['userId'];
    const currentUser: IUserModel | null = await getUser(req._id as any, res);
    const otherUser: IUserModel | null = await getUser(id, res);
    if (currentUser) {
        if (currentUser.mylikes.includes(id)) {
            res.redirect(`/unlike/${req.params['userId']}`);
        }
        else {
            otherUser?.otherlikes.push(req._id as any);
            currentUser.mylikes.push(id);
            await currentUser.save();
            res.redirect(`/users/${req.params['userId']}`);
        }
    } else {
        res.redirect(`/users/${req.params['userId']}`);
    }
}

export async function unlike(req: IAuthRequest, res: Response) {
    const id: any = req.params['userId'];
    const currentUser: IUserModel | null = await getUser(req._id as any, res);
    const otherUser: IUserModel | null = await getUser(id, res);
    if (currentUser && otherUser) {
        currentUser.mylikes = currentUser.mylikes.filter((id) => id !== id);
        await currentUser.save();
        res.redirect(`/users/${req.params['userId']}`);
    } else {
        res.redirect(`/users/${req.params['userId']}`);
    }
}

export async function message(req: IAuthRequest, res: Response) {
    res.render('register.ejs');
}