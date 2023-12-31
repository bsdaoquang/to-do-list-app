import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import CardComponent from '../../../components/CardComponent';
import CicularComponent from '../../../components/CicularComponent';
import RowComponent from '../../../components/RowComponent';
import SectionComponent from '../../../components/SectionComponent';
import SpaceComponent from '../../../components/SpaceComponent';
import TagComponent from '../../../components/TagComponent';
import TextComponent from '../../../components/TextComponent';
import TitleComponent from '../../../components/TitleComponent';
import {TaskModel} from '../../../models/TaskModel';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {monthNames} from '../../../constants/appInfos';
import {add0ToNumber} from '../../../utils/add0ToNumber';

const date = new Date();

const TotalTasks = () => {
  const [tasks, settasks] = useState<TaskModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    user && getAllTasksByUser();
  }, []);

  const getAllTasksByUser = () => {
    const filter = firestore()
      .collection('tasks')
      .where('uids', 'array-contains', user?.uid);

    filter.onSnapshot(snap => {
      if (snap.empty) {
        console.log('Data not found!!');
      } else {
        const items: TaskModel[] = [];
        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data(),
          });
        });

        settasks(items);
      }
    });
  };

  return (
    <SectionComponent>
      <CardComponent>
        <RowComponent>
          <View style={{flex: 1}}>
            <TitleComponent text="Task progress" />
            <TextComponent
              text={`${
                tasks.filter(element => element.progress === 1).length
              }/${tasks.length} task done`}
            />
            <SpaceComponent height={12} />
            <RowComponent justify="flex-start">
              <TagComponent
                text={`${monthNames[date.getMonth()]} ${add0ToNumber(
                  date.getDate(),
                )}`}
              />
            </RowComponent>
          </View>
          <View>
            <CicularComponent
              value={Math.floor(
                (tasks.filter(element => element.progress === 1).length /
                  tasks.length) *
                  100,
              )}
            />
          </View>
        </RowComponent>
      </CardComponent>
    </SectionComponent>
  );
};

export default TotalTasks;
