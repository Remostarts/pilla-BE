/* eslint-disable class-methods-use-this */
import axios from 'axios';
import httpStatus from 'http-status';

import {
    HandleApiError,
    configs,
    errorNames,
    // exclude,
    // jwtHelpers,
    prisma,
} from '../../../shared';
import { AllCategoriesResponse } from './utilityBill.types';
// import { MailOptions, sendMail } from '../../../shared/mail/mailService';

export class UtilityBillService {
    getCategories = async (): Promise<object | null> => {
        let bankApiResponse = {} as AllCategoriesResponse;

        await prisma.$transaction(async () => {
            const bankApiUrl = `${configs.bankUtilityBillUrl}/categories`;

            bankApiResponse = await axios.get(bankApiUrl);
            console.log(
                '🚀 ~ UtilityBillService ~ awaitprisma.$transaction ~ bankApiResponse:',
                bankApiResponse.data
            );

            if (bankApiResponse.data.length === 0) {
                throw new HandleApiError(
                    errorNames.BAD_REQUEST,
                    httpStatus.BAD_REQUEST,
                    'An unknown error occurred while creating the bank account.'
                );
            }
        });

        return bankApiResponse.data;
    };

    getBillsByCategory = async (categoryId: string): Promise<object | null> => {
        let bankApiResponse = {} as AllCategoriesResponse;

        await prisma.$transaction(async () => {
            const bankApiUrl = `${configs.bankUtilityBillUrl}/bill/assigned/byCategoryId/${categoryId}`;

            const basicAuth = {
                auth: {
                    username: 'test',
                    password: 'test',
                },
            };

            bankApiResponse = await axios.get(bankApiUrl, basicAuth);
            console.log(
                '🚀 ~ UtilityBillService ~ awaitprisma.$transaction ~ bankApiResponse:',
                bankApiResponse.data
            );

            if (bankApiResponse.data.length === 0) {
                throw new HandleApiError(
                    errorNames.BAD_REQUEST,
                    httpStatus.BAD_REQUEST,
                    'An unknown error occurred while creating the bank account.'
                );
            }
        });

        return bankApiResponse.data;
    };

    getBillFields = async (billId: string): Promise<object | null> => {
        let bankApiResponse = {} as AllCategoriesResponse;

        await prisma.$transaction(async () => {
            const bankApiUrl = `${configs.bankUtilityBillUrl}/field/assigned/byBillId/${billId}`;

            const basicAuth = {
                auth: {
                    username: 'test',
                    password: 'test',
                },
            };

            bankApiResponse = await axios.get(bankApiUrl, basicAuth);
            console.log(
                '🚀 ~ UtilityBillService ~ awaitprisma.$transaction ~ bankApiResponse:',
                bankApiResponse.data
            );

            if (bankApiResponse.data.length === 0) {
                throw new HandleApiError(
                    errorNames.BAD_REQUEST,
                    httpStatus.BAD_REQUEST,
                    'An unknown error occurred while creating the bank account.'
                );
            }
        });

        return bankApiResponse.data;
    };
}
