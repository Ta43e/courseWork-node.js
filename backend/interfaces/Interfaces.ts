import { Request } from 'express';

interface IAuthRequest extends Request {
    _id?: string; 
    admin?: boolean; 
}

export {IAuthRequest}