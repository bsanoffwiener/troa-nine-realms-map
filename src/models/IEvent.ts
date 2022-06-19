export interface IEvent {
    Name: string;
    CustomData?: string;
    X: number;
    Y: number;
    Z: number;
    ValidDays?: number[];
    StartTime?: Date;
    EndTime?: Date;
}
