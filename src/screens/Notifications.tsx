import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NotificationModel} from '../models/NotificationModel';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Container from '../components/Container';
import TextComponent from '../components/TextComponent';
import {HandleDateTime} from '../utils/handeDateTime';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

const Notifications = ({navigation}: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    setIsLoading(true);
    try {
      firestore()
        .collection('notifications')
        .where('uid', '==', user?.uid)
        .onSnapshot(snap => {
          if (!snap.empty) {
            const items: NotificationModel[] = [];

            snap.forEach((item: any) => {
              items.push({
                id: item.id,
                ...item.data(),
              });
            });

            setNotifications(
              items.sort((a: any, b: any) => a.isRead - b.isRead),
            );
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleReadNotification = (item: NotificationModel) => {
    firestore()
      .doc(`notifications/${item.id}`)
      .update({
        isRead: true,
      })
      .then(() => {
        navigation.navigate('TaskDetail', {id: item.taskId});
      });
  };

  return (
    <Container back title="Notifications">
      <FlatList
        data={notifications}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleReadNotification(item)}
            style={{marginBottom: 18, paddingHorizontal: 16}}>
            <TextComponent
              text={item.title}
              size={18}
              color={item.isRead ? colors.gray2 : colors.text}
              font={item.isRead ? fontFamilies.regular : fontFamilies.bold}
            />
            <TextComponent text={item.body} color={colors.gray2} />
            <TextComponent
              text={HandleDateTime.DateString(new Date(item.createdAt))}
              size={12}
              color={colors.gray2}
            />
          </TouchableOpacity>
        )}
      />
    </Container>
  );
};

export default Notifications;
