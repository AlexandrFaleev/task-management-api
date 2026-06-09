import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  //  === FOR ADMIN ===
  @Get('admin/all')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllTasks(){
    return this.tasksService.findAllTasks();
  }

  @Delete('admin/:id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  adminDeleteTask(
    @Param('id') id:string,
  ) {
    return this.tasksService.adminDeleteTask(
      +id,
    );
  }

  //  === FOR USER ===

  @Post()
  create(
    @Body() dto: CreateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.create(
      dto,
      req.user.id,
    );
  }

  @Get()
  findAll(@Req() req) {
    return this.tasksService.findAll(
      req.user.id,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.tasksService.findOne(
      +id,
      req.user.id,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.update(
      +id,
      dto,
      req.user.id,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    return this.tasksService.remove(
      +id,
      req.user.id,
    );
  }
}