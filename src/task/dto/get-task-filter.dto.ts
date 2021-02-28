import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTaskFilterDto {
    @IsOptional() // Khi value === null | value === undefined thì bỏ qua không validate nữa
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}