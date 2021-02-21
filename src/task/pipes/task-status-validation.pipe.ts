import { PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ]

    transform(value: any, argumentMetadata: ArgumentMetadata): any {
        let status = value.toUpperCase();
        
        if (!this.isStatusValid(status)) {
            throw new BadRequestException(`${status} is not invalid status`);
        }

        return status;
    }

    private isStatusValid (status: any) {
        let index = this.allowedStatuses.indexOf(status);
        return index !== -1;
    }
}