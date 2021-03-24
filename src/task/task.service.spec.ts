import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TaskService } from './task.service';

const mockUser = {
    id: 12,
    username: 'name user'
}

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn()
})

describe('TaskService', () => {
    let taskService,
        taskRepository;

    beforeEach(async () => {
        let module = await Test.createTestingModule({
            providers: [
                TaskService,
                {
                    provide: TaskRepository,
                    useFactory: mockTaskRepository
                }
            ]
        }).compile();

        taskService = module.get<TaskService>(TaskService);
        taskRepository = module.get<TaskRepository>(TaskRepository);
    })

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            
            let filter: GetTaskFilterDto = {
                status: TaskStatus.OPEN,
                search: 'this is query'
            }
            let result = await taskService.getTasks(filter, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();

            expect(result).toEqual('some value');
        })
    })

    describe('getTaskById', () => {
        it('calls successfuly and return the task', async () => {
            let mockTask = {
                title: 'this is title', 
                description: 'this is description',
                status: TaskStatus.OPEN
            }
            taskRepository.findOne.mockResolvedValue(mockTask);

            let task = await taskService.getTaskById(1, mockUser);
            expect(mockTask).toEqual(task);
            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            })
        })

        it('throw error', async () => {
            let id = 2;
            taskRepository.findOne.mockResolvedValue(null); 
            expect(() => taskService.getTaskById(id, mockUser)).rejects.toThrow(new NotFoundException(`Task with ID "${id}" not found`));
        })
    })

    describe('createTask', () => {
        it('call taskRepository.create() and return task', async () => {
            taskRepository.createTask.mockResolvedValue('success');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            let createTaskDto: CreateTaskDto = {
                title: 'this is title',
                description: 'this is description'
            }
            let result = await taskService.createTask(createTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual('success');
        })
    })

    describe('deleteTask', () => {
        it('delete succes success', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await taskService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
        })

        it('delete throw error', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(taskService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    })

    describe('updateTask', () => {
        it('update success', async () => {
            let save = jest.fn().mockResolvedValue(true);
            taskService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            })

            expect(taskService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            let result = await taskService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
            expect(taskService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalledWith(); 
            expect(result.status).toEqual(TaskStatus.DONE);
        })
    })
})