
import { Request, Response } from 'express';

import Users, {IUserModel} from '../model/User'
import Message, {IMessageModel} from '../model/Message'

import { IAuthRequest } from '../interfaces/Interfaces';
import { checkNotification } from '../utils/chekNotification';

export async function getChat(req: IAuthRequest, res: Response): Promise<void> {
    try {
        const notification: Boolean = await checkNotification(req._id as string);
        const currentUser: IUserModel | null = await Users.findById(req['_id']);
        const contact: IUserModel | null = await Users.findById(req.params['userId']);
        const rightMessage: IMessageModel[] | null = await Message.find({
            sender: req['_id'],
            receiver: req.params['userId']
        }).sort({ timestamp: 1 });
        const leftMessage: IMessageModel[] | null = await Message.find({
            sender:  req.params['userId'],
            receiver: req['_id']
        }).sort({ timestamp: 1 });
        const chat: IMessageModel[]  = [...rightMessage, ...leftMessage];
        chat.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        res.render('chat.ejs', { chat: chat, contact: contact, currentUser: currentUser, checkNotification: notification });
    } catch (error) {
        console.error("Error fetching chat messages:", error);
        res.status(500).send("Error fetching chat messages");
    }
} 

export async function updateChat(req: IAuthRequest, res: Response): Promise<void>  {
    try {
        const { currentUser, contact } = req.body; 
        const rightMessage = await Message.find({
            sender: currentUser._id,
            receiver: contact._id
        }).sort({ timestamp: 1 });
        const leftMessage = await Message.find({
            sender: contact._id,
            receiver: currentUser._id
        }).sort({ timestamp: 1 });
        const chat = [...rightMessage, ...leftMessage];
        chat.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        res.json({ chat });
    } catch (error) {
        console.error("Error updating chat:", error);
        res.status(500).send("Error updating chat");
    }
}

export async function updateChatReceiver (req: IAuthRequest, res: Response): Promise<void>  {
    try {
        const { currentUser, contact } = req.body;
        const rightMessage = await Message.find({
            sender: contact._id,
            receiver: currentUser._id
        }).sort({ timestamp: 1 });
        const leftMessage = await Message.find({
            sender: currentUser._id,
            receiver: contact._id
        }).sort({ timestamp: 1 });
        const chat = [...rightMessage, ...leftMessage];
        chat.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
        res.json({ chat });
    } catch (error) {
        console.error("Error updating receiver's chat:", error);
        res.status(500).send("Error updating receiver's chat");
    }
  }