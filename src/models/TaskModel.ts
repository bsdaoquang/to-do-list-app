import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

export interface TaskModel {
  id?: string;
  title: string;
  desctiption: string;
  dueDate?: FirebaseFirestoreTypes.Timestamp;
  start?: FirebaseFirestoreTypes.Timestamp;
  end?: FirebaseFirestoreTypes.Timestamp;
  uids: string[];
  color?: string;
  fileUrls: string[];
  progress?: number;
}
