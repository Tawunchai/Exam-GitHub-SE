import { RcFile } from "antd/es/upload/interface";

export interface ReviewInterface {
    ID?: number;
    Rating?: number;
    Comment?: string;
    ReviewDate?: Date;
    Picture?: RcFile | undefined;  
    UserID?: number; 
  }