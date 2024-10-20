import { Request, Response, Router } from 'express';
import { asyncHandler, roleVerifier, zodValidator } from '../../../shared';
import { UtilityBillModules } from './utilityBill.modules';
import { sendNotificationToUser } from '../../../shared/socket/utility/notification';

const router = Router();
const UtilityBillsModules = new UtilityBillModules();
const { getCategories, getBillsByCategory, getBillFields } =
    UtilityBillsModules.utilityBillsControllers;

router.get(
    '/get-categories',
    asyncHandler(getCategories.bind(UtilityBillsModules.utilityBillsControllers))
);
router.get(
    '/get-bills-by-category/:categoryId',
    asyncHandler(getBillsByCategory.bind(UtilityBillsModules.utilityBillsControllers))
);
router.get(
    '/get-bill-fields/:billId',
    asyncHandler(getBillFields.bind(UtilityBillsModules.utilityBillsControllers))
);
router.get('/test-notification', async (req: Request, res: Response) => {
    await sendNotificationToUser('jotat14676@adosnan.com', {
        title: 'test hello',
        message: 'hello this is testing',
    });
    res.status(200).json({
        status: 'success',
        message: 'Notification sent successfully',
    });
});

export const utilityBillRoutes = router;
