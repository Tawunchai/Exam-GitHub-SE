export interface Vetdashboardinterface {
    ID: number;
    name: string;
    description: string;
    weight: number;
    height: number;
    birthplace: string;
    birthday: string; // ISO 8601 string for date representation
    picture: string;
    status: string;
    note: string;
    biological: string;  // เปลี่ยนจาก biological_id เป็น biological name
    behavior: string;
    genderanimal: string;
    employee: string;
}