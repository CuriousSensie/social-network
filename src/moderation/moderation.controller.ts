import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { UpdatePostStatusDto } from '../posts/dto/update-post-status.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.MODERATOR)
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('posts')
  getUnbiasedPosts(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.moderationService.getUnbiasedPosts(paginationQueryDto);
  }

  @Patch('posts/:id/status')
  updatePostStatus(
    @Param('id') id: string,
    @Body() updatePostStatusDto: UpdatePostStatusDto,
  ) {
    return this.moderationService.updatePostStatus(id, updatePostStatusDto);
  }
}
