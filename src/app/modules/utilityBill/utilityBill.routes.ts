import { Router } from 'express';
import { asyncHandler, roleVerifier, zodValidator } from '../../../shared';
import { UtilityBillModules } from './utilityBill.modules';

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

export const utilityBillRoutes = router;
