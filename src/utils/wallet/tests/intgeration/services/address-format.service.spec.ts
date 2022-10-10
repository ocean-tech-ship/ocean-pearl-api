import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../../../app.module';
import { WalletUtilsModule } from '../../../wallet-utils.module';
import { AddressFormatService } from '../../../services/address-format.service';

describe('AddressFormatService', () => {
    let module: TestingModule;
    let service: AddressFormatService;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [AppModule, WalletUtilsModule],
        }).compile();

        service = module.get<AddressFormatService>(AddressFormatService);
    });

    afterAll(async () => {
        await module.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should properly format address', () => {
        const address = '0x5F872838E803a04591B73a9C639A1D195f781299';
        const result = service.execute(address.toLowerCase());
        expect(result).toBe(address);
    });
});
