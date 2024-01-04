import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import Container from '../components/Container';
import {NotificationModel} from '../models/NotificationModel';
import {FlatList, TouchableOpacity, View} from 'react-native';
import RowComponent from '../components/RowComponent';
import TitleComponent from '../components/TitleComponent';
import TextComponent from '../components/TextComponent';
import {HandleDateTime} from '../utils/handeDateTime';
import {fontFamilies} from '../constants/fontFamilies';
import {colors} from '../constants/colors';

const NotificationsScreen = ({navigation}: any) => {
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    const filter = firestore()
      .collection('notifications')
      .where('uid', '==', user?.uid);

    filter.onSnapshot(snap => {
      if (!snap.empty) {
        const items: NotificationModel[] = [];

        snap.forEach((item: any) => {
          items.push({
            id: item.id,
            ...item.data(),
          });
        });

        setNotifications(items.sort((a: any, b: any) => a.isRead - b.isRead));
      }
    });
  };

  const handleReadNotification = async ({
    id,
    isRead,
    taskId,
  }: {
    id: string;
    isRead: boolean;
    taskId: string;
  }) => {
    try {
      navigation.navigate('TaskDetail', {id: taskId});

      !isRead &&
        (await firestore().doc(`notifications/${id}`).update({isRead: true}));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container back title="Notifications">
      <FlatList
        showsVerticalScrollIndicator={false}
        data={notifications}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() =>
              handleReadNotification({
                id: item.id,
                taskId: item.taskId,
                isRead: item.isRead,
              })
            }
            style={{paddingHorizontal: 16, paddingBottom: 16}}>
            <TextComponent
              text={item.title}
              color={item.isRead ? colors.gray2 : colors.text}
              font={item.isRead ? fontFamilies.regular : fontFamilies.bold}
            />
            <TextComponent text={item.body} size={12} />
            <TextComponent
              text={HandleDateTime.DateString(new Date(item.createdAt))}
              size={12}
            />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

export default NotificationsScreen;
