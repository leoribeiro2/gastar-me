import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { WalletsService } from './../wallets/wallets.service';
import { JwtAdminGuard } from './../auth/guards/jwt-admin-guard';
import { ApiUseTags, ApiUnauthorizedResponse, ApiOkResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUseTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly walletsService: WalletsService) {}

  @ApiOperation({ title: 'Get all wallets - ADMIN' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Retrieve all wallets' })
  @UseGuards(JwtAdminGuard)
  @Get('/wallets')
  async listWallets() {
    return this.walletsService.index();
  }

  @ApiOperation({ title: 'Delete one wallet - ADMIN' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized'})
  @ApiOkResponse({ description: 'Successful delete wallet' })
  @UseGuards(JwtAdminGuard)
  @Delete('/wallets/:id')
  async deleteWallet(@Param() params) {
    await this.walletsService.deleteWallet(params.id);
  }
}
