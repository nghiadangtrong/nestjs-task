import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TaskService {
    private tasks: Task[] = [];

    getAllTasks (): Task[] {
        return this.tasks;
    }

    getTaskWithFilters (filterDto: GetTaskFilterDto): Task[] {
        let { status, search } = filterDto;
        let tasks = this.getAllTasks();

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(task => (task.title.includes(search) || task.description.includes(search)));
        }

        return tasks;
    }

    getTaskById (id: string) {
        let task = this.tasks.find(task => task.id === id);
        
        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }

    createTask (createTaskDto: CreateTaskDto): Task {
        let { title, description } = createTaskDto;
        let task: Task = {
            id: uuid.v1(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task);

        return task;
    }

    deleteTask (id: string) {
        let found = this.getTaskById(id);
        return this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    updateTaskStatus (id: string, status: TaskStatus) {
        let task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
