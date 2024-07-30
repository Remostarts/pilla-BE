import { TestShared } from './test.shared';

export class TestServices {
    private shared = new TestShared();

    // constructor(readonly shared: TestShared) {}
    async getTests(): Promise<[string]> {
        const permission = await this.shared.getPermission();
        if (!permission) {
            throw new Error('no permission');
        }
        return ['test is working'];
    }
}
