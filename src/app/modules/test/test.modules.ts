import { TestControllers } from './test.controllers';
import { TestServices } from './test.services';

export class TestModules {
    readonly testServices: TestServices;

    readonly testControllers: TestControllers;

    constructor() {
        this.testServices = new TestServices();
        this.testControllers = new TestControllers(this.testServices);
    }
}
