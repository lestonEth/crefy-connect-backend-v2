import { Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateRequest = (dtoClass: ClassConstructor<any>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const dto = plainToInstance(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            const message = errors.map((error: any) => Object.values(error.constraints)).join(', ');
            res.status(400).json({ message });
            return;
        }

        req.body = dto;
        next();
    };
};