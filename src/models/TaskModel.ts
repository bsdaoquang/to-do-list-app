export interface TaskModel {
  title: string;
  desctiption: string;
  dueDate: Date;
  start: Date;
  end: Date;
  uids: string[];
  color?: string;
  fileUrls: string[];
}
