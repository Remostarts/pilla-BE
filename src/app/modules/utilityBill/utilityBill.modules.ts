import { UtilityBillService } from './utilityBill.services';
import { UtilityBillsController } from './utilityBill.controller';

export class UtilityBillModules {
    readonly utilityBillsService: UtilityBillService;

    readonly utilityBillsControllers: UtilityBillsController;

    constructor() {
        this.utilityBillsService = new UtilityBillService();
        this.utilityBillsControllers = new UtilityBillsController(this.utilityBillsService);
    }
}
