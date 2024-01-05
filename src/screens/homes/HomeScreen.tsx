import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  Add,
  Edit2,
  Element4,
  Logout,
  Notification,
  SearchNormal1,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import AvatarGroup from '../../components/AvatarGroup';
import CardComponent from '../../components/CardComponent';
import CardImageConponent from '../../components/CardImageConponent';
import CicularComponent from '../../components/CicularComponent';
import Container from '../../components/Container';
import ProgressBarComponent from '../../components/ProgressBarComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TagComponent from '../../components/TagComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {TaskModel} from '../../models/TaskModel';
import {globalStyles} from '../../styles/globalStyles';
import {HandleDateTime} from '../../utils/handeDateTime';
import {monthNames} from '../../constants/appInfos';
import {add0ToNumber} from '../../utils/add0ToNumber';
import {HandleNotification} from '../../utils/handleNotification';
import messaging from '@react-native-firebase/messaging';
import {useIsFocused} from '@react-navigation/native';
import {NotificationModel} from '../../models/NotificationModel';

const date = new Date();

const HomeScreen = ({navigation}: any) => {
  const user = auth().currentUser;

  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<TaskModel[]>([]);
  const [urgentTask, setUrgentTask] = useState<TaskModel[]>([]);
  const [unReadNotifications, setUnReadNotifications] = useState<
    NotificationModel[]
  >([]);

  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused && handleGetUnReadNotifications();
  }, [isFocused]);

  useEffect(() => {
    getTasks();
    HandleNotification.checkNotificationPersion();

    messaging().onMessage(async message => {
      handleGetUnReadNotifications();
    });
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      const items = tasks.filter(element => element.isUrgent);

      setUrgentTask(items);
    }
  }, [tasks]);

  const getTasks = () => {
    setIsLoading(true);

    firestore()
      .collection('tasks')
      .where('uids', 'array-contains', user?.uid)
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log(`tasks not found!`);
        } else {
          const items: TaskModel[] = [];
          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });

          setTasks(items);
        }
        setIsLoading(false);
      });
  };

  const handleMoveToTaskDetail = (id?: string, color?: string) =>
    navigation.navigate('TaskDetail', {
      id,
      color,
    });

  const handleGetUnReadNotifications = () => {
    const filter = firestore()
      .collection('notifications')
      .where('uid', '==', user?.uid)
      .where('isRead', '==', false);

    try {
      filter.onSnapshot(snap => {
        if (snap.empty) {
          console.log('data not found!');
          setUnReadNotifications([]);
        } else {
          const items: NotificationModel[] = [];

          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });
          setUnReadNotifications(items);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Container isScroll>
        <SectionComponent>
          <RowComponent justify="space-between">
            <Element4 size={24} color={colors.desc} />
            <Notification size={24} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View style={{flex: 1}}>
              <TextComponent text={`hi, ${user?.email}`} />
              <TitleComponent text="Be Productive today" />
            </View>
            <TouchableOpacity onPress={async () => auth().signOut()}>
              <Logout size={22} color="coral" />
            </TouchableOpacity>
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent
            styles={[globalStyles.inputContainer]}
            onPress={() =>
              navigation.navigate('ListTasks', {
                tasks,
              })
            }>
            <TextComponent color="#696B6F" text="Search task" />
            <SearchNormal1 size={20} color={colors.desc} />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <CardComponent
            onPress={() =>
              navigation.navigate('ListTasks', {
                tasks,
              })
            }>
            <RowComponent>
              <View style={{flex: 1}}>
                <TitleComponent text="Task progress" />
                <TextComponent
                  text={`${
                    tasks.filter(
                      element => element.progress && element.progress === 1,
                    ).length
                  } /${tasks.length}`}
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
                {tasks.length > 0 && (
                  <CicularComponent
                    value={Math.floor(
                      (tasks.filter(
                        element => element.progress && element.progress === 1,
                      ).length /
                        tasks.length) *
                        100,
                    )}
                  />
                )}
              </View>
            </RowComponent>
          </CardComponent>
        </SectionComponent>
        {isLoading ? (
          <ActivityIndicator />
        ) : tasks.length > 0 ? (
          <SectionComponent>
            <RowComponent
              onPress={() =>
                navigation.navigate('ListTasks', {
                  tasks,
                })
              }
              justify="flex-end"
              styles={{
                marginBottom: 16,
              }}>
              <TextComponent size={16} text="See all" flex={0} />
            </RowComponent>
            <RowComponent styles={{alignItems: 'flex-start'}}>
              <View style={{flex: 1}}>
                {tasks[0] && (
                  <CardImageConponent
                    onPress={() =>
                      handleMoveToTaskDetail(tasks[0].id as string)
                    }>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddNewTask', {
                          editable: true,
                          task: tasks[0],
                        })
                      }
                      style={globalStyles.iconContainer}>
                      <Edit2 size={20} color={colors.white} />
                    </TouchableOpacity>

                    <TitleComponent text={tasks[0].title} />
                    <TextComponent
                      line={3}
                      text={tasks[0].desctiption}
                      size={13}
                    />

                    <View style={{marginVertical: 28}}>
                      <AvatarGroup uids={tasks[0].uids} />
                      {tasks[0].progress &&
                      (tasks[0].progress as number) >= 0 ? (
                        <ProgressBarComponent
                          percent={`${Math.floor(tasks[0].progress * 100)}%`}
                          color="#0AACFF"
                          size="large"
                        />
                      ) : null}
                    </View>
                    {tasks[0].dueDate && (
                      <TextComponent
                        text={`Due ${HandleDateTime.DateString(
                          tasks[0].dueDate.toDate(),
                        )}`}
                        size={12}
                        color={colors.desc}
                      />
                    )}
                  </CardImageConponent>
                )}
              </View>
              <SpaceComponent width={16} />
              <View style={{flex: 1}}>
                {tasks[1] && (
                  <CardImageConponent
                    onPress={() =>
                      handleMoveToTaskDetail(
                        tasks[1].id as string,
                        'rgba(33, 150, 243, 0.9)',
                      )
                    }
                    color="rgba(33, 150, 243, 0.9)">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddNewTask', {
                          editable: true,
                          task: tasks[1],
                        })
                      }
                      style={globalStyles.iconContainer}>
                      <Edit2 size={20} color={colors.white} />
                    </TouchableOpacity>
                    <TitleComponent text={tasks[1].title} size={18} />
                    {tasks[1].uids && <AvatarGroup uids={tasks[1].uids} />}
                    {tasks[1].progress ? (
                      <ProgressBarComponent
                        percent={`${Math.floor(tasks[1].progress * 100)}%`}
                        color="#A2F068"
                      />
                    ) : (
                      <></>
                    )}
                  </CardImageConponent>
                )}

                <SpaceComponent height={16} />
                {tasks[2] && (
                  <CardImageConponent
                    onPress={() =>
                      handleMoveToTaskDetail(
                        tasks[2].id as string,
                        'rgba(18, 181, 22, 0.9)',
                      )
                    }
                    color="rgba(18, 181, 22, 0.9)">
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('AddNewTask', {
                          editable: true,
                          task: tasks[2],
                        })
                      }
                      style={globalStyles.iconContainer}>
                      <Edit2 size={20} color={colors.white} />
                    </TouchableOpacity>
                    <TitleComponent text={tasks[2].title} />
                    <TextComponent
                      text={tasks[2].desctiption}
                      line={3}
                      size={13}
                    />
                  </CardImageConponent>
                )}
              </View>
            </RowComponent>
          </SectionComponent>
        ) : (
          <></>
        )}

        <SectionComponent>
          <TitleComponent
            flex={1}
            font={fontFamilies.bold}
            size={21}
            text="Urgents tasks"
          />
          {urgentTask.length > 0 &&
            urgentTask.map(item => (
              <CardComponent
                onPress={() => handleMoveToTaskDetail(item.id)}
                key={`urgentTask${item.id}`}
                styles={{marginBottom: 12}}>
                <RowComponent>
                  <CicularComponent
                    value={item.progress ? item.progress * 100 : 0}
                    radius={40}
                  />
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      paddingLeft: 12,
                    }}>
                    <TextComponent text={item.title} />
                  </View>
                </RowComponent>
              </CardComponent>
            ))}
        </SectionComponent>
      </Container>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('AddNewTask', {
              editable: false,
              task: undefined,
            })
          }
          style={[
            globalStyles.row,
            {
              backgroundColor: colors.blue,
              padding: 10,
              borderRadius: 12,
              paddingVertical: 14,
              width: '80%',
            },
          ]}>
          <TextComponent text="Add new tasks" flex={0} />
          <Add size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
