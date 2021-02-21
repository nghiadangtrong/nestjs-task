import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './task.model';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
    constructor(private taskService: TaskService) {}

    @Get()
    get(@Query(ValidationPipe) filterDto: GetTaskFilterDto): Task[] {
        if(Object.keys(filterDto).length > 0) {
            return this.taskService.getTaskWithFilters(filterDto);
        } else { 
            return this.taskService.getAllTasks();
        }
    }

    @Get(':id')
    getTask(@Param('id') id: string ): Task {
        return this.taskService.getTaskById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto
    ): Task {
        return this.taskService.createTask(createTaskDto);
    }

    @Delete(':id')
    deleteTask (@Param('id') id: string) {
        return this.taskService.deleteTask(id);
    }

    @Patch(':id/status')
    updateTaskStatus (
        @Param('id') id: string,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus
    ): Task {
        return this.taskService.updateTaskStatus(id, status);
    }
}
