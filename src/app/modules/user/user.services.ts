/* eslint-disable class-methods-use-this */
import {
    BankVerification,
    Card,
    IdentityVerification,
    NextOfKin,
    ProofOfAddress,
    Transaction,
    UserVerification,
} from '@prisma/client';
// import axios from 'axios';
import { randomUUID } from 'crypto';
import httpStatus from 'http-status';
import { errorNames, HandleApiError, prisma } from '../../../shared';
import {
    TAddCardInput,
    TAddMoneyInput,
    TBvnVerificationInput,
    TIdVerificationInput,
    TNextOfKinInput,
    TProofOfAddressInput,
    TTransactionPinInput,
    TUpdateUserProfileInput,
} from './user.types';

export class UserServices {
    async updateUserProfile(userId: string, input: TUpdateUserProfileInput): Promise<object> {
        const {
            firstName,
            middleName,
            lastName,
            address,
            city,
            localGovern: localGovernment,
            state,
        } = input;

        if (firstName || middleName || lastName) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    ...(firstName && { firstName }),
                    ...(middleName && { middleName }),
                    ...(lastName && { lastName }),
                },
            });
        }

        const profile = await prisma.profile.findUnique({
            where: { userId },
        });

        const profileData = {
            ...(address && { address }),
            ...(city && { city }),
            ...(localGovernment && { localGovernment }),
            ...(state && { state }),
        };

        if (Object.keys(profileData).length > 0) {
            if (profile) {
                await prisma.profile.update({
                    where: { userId },
                    data: profileData,
                });
            } else {
                await prisma.profile.create({
                    data: {
                        ...profileData,
                        user: {
                            connect: { id: userId },
                        },
                    },
                });
            }
        }

        return {};
    }

    async getUserProfile(userId: string): Promise<object> {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                email: true,
                phone: true,
                profile: {
                    select: {
                        address: true,
                        city: true,
                        localGovernment: true,
                        state: true,
                    },
                },
            },
        });

        if (!user) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'User not found!');
        }

        return user;
    }

    async bvnVerification(
        input: TBvnVerificationInput,
        userId: string
    ): Promise<BankVerification | null> {
        const { bvn, gender, dateOfBirth } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                userVerification: {
                    select: {
                        id: true,
                        bankVerification: true,
                        identityVerification: { select: { isVerified: true } },
                        nextOfKin: { select: { isVerified: true } },
                        proofOfAddress: { select: { isVerified: true } },
                    },
                },
            },
        });

        if (user?.userVerification?.bankVerification?.isVerified) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'bvn is already verified!'
            );
        }

        let userVerify = {} as UserVerification;
        if (!user?.userVerification) {
            userVerify = await prisma.userVerification.create({
                data: {
                    userId,
                },
            });
        }

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!bvn || !gender || !dateOfBirth) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        // TODO: BVN Verification Logic

        // const bvnApiUrl = 'https://api.okraapi.com/v2/sandbox/identity/getByBvn'; // Replace with actual URL
        // const authToken =
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTExNDNiYWYxZTQ5NDY4OTAzZmIxYjEiLCJpYXQiOjE2OTU2MzAyNjZ9.RcTIh1fsC8tKaG87YF-l53byK543Ek6i4iF7i8K1oNg'; // Replace with actual token
        // let fetchedData = {};

        // try {
        //     const response = await axios.post(
        //         bvnApiUrl,
        //         { bvn }, // Request body
        //         {
        //             headers: {
        //                 Authorization: `Bearer ${authToken}`, // Set Authorization header
        //                 'Content-Type': 'application/json',
        //             },
        //         }
        //     );

        //     if (response.data.status === 'success') {
        //         fetchedData = response.data.data;
        //     } else {
        //         throw new HandleApiError(
        //             errorNames.CONFLICT,
        //             httpStatus.CONFLICT,
        //             response.data.message || 'Failed to retrieve BVN details'
        //         );
        //     }
        // } catch (error) {
        //     throw new HandleApiError(
        //         errorNames.INTERNAL_SERVER_ERROR,
        //         httpStatus.INTERNAL_SERVER_ERROR,
        //         'Error fetching BVN details'
        //     );
        // }

        const fetchedData = {
            id: randomUUID(),
            firstname: 'Fusuyi',
            middlename: 'Micheal',
            lastname: 'Tobi',
            fullname: 'Fusuyi Micheal Tobi',
            dob: '1989-04-16',
            bvn: randomUUID(),
            gender: 'Male',
            customer: {
                _id: randomUUID(),
                name: 'Fusuyi Micheal Tobi',
            },
            verification_country: 'NG',
            created_at: '2023-04-27T19:26:07.519Z',
            aliases: [],
            phone: ['08038811523'],
            email: [],
            address: ['23 Fusho Street king house Lagos'],
            nationality: 'Nigeria',
            lga_of_origin: 'Ogbomosho North',
            lga_of_residence: 'Lagos Mainland',
            state_of_origin: 'Oyo State',
            state_of_residence: 'Lagos State',
            marital_status: 'Single',
            next_of_kins: [],
            nin: randomUUID(),
            photo_id: [
                {
                    url: 'https://djrzfsrexmrry.cloudfront.net/MjIxNj.png',
                    image_type: 'bvn_photo',
                },
            ],
            enrollment: {
                bank: '050',
                branch: '100 Eng Macaulay',
                registration_date: '1989-04-16',
            },
        };

        await prisma.bvnResponse.create({
            data: {
                id: fetchedData.id,
                firstname: fetchedData.firstname,
                middlename: fetchedData.middlename,
                lastname: fetchedData.lastname,
                fullname: fetchedData.fullname,
                dob: new Date(fetchedData.dob),
                bvn: fetchedData.bvn,
                gender: fetchedData.gender,
                customer: {
                    create: {
                        id: fetchedData.customer._id,
                        name: fetchedData.customer.name,
                    },
                },
                verificationCountry: fetchedData.verification_country,
                createdAt: new Date(fetchedData.created_at),
                aliases: fetchedData.aliases,
                phone: fetchedData.phone,
                email: fetchedData.email,
                address: fetchedData.address,
                nationality: fetchedData.nationality,
                lgaOfOrigin: fetchedData.lga_of_origin,
                lgaOfResidence: fetchedData.lga_of_residence,
                stateOfOrigin: fetchedData.state_of_origin,
                stateOfResidence: fetchedData.state_of_residence,
                maritalStatus: fetchedData.marital_status,
                nextOfKins: fetchedData.next_of_kins,
                nin: fetchedData.nin,
                photoId: {
                    create: fetchedData.photo_id.map((photo) => ({
                        id: fetchedData.id,
                        url: photo.url,
                        imageType: photo?.image_type,
                    })),
                },
                enrollment: {
                    create: {
                        id: randomUUID(),
                        bank: fetchedData.enrollment.bank,
                        branch: fetchedData.enrollment.branch,
                        registrationDate: new Date(fetchedData.enrollment.registration_date),
                    },
                },
            },
        });

        const bvnDetails = await prisma.bankVerification.create({
            data: {
                bvn,
                gender,
                dateOfBirth,
                isVerified: true,
                userVerification: {
                    connect: {
                        id: userVerify?.id || user.userVerification?.id,
                    },
                },
            },
        });

        if (
            user.userVerification?.identityVerification?.isVerified &&
            user.userVerification?.nextOfKin?.isVerified &&
            user.userVerification?.proofOfAddress?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return bvnDetails;
    }

    async idVerification(
        input: TIdVerificationInput,
        userId: string
    ): Promise<IdentityVerification | null> {
        const { documentType, image, idNumber, nin } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                userVerification: {
                    select: {
                        id: true,
                        bankVerification: { select: { isVerified: true } },
                        identityVerification: true,
                        nextOfKin: { select: { isVerified: true } },
                        proofOfAddress: { select: { isVerified: true } },
                    },
                },
            },
        });

        if (user?.userVerification?.identityVerification?.isVerified) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'identity is already verified!'
            );
        }

        let userVerify = {} as UserVerification;
        if (!user?.userVerification) {
            userVerify = await prisma.userVerification.create({
                data: {
                    userId,
                },
            });
            // console.log('Here', user);
        }

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        let idDetails = {} as IdentityVerification;

        if (nin) {
            idDetails = await prisma.identityVerification.create({
                data: {
                    nin,
                    isVerified: true,
                    userVerification: {
                        connect: {
                            id: userVerify?.id || user.userVerification?.id,
                        },
                    },
                },
            });
        } else {
            if (!documentType || !idNumber || !image) {
                throw new HandleApiError(
                    errorNames.CONFLICT,
                    httpStatus.CONFLICT,
                    'All Fields are required'
                );
            }

            // TODO: ID Verification Logic
            // const bvnApiUrl = 'https://api.okraapi.com/v2/sandbox/identity/getByNin';
            // const authToken =
            //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTExNDNiYWYxZTQ5NDY4OTAzZmIxYjEiLCJpYXQiOjE2OTU2MzAyNjZ9.RcTIh1fsC8tKaG87YF-l53byK543Ek6i4iF7i8K1oNg';

            // let fetchedData = {};

            // try {
            //     const response = await axios.post(
            //         bvnApiUrl,
            //         { nin }, // Request body
            //         {
            //             headers: {
            //                 Authorization: `Bearer ${authToken}`, // Set Authorization header
            //                 'Content-Type': 'application/json',
            //             },
            //         }
            //     );

            //     if (response.data.status === 'success') {
            //         fetchedData = response.data.data;
            //     } else {
            //         throw new HandleApiError(
            //             errorNames.CONFLICT,
            //             httpStatus.CONFLICT,
            //             response.data.message || 'Failed to retrieve BVN details'
            //         );
            //     }
            // } catch (error) {
            //     throw new HandleApiError(
            //         errorNames.INTERNAL_SERVER_ERROR,
            //         httpStatus.INTERNAL_SERVER_ERROR,
            //         'Error fetching BVN details'
            //     );
            // }

            // const fetchedData = {
            //     id: '644acc50924488ad38676348',
            //     firstname: 'Fusuyi',
            //     middlename: 'Micheal',
            //     lastname: 'Tobi',
            //     fullname: 'Fusuyi Micheal Tobi',
            //     dob: '1989-04-16',
            //     bvn: '22165416979',
            //     gender: 'Male',
            //     customer: {
            //         _id: '6424c0638d3bc1046d4b0929',
            //         name: 'Fusuyi Micheal Tobi',
            //     },
            //     verification_country: 'NG',
            //     created_at: '2023-04-27T19:26:07.519Z',
            //     aliases: [],
            //     phone: ['08038811523'],
            //     email: [],
            //     address: ['23 Fusho Street king house Lagos'],
            //     nationality: 'Nigeria',
            //     lga_of_origin: 'Ogbomosho North',
            //     lga_of_residence: 'Lagos Mainland',
            //     state_of_origin: 'Oyo State',
            //     state_of_residence: 'Lagos State',
            //     marital_status: 'Single',
            //     next_of_kins: [],
            //     nin: '97340343221',
            //     photo_id: [
            //         {
            //             url: 'https://djrzfsrexmrry.cloudfront.net/MjIxNj.png',
            //             image_type: 'bvn_photo',
            //         },
            //     ],
            //     enrollment: {
            //         bank: '050',
            //         branch: '100 Eng Macaulay',
            //         registration_date: '1989-04-16',
            //     },
            // };

            // await prisma.bvnResponse.create({
            //     data: {
            //         id: fetchedData.id,
            //         firstname: fetchedData.firstname,
            //         middlename: fetchedData.middlename,
            //         lastname: fetchedData.lastname,
            //         fullname: fetchedData.fullname,
            //         dob: new Date(fetchedData.dob),
            //         bvn: fetchedData.bvn,
            //         gender: fetchedData.gender,
            //         customer: {
            //             create: {
            //                 id: fetchedData.customer._id,
            //                 name: fetchedData.customer.name,
            //             },
            //         },
            //         verificationCountry: fetchedData.verification_country,
            //         createdAt: new Date(fetchedData.created_at),
            //         aliases: fetchedData.aliases,
            //         phone: fetchedData.phone,
            //         email: fetchedData.email,
            //         address: fetchedData.address,
            //         nationality: fetchedData.nationality,
            //         lgaOfOrigin: fetchedData.lga_of_origin,
            //         lgaOfResidence: fetchedData.lga_of_residence,
            //         stateOfOrigin: fetchedData.state_of_origin,
            //         stateOfResidence: fetchedData.state_of_residence,
            //         maritalStatus: fetchedData.marital_status,
            //         nextOfKins: fetchedData.next_of_kins,
            //         nin: fetchedData.nin,
            //         photoId: {
            //             create: fetchedData.photo_id.map((photo: any) => ({
            //                 id: fetchedData.id,
            //                 url: photo.url,
            //                 imageType: photo.image_type,
            //             })),
            //         },
            //         enrollment: {
            //             create: {
            //                 id: fetchedData.id,
            //                 bank: fetchedData.enrollment.bank,
            //                 branch: fetchedData.enrollment.branch,
            //                 registrationDate: new Date(fetchedData.enrollment.registration_date),
            //             },
            //         },
            //     },
            // });

            idDetails = await prisma.identityVerification.create({
                data: {
                    idNumber,
                    image,
                    documentType,
                    isVerified: true,
                    userVerification: {
                        connect: {
                            id: userVerify?.id || user.userVerification?.id,
                        },
                    },
                },
            });
        }

        if (
            user.userVerification?.bankVerification?.isVerified &&
            user.userVerification?.nextOfKin?.isVerified &&
            user.userVerification?.proofOfAddress?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return idDetails;
    }

    async proofOfAddress(
        input: TProofOfAddressInput,
        userId: string
    ): Promise<ProofOfAddress | null> {
        const { address, state, localGovernment, city, documentType, image } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                userVerification: {
                    select: {
                        id: true,
                        bankVerification: { select: { isVerified: true } },
                        identityVerification: { select: { isVerified: true } },
                        nextOfKin: true,
                        proofOfAddress: { select: { isVerified: true } },
                    },
                },
            },
        });

        let userVerify = {} as UserVerification;
        if (!user?.userVerification) {
            userVerify = await prisma.userVerification.create({
                data: {
                    userId,
                },
            });
            // console.log('Here', user);
        }

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!address || !state || !localGovernment || !city || !documentType || !image) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        // TODO: Address Verification Logic

        const addressDetails = await prisma.proofOfAddress.create({
            data: {
                address,
                state,
                localGovernment,
                city,
                documentType,
                image,
                isVerified: true,
                userVerification: {
                    connect: {
                        id: userVerify?.id || user.userVerification?.id,
                    },
                },
            },
        });

        if (
            user.userVerification?.bankVerification?.isVerified &&
            user.userVerification?.nextOfKin?.isVerified &&
            user.userVerification?.identityVerification?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return addressDetails;
    }

    async nextOfKin(input: TNextOfKinInput, userId: string): Promise<NextOfKin | null> {
        const {
            firstName,
            lastName,
            gender,
            relationship,
            phone,
            email,
            address,
            localGovernment,
            state,
            city,
        } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                isVerified: true,
                userVerification: {
                    select: {
                        id: true,
                        bankVerification: { select: { isVerified: true } },
                        identityVerification: { select: { isVerified: true } },
                        nextOfKin: { select: { isVerified: true } },
                        proofOfAddress: true,
                    },
                },
            },
        });

        let userVerify = {} as UserVerification;
        if (!user?.userVerification) {
            userVerify = await prisma.userVerification.create({
                data: {
                    userId,
                },
            });
            // console.log('Here', user);
        }

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (!firstName || !lastName || !gender || !relationship || !phone || !email || !address) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'All Fields are required'
            );
        }

        const kinDetails = await prisma.nextOfKin.create({
            data: {
                firstName,
                lastName,
                gender,
                relationship,
                phone,
                email,
                address,
                localGovernment,
                city,
                state,
                isVerified: true,
                userVerification: {
                    connect: {
                        id: userVerify?.id || user.userVerification?.id,
                    },
                },
            },
        });

        if (
            user.userVerification?.bankVerification?.isVerified &&
            user.userVerification?.identityVerification?.isVerified &&
            user.userVerification?.proofOfAddress?.isVerified
        ) {
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                },
            });
        }

        return kinDetails;
    }

    async getAllTransactions(userId: string): Promise<Transaction[] | null> {
        const userAcc = await prisma.userAccount.findUnique({
            where: { userId },
            select: {
                transactions: true,
            },
        });

        const transactions = userAcc?.transactions as Transaction[];

        if (!transactions) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'No transactions found for this user'
            );
        }

        return transactions;
    }

    async getTransactionById(id: string): Promise<Transaction | null> {
        const transaction = await prisma.transaction.findUnique({
            where: {
                id,
            },
        });

        if (!transaction) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'Transaction not found'
            );
        }

        return transaction;
    }

    async addCard(input: TAddCardInput, userId: string): Promise<Card | null> {
        const { cardNumber, expiryDate, cardHolderName, cvv } = input;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        const userAcc = await prisma.userAccount.findUnique({
            where: { userId },
        });

        if (!user) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'User not found');
        }

        if (!userAcc) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'User Account not found'
            );
        }

        // logic to validate card details

        const card = await prisma.card.create({
            data: {
                cardNumber,
                expiryDate,
                cardHolderName,
                cvv,
                userAccount: {
                    connect: {
                        id: userAcc.id,
                    },
                },
            },
        });

        return card;
    }

    async removeCard(id: string): Promise<object> {
        const card = await prisma.card.findUnique({
            where: {
                id,
            },
        });

        if (!card) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'card not found');
        }

        await prisma.card.delete({
            where: {
                id,
            },
        });

        return {};
    }

    async getAllCards(userId: string): Promise<Card[] | null> {
        const userAcc = await prisma.userAccount.findUnique({
            where: { userId },
            select: {
                cards: true,
            },
        });

        const cards = userAcc?.cards as Card[];

        if (!cards) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'No cards found for this user'
            );
        }

        return cards;
    }

    async addMoneyUsingCard(
        userId: string,
        cardId: string,
        input: TAddMoneyInput
    ): Promise<Transaction> {
        const { amount } = input;

        const card = await prisma.card.findUnique({
            where: {
                id: cardId,
            },
        });

        if (!card) {
            throw new HandleApiError(errorNames.NOT_FOUND, httpStatus.NOT_FOUND, 'Card not found');
        }

        // Add logic to process the payment using the card via a payment gateway

        // If the payment is successful, create a transaction record

        const userAcc = await prisma.userAccount.findUnique({
            where: { userId },
        });

        const presentAmount = userAcc?.amount;
        const newAmt = (presentAmount as number) + amount;

        const addAmt = await prisma.userAccount.update({
            where: { id: userAcc?.id },
            data: {
                amount: newAmt,
            },
        });

        console.log(addAmt);

        const transaction = await prisma.transaction.create({
            data: {
                amount,
                transactionType: 'Credit',
                status: 'Success',
                accountName: 'ABC',
                bankName: 'ABC',
                bankAccount: '1234',
                narration: 'Card',
                sessionId: randomUUID(),
                transactionId: randomUUID(),
                userAccount: {
                    connect: {
                        id: userAcc?.id,
                    },
                },
            },
        });

        return transaction;
    }

    async getPersonalDashboardData(userId: string): Promise<object> {
        const userVer = await prisma.userVerification.findUnique({
            where: {
                userId,
            },
            select: {
                bankVerification: {
                    select: {
                        isVerified: true,
                    },
                },
                identityVerification: {
                    select: {
                        isVerified: true,
                    },
                },
                proofOfAddress: {
                    select: {
                        isVerified: true,
                    },
                },
                nextOfKin: {
                    select: {
                        isVerified: true,
                    },
                },
            },
        });

        const ver = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        const userAcc = await prisma.userAccount.findUnique({
            where: {
                userId,
            },
        });

        // const bvnApiUrl = 'http://154.113.16.142:8882/postingrest/GetProvidusAccount' as string;

        // const response = await axios.post(bvnApiUrl, {
        //     accountNumber: userAcc?.accountNumber,
        //     userName: 'test',
        //     password: 'test',
        // });

        return {
            userVerification: ver?.isVerified || false,
            bankVerification: userVer?.bankVerification?.isVerified || false,
            identityVerification: userVer?.identityVerification?.isVerified || false,
            proofOfAddress: userVer?.proofOfAddress?.isVerified || false,
            nextOfKin: userVer?.nextOfKin?.isVerified || false,
            transactionPin: !!userAcc?.transactionPin,
            availableBalance: 45000.57,
            rentFinance: 18000.32,
            pillaSavings: 70000.95,
        };
    }

    async setTransactionPin(input: TTransactionPinInput, userId: string): Promise<object> {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new HandleApiError(
                errorNames.NOT_FOUND,
                httpStatus.NOT_FOUND,
                'user not found !'
            );
        }

        if (input.pin !== input.confirmPin) {
            throw new HandleApiError(
                errorNames.CONFLICT,
                httpStatus.CONFLICT,
                'Pin and Confirm Pin must be the same'
            );
        }

        await prisma.userAccount.update({
            where: {
                userId,
            },
            data: {
                transactionPin: input.pin,
            },
        });

        return {};
    }
}
