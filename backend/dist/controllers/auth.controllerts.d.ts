import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        _id: string;
    };
}
declare const register: (req: Request, res: Response) => Promise<void>;
declare const login: (req: Request, res: Response) => Promise<void>;
declare const updateProfile: (req: AuthRequest, res: Response) => Promise<void>;
declare const forgotPassword: (req: Request, res: Response) => Promise<void>;
declare const resetPassword: (req: Request, res: Response) => Promise<void>;
export { register, login, forgotPassword, resetPassword, updateProfile };
