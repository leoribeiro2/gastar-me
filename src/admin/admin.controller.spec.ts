import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { WalletsService } from './../wallets/wallets.service';
import { getModelToken } from '@nestjs/mongoose';

describe('Admin Controller', () => {
  let controller: AdminController;
  let walletsService: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: getModelToken('Wallet'),
          useValue: {},
        },
        WalletsService,
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    walletsService = module.get<WalletsService>(WalletsService);
  });

  it('should get wallets', async () => {
    jest.spyOn(walletsService, 'index').mockImplementation(async () => null);

    await controller.listWallets().then(() => {
      expect(walletsService.index).toBeCalled();
    });
  });

  it('should delete wallet', async () => {
    jest
      .spyOn(walletsService, 'deleteWallet')
      .mockImplementation(async () => null);

    const walletId = '5cc5375035cade6de3e47107';

    await controller.deleteWallet(walletId).then(() => {
      expect(walletsService.deleteWallet).toBeCalled();
    });
  });
});
