import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Users, {IUserModel} from '../model/User'
import jwt from 'jsonwebtoken'
import { IAuthRequest } from '../interfaces/Interfaces';


export async function getFormRegister(req: Request, res: Response) {
    res.render('register.ejs');
}

  export async function getLogin(req: Request, res: Response) {
    res.render('login.ejs');
  }

  export async function login(req: Request, res: Response) {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({
            message: 'Пользователь не найден',
        });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isValidPass) {
        return res.status(403).json({
            message: 'Неверный логин или пароль',
        });
    }

    const checkAdmin: boolean = user.email === 'admin@admin.by' ?  true : false;
    const token = jwt.sign(
        {
            _id: user._id,
            admin: checkAdmin,
        },
        'secret',
        {
            expiresIn: '30d',
        }
    );
    res.cookie('token', token, { maxAge: 86400000 });

    const userData = user.toObject();

    if ('passwordHash' in userData) {
        delete (userData as any).passwordHash;
    }
    console.log(userData);
    res.status(200).json(userData); 
}

  export async function createProfile(req: Request, res: Response): Promise<void> {
    const email: string = req.body.email;
  
    if (await Users.findOne({ email: email })) {
      res.redirect('/register');
      return;
    }

    let mainPhotoPath = '';
    let photosPath: string[] = [];
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files['mainPhoto'][0]) {
        mainPhotoPath = files['mainPhoto'][0].path;
      }
      if (files['photos']) {
        photosPath = files['photos'].map((file: Express.Multer.File) => file.path);
      }
    }

    const password: string = req.body.password;
    const salt: string = await bcrypt.genSalt(10);
    const hash: string = await bcrypt.hash(password, salt);

    const user: IUserModel = new Users({
      email: req.body.email,
      firstName: req.body.firstName,
      description: ' ',
      sex: req.body.gender,
      passwordHash: hash,
      age: req.body.age,
      purpose: req.body.purpose,
      location: req.body.location,
      mainPhoto: mainPhotoPath,
      photos: photosPath,
    });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret',
      {
        expiresIn: '30d',
      }
    );

    res.cookie('token', token, { maxAge: 86400000 });

    const savedUser = await user.save();
    res.redirect('/');
  }

  export async function logout(req: IAuthRequest, res: Response) {
    res.clearCookie('token');
    res.redirect('/login');
  }
