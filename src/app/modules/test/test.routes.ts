import { Router } from 'express';
import { TestModules } from './test.modules';
import { asyncHandler } from '../../../shared/helpers/asyncHandler';

const router = Router();
const testModules = new TestModules();

router.get('/tests', asyncHandler(testModules.testControllers.getTests.bind(testModules)));

export const testRoutes = router;
