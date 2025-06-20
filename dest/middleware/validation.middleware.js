"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateRequest = (dtoClass) => {
    return async (req, res, next) => {
        const dto = (0, class_transformer_1.plainToInstance)(dtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dto);
        if (errors.length > 0) {
            const message = errors.map((error) => Object.values(error.constraints)).join(', ');
            res.status(400).json({ message });
            return;
        }
        req.body = dto;
        next();
    };
};
exports.validateRequest = validateRequest;
