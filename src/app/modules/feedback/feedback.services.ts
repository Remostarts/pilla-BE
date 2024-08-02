/* eslint-disable class-methods-use-this */
import { Feedback } from '@prisma/client';
import { prisma } from '../../../shared';
import { TFeedbackInput } from './feedback.types';

export class FeedbackServices {
    createFeedback = async (input: TFeedbackInput): Promise<Feedback | null> => {
        const { email, message, name } = input;

        const createdFeedback = await prisma.feedback.create({
            data: {
                email,
                message,
                name,
            },
        });
        return createdFeedback;
    };
}
