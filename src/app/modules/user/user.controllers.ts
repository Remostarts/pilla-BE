import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { UserServices } from './user.services';
import {
    TAddCardInput,
    TAddMoneyInput,
    TBvnVerificationInput,
    TIdVerificationInput,
    TNextOfKinInput,
    TProofOfAddressInput,
    TTransactionPinInput,
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

    async getPersonalDashboardData(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.getPersonalDashboardData(userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Dashboard data retrieved successfully',
            data: result,
        });
    }

    async setTransactionPin(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.setTransactionPin(
            req.body as TTransactionPinInput,
            userId
        );
        console.log(result);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Pin set successfully',
            data: {},
        });
    }

    async getAllTransactions(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const transactions = await this.userServices.getAllTransactions(userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'All transactions retrieved successfully',
            data: transactions,
        });
    }

    async getTransactionById(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;
        const { id } = req.params;

        const transaction = await this.userServices.getTransactionById(id, userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Transaction retrieved successfully',
            data: transaction,
        });
    }

    async addCard(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;

        const result = await this.userServices.addCard(req.body as TAddCardInput, userId);

        responseHandler<object>(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Card added successfully',
            data: result,
        });
    }

    async addMoneyUsingCard(req: Request, res: Response): Promise<void> {
        const userId = req.user?.id as string;
        const { cardId } = req.params;

        const result = await this.userServices.addMoneyUsingCard(
            userId,
            cardId,
            req.body as TAddMoneyInput
        );

        responseHandler<object>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Money added successfully',
            data: result,
        });
    }
}
