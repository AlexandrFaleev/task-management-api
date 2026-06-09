import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
  ) {}
  //  ===FOR ADMIN===
  
  async findAllTasks() {
  return this.prisma.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        completed: true,
        createdAt: true,
        userId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async adminDeleteTask(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  //  ===FOR USER===
  
  create(
    dto: any,
    userId: number,
  ) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(
    id: number,
    userId: number,
  ) {
    const task =
      await this.prisma.task.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!task)
      throw new NotFoundException(
        'Task not found',
      );

    return task;
  }

  async update(
    id: number,
    dto: any,
    userId: number,
  ) {
    await this.findOne(id, userId);

    return this.prisma.task.update({
      where: { id },
      data: dto,
    });
  }

  async remove(
    id: number,
    userId: number,
  ) {
    await this.findOne(id, userId);

    return this.prisma.task.delete({
      where: { id },
    });
  }
}