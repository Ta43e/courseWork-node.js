import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IAuthRequest } from '../interfaces/Interfaces';
import Users, {IUserModel} from '../model/User'
import { getUser } from '../utils/getProfile';
import { checkNotification } from '../utils/chekNotification';

const showAllUser = async (req: IAuthRequest, res: Response): Promise<void> => {
    try {
        const { minAge, maxAge, gender, location, purpose, page = 1, perPage = 8 } = req.query;

        const filter: any = {};

        if (minAge && maxAge) {
            filter.age = { $gte: parseInt(minAge as string), $lte: parseInt(maxAge as string) };
        }


        if (minAge && !maxAge) {
            filter.age = { $gte: parseInt(minAge as string), $lte: 100 };
        }


        if (!minAge && maxAge) {
            filter.age = { $gte: 18, $lte: parseInt(maxAge as string) };
        }


        if (gender) {
            filter.sex = gender; 
        }

        if (location) {
            filter.location = location;
        }

        if (purpose && purpose !== 'Неважно') {
            filter.purpose = purpose;
        }

        filter._id = { $ne: req._id };
        filter.email = { $ne: 'admin@admin.by' };

        const totalCount: number = await Users.countDocuments(filter);

        const totalPages: number = Math.ceil(totalCount / +perPage);
        const startIndex: number = (+page - 1) * +perPage;

        const data: IUserModel[] | null = await Users.find(filter).skip(startIndex).limit(+perPage);

        if (data) {
            const currentUser: IUserModel | null = await getUser(req._id as any, res); 
            if (currentUser) {
                const notification: Boolean = await checkNotification(req._id as string);
                res.render('index.ejs', { 
                    data: data, 
                    currentUser: currentUser,
                    page: +page,  
                    perPage: +perPage,  
                    totalPages: totalPages,
                    checkNotification: notification,
                });
            } else {
                res.status(404).json({ message: 'Users not found' });
            }
        } else {
            res.status(404).json({ message: 'Users not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const userProfile = async (req: IAuthRequest, res: Response): Promise<void> => {
    if ('_id' in req) {
        const currentUser: IUserModel | null = await getUser(req._id as any, res); 
        if (currentUser) {
            const id: any = req.params['userId'];
            const user: IUserModel | null = await Users.findById({_id: id});
            if (user) {
                const notification: Boolean = await checkNotification(req._id as string);
                if (currentUser.blocked.includes(id)) {
                    res.render('blocking.ejs', {user: user, currentUser: currentUser, checkNotification: notification})
                }
                else {
                    const checkLike = currentUser.mylikes.includes(id);
                    return res.render('profile.ejs', {user: user, checkLike: checkLike, currentUser: currentUser, checkNotification: notification});
                }
            }
            else {
                console.log('Not found');
                 res.status(501).json('Not found');
            }
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateProfile = async (req: IAuthRequest, res: Response): Promise<void> => {
    if ('_id' in req) {
            const userId = req._id; 
            const user = await Users.findById(userId);
            if(user) {
                const { firstName, age, location, purpose, description } = req.body;
                let mainPhotoPath = '';
                let photosPath: string[] = [];
                if (req.files) {
                    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
                    if (files['mainPhoto'] && files['mainPhoto'].length > 0) {
                        mainPhotoPath = files['mainPhoto'][0].path;
                    } else {
                        mainPhotoPath = user.mainPhoto;
                    }
                    if (files['photos'] && files['photos'].length > 0) {
                        photosPath = files['photos'].map((file: Express.Multer.File) => file.path);
                    } else {
                        photosPath = user.photos;
                    }
                }
    
                await Users.findByIdAndUpdate(userId, {firstName, age, location, purpose, description, mainPhoto: mainPhotoPath, photos: photosPath,}).then((data) => {
                    res.status(200).send('Profile updated successfully');
                }).catch((err) => {
                    console.error('Error updating profile:', err);
                    res.status(500).send('Internal Server Error');
                })
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const personalProfile = async (req: IAuthRequest, res: Response): Promise<void> => {
    if ('_id' in req) {
        const notification: Boolean = await checkNotification(req._id as string);
        Users.findById({_id: req._id}).then((user) => {
           res.render('personalProfile.ejs', {currentUser: user, checkNotification: notification})
        })
        .catch((err) => res.status(501).json(err));
    } 
    else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { userProfile, personalProfile, showAllUser, updateProfile };
