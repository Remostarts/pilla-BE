import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { responseHandler } from '../../../shared';
import { TestServices } from './test.services';

export class TestControllers {
    constructor(readonly testServices: TestServices) {}

    async getTests(req: Request, res: Response): Promise<void> {
        const result = await this.testServices.getTests();

        responseHandler<[string]>(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'tests retrieved successfully!',
            data: result,
        });
    }
}
