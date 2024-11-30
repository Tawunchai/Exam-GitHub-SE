import { EmployeeInterface } from "../interface/IEmployee"
import { VehicleTypeInterface } from "../interface/IVehicleType"

export interface VehicleInterface {
    ID?: number;
    Name?: string;
    Price?: number;
    QuantityVehicle?: number;
    ReceivedDate?: string;
    Picture?: string;
    AvaliabilityStatus?: string;
    VehicleType?: VehicleTypeInterface;
    Employee?: EmployeeInterface;
  }