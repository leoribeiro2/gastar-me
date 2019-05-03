import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { WalletsService } from './../wallets/wallets.service';
import { JwtAdminGuard } from './../auth/guards/jwt-admin-guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAdminGuard)
  @Get('/wallets')
  async listWallets() {
    return this.walletsService.index();
  }

  @UseGuards(JwtAdminGuard)
  @Delete('/wallets/:id')
  async deleteWallet(@Param() params) {
    await this.walletsService.deleteWallet(params.id);
  }
}
