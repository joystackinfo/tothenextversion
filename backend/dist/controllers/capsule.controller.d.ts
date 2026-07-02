import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        _id: string;
    };
}
declare const createCapsule: (req: AuthRequest, res: Response) => Promise<void>;
declare const getCapsules: (req: AuthRequest, res: Response) => Promise<void>;
declare const getCapsule: (req: AuthRequest, res: Response) => Promise<void>;
declare const deleteCapsule: (req: AuthRequest, res: Response) => Promise<void>;
export { createCapsule, getCapsules, getCapsule, deleteCapsule };
