import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskRepository } from './task.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateKeyInput } from 'crypto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskModule } from './task.module';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks (filterDto: GetTaskFilterDto) : Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto);
    }

    async getTaskById (id: number): Promise<Task> {
        let task = await this.taskRepository.findOne(id);

        if(!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`); 
        }

        return task;
    }

    async createTask (createTaskDto: CreateTaskDto): Promise<Task> {
        let { title, description } = createTaskDto;

        return await this.taskRepository.createTask(title, description);
    } 
    
    async deleteTask (id: number): Promise<void> {
        let found = await this.taskRepository.delete(id);

        // Không có phần tử được xóa
        if (found.affected === 0) {
            throw new NotFoundException(`Task with id "${id}" not found`);
        }
    }

    async updateTaskStatus (id: number, status: TaskStatus): Promise<Task>{
        let task = await this.getTaskById(id);
        task.status = status;
        task.save();
        return task;
    }
}
