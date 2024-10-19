import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { UtilityBillService } from './utilityBill.services';

export class UtilityBillsController {
    constructor(readonly UtilityBillsServices: UtilityBillService) {}

    async getCategories(req: Request, res: Response): Promise<void> {
        const result = await this.UtilityBillsServices.getCategories();
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Successfully retrieved the bills categories!',
            data: result,
        });
    }

    async getBillsByCategory(req: Request, res: Response): Promise<void> {
        console.log('🚀 ~ UtilityBillsController ~ getBillsByCategory ~ req:', req.params);
        const result = await this.UtilityBillsServices.getBillsByCategory(req.params.categoryId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Successfully retrieved the bills by categories id',
            data: result,
        });
    }

    async getBillFields(req: Request, res: Response): Promise<void> {
        console.log('🚀 ~ UtilityBillsController ~ getBillFields ~ req:', req.params);
        const result = await this.UtilityBillsServices.getBillFields(req.params.billId);
        res.status(httpStatus.OK).json({
            success: true,
            message: 'Get bill fields successfully',
            data: result,
        });
    }
}
