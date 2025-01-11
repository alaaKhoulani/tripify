import { PartialType } from "@nestjs/mapped-types"
import { CreateTripDTO } from "./create_trip.dto"

export class UpdateTripDTO extends PartialType(CreateTripDTO) { }