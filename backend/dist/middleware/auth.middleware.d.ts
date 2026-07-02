import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export default protect;
