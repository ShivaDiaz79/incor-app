export interface ScheduleGridSlot {
  time: string;
  schedules: {
    [officeId: string]: {
      doctorName: string;
      color: string;
      isReserved?: boolean;
      specialty?: string;
    };
  };
}

export interface ScheduleGridData {
  [day: string]: ScheduleGridSlot[];
}

export interface PrintableSchedule {
  floorName: string;
  offices: {
    id: string;
    name: string;
    number: number;
  }[];
  scheduleData: ScheduleGridData;
  generatedAt: Date;
  weekRange?: string;
}
