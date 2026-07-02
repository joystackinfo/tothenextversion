import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        _id: string;
    };
}
declare const getWall: (req: Request, res: Response) => Promise<void>;
declare const likePost: (req: AuthRequest, res: Response) => Promise<void>;
declare const shareToWall: (req: AuthRequest, res: Response) => Promise<void>;
export { getWall, likePost, shareToWall };
