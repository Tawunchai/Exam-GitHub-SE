import { AnimalsInterface} from "./IAnimal"
import { EmployeeInterface} from "./IEmployee"

export interface ReportInterface {
    ID?: number;
    Title?: string;
    Description?: string;
    ReportDate?: string;
    Status?: string;
    StatusVet?: string;
    Picture?:string;
    AnimalID?: AnimalsInterface;
    EmployeeID?: EmployeeInterface;
}