import { Router } from 'express';
import { createProfile, getLogin, login, getFormRegister, logout } from '../controllers/AuthController';
import multer from 'multer';
import { checkAuth } from '../middlewares/checkAuth';
import { checkBlocking } from '../middlewares/checkBlocking';
import { checkBannedUser } from '../middlewares/checkBannedUser';
import { personalProfile, showAllUser, userProfile, updateProfile } from '../controllers/UserController';
import { block, like, message, unblockingUserProfile, unlike } from '../controllers/ProfilController';
import { getChat, updateChat, updateChatReceiver } from '../controllers/ChatController';
import { adminPanel, deleteUserPage, deleteUser } from '../controllers/AdminController';
import { checkAdmin } from '../middlewares/checkAdmin';
import { checkNotification, deleteNotification, getNotificationPage } from '../controllers/NotificationController';
import { getContacts, removecontacts, favorites, deleteFavorites } from '../controllers/ContacController';
import { Admin } from '../middlewares/Admin';

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '_' + Date.now() + '.jpg');
    }
  });
  
  const fileFilter = function (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];
    if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
      cb(null, true);
    } else {
      cb(null, false)
    }
  };
  
  const upload = multer({ storage: storage, fileFilter: fileFilter });

export const routes = Router();



routes.get('/login', getLogin);
routes.get('/register', getFormRegister);

const cpUpload = upload.fields([{ name: 'mainPhoto', maxCount: 1 }, { name: 'photos', maxCount: 8 }])
routes.post('/register', cpUpload, checkBannedUser, createProfile);
routes.post('/login', checkBannedUser, login);

 
routes.get('/', checkAuth, Admin, showAllUser);
 
routes.get('/users/:userId', checkAuth, checkBlocking, userProfile)
routes.get('/profile', checkAuth, personalProfile)
routes.put('/profile', checkAuth, cpUpload, updateProfile)

routes.get('/logout', checkAuth, logout)

routes.get('/block/:userId', checkAuth, block)
routes.get('/unblock/:userId', checkAuth, unblockingUserProfile)

routes.get('/like/:userId', checkAuth, like)
routes.get('/unlike/:userId', checkAuth, unlike)
routes.get('/message/:userId', checkAuth, message)

routes.get('/contacts', checkAuth, getContacts);
routes.get('/contacts/chat/:userId', checkAuth, checkBlocking, getChat);
routes.get('/contacts/removecontacts/:userId', checkAuth, checkBlocking, removecontacts);

routes.post('/update', checkAuth, updateChat);
routes.post('/update-receiver',checkAuth, updateChatReceiver);

routes.get('/adminPanel', checkAuth, checkAdmin, adminPanel);
routes.get('/adminPanel/deleteUserPage/:userId', checkAuth, checkAdmin, deleteUserPage);
routes.get('/adminPanel/deleteUser/:userId', checkAuth, checkAdmin, deleteUser);

routes.get('/notifications', checkAuth, getNotificationPage);
routes.delete('/notifications/:notificationId', checkAuth, deleteNotification);
routes.get('/checkNotification/:notificationId', checkAuth, checkNotification);

routes.get('/favorites', checkAuth, favorites);
routes.delete('/favorites/:userId', checkAuth, deleteFavorites);