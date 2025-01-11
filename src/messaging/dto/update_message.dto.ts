import { PartialType } from "@nestjs/mapped-types";
import { CreateMessageDTO } from "./create_message.dto";

export class UpdateMessageDto extends PartialType(CreateMessageDTO) { }