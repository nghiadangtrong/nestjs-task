import { EntityRepository, Repository } from "typeorm";
import { GetTaskFilterDto } from "./dto/get-task-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> { 
    async getTasks (filterDto: GetTaskFilterDto) : Promise<Task[]> {
        let { status, search } = filterDto;
        let query = this.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        
        return await query.getMany();
    }

    createTask(title, description): Promise<Task> {
        let task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        return task.save();
    }
}