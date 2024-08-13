import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { UserServices } from './user.services';
import {
    TBvnVerificationInput,
    TIdVerificationInput,
    TNextOfKinInput,
    TProofOfAddressInput,
} from './user.types';

export class UserControllers {
    constructor(readonly userServices: UserServices) {}

    async bvnVerification(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.bvnVerification(
            req.body as TBvnVerificationInput,
            userId
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Bank Number verified',
            data: result,
        });
    }

    async idVerification(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.idVerification(
            req.body as TIdVerificationInput,
            userId
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'ID verified',
            data: result,
        });
    }

    async proofOfAddress(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.proofOfAddress(
            req.body as TProofOfAddressInput,
            userId
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Address verified',
            data: result,
        });
    }

    async nextOfKin(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.nextOfKin(req.body as TNextOfKinInput, userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Next of Kin added',
            data: result,
        });
    }
}
