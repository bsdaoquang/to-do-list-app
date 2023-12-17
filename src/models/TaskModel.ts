export interface TaskModel {
  title: string;
  desctiption: string;
  dueDate: string;
  start: string;
  end: string;
  uids: string[];
  color?: string;
  fileUrls: string[];
}
