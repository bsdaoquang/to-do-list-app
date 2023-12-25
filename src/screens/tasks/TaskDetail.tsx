import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import TextComponent from '../../components/TextComponent';
import {TaskModel} from '../../models/TaskModel';
import firestore from '@react-native-firebase/firestore';
import SectionComponent from '../../components/SectionComponent';
import TitleComponent from '../../components/TitleComponent';
import RowComponent from '../../components/RowComponent';
import {
  Alarm,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  Watch,
} from 'iconsax-react-native';
import {colors} from '../../constants/colors';
import SpaceComponent from '../../components/SpaceComponent';
import AvatarGroup from '../../components/AvatarGroup';
import {HandleDateTime} from '../../utils/handeDateTime';

const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetail, setTaskDetail] = useState<TaskModel>();

  useEffect(() => {
    getTaskDetail();
  }, [id]);

  const getTaskDetail = () => [
    firestore()
      .doc(`tasks/${id}`)
      .onSnapshot((snap: any) => {
        if (snap.exists) {
          setTaskDetail({
            id,
            ...snap.data(),
          });
        }
      }),
  ];

  return taskDetail ? (
    <ScrollView style={{flex: 1}}>
      <StatusBar barStyle="light-content" />
      <SectionComponent
        color={color ?? 'rgba(113, 77, 217, 0.9)'}
        styles={{paddingTop: 60, paddingBottom: 18}}>
        <RowComponent styles={{alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft2
              size={28}
              color={colors.white}
              style={{marginTop: -8, marginRight: 12}}
            />
          </TouchableOpacity>
          <TitleComponent flex={1} text={taskDetail.title} size={22} />
        </RowComponent>
        <View style={{marginTop: 20}}>
          <TextComponent text="Due date" />
          <RowComponent>
            <RowComponent
              styles={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Clock size={20} color={colors.white} />
              <SpaceComponent width={12} />
              <TextComponent
                flex={0}
                text={`${HandleDateTime.GetHour(
                  taskDetail.start?.seconds as number,
                )} - ${HandleDateTime.GetHour(
                  taskDetail.end?.seconds as number,
                )}`}
                size={16}
              />
            </RowComponent>
            {taskDetail.dueDate && (
              <RowComponent
                styles={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CalendarEdit size={20} color={colors.white} />
                <SpaceComponent width={12} />

                <TextComponent
                  flex={0}
                  size={16}
                  text={HandleDateTime.DateString(taskDetail.dueDate?.seconds)}
                />
              </RowComponent>
            )}
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <AvatarGroup uids={taskDetail.uids} />
            </View>
          </RowComponent>
        </View>
      </SectionComponent>
    </ScrollView>
  ) : (
    <></>
  );
};

export default TaskDetail;
