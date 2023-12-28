import {Slider} from '@miblanchard/react-native-slider';
import firestore from '@react-native-firebase/firestore';
import {
  AddSquare,
  ArrowLeft2,
  CalendarEdit,
  Clock,
  DocumentCloud,
  TickCircle,
} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AvatarGroup from '../../components/AvatarGroup';
import CardComponent from '../../components/CardComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import {Attachment, TaskModel} from '../../models/TaskModel';
import {globalStyles} from '../../styles/globalStyles';
import {HandleDateTime} from '../../utils/handeDateTime';
import ButtonComponent from '../../components/ButtonComponent';
import UploadFileComponent from '../../components/UploadFileComponent';
import {calcFileSize} from '../../utils/calcFileSize';

const TaskDetail = ({navigation, route}: any) => {
  const {id, color}: {id: string; color?: string} = route.params;
  const [taskDetail, setTaskDetail] = useState<TaskModel>();
  const [progress, setProgress] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [subTasks, setSubTasks] = useState<any[]>([]);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    getTaskDetail();
  }, [id]);

  useEffect(() => {
    if (taskDetail) {
      setProgress(taskDetail.progress ?? 0);
      setAttachments(taskDetail.attachments);
    }
  }, [taskDetail]);

  useEffect(() => {
    if (
      progress !== taskDetail?.progress ||
      attachments.length !== taskDetail.attachments.length
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [progress, taskDetail, attachments]);

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

  const handleUpdateTask = async () => {
    const data = {...taskDetail, progress, attachments, updatedAt: Date.now()};

    await firestore()
      .doc(`tasks/${id}`)
      .update(data)
      .then(() => {
        Alert.alert('Task updated');
      })
      .catch(error => console.log(error));
  };

  return taskDetail ? (
    <>
      <ScrollView style={{flex: 1, backgroundColor: colors.bgColor}}>
        <StatusBar hidden />
        <SectionComponent
          color={color ?? 'rgba(113, 77, 217, 0.9)'}
          styles={{
            paddingTop: 60,
            paddingBottom: 18,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
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
            <RowComponent styles={{justifyContent: 'space-between'}}>
              <RowComponent
                styles={{
                  flex: 1,
                  justifyContent: 'flex-start',
                }}>
                <Clock size={20} color={colors.white} />
                <SpaceComponent width={4} />
                {taskDetail.end && taskDetail.start && (
                  <TextComponent
                    flex={0}
                    text={`${HandleDateTime.GetHour(
                      taskDetail.start?.toDate(),
                    )} - ${HandleDateTime.GetHour(taskDetail.end?.toDate())}`}
                  />
                )}
              </RowComponent>
              {taskDetail.dueDate && (
                <RowComponent
                  styles={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CalendarEdit size={20} color={colors.white} />
                  <SpaceComponent width={4} />

                  <TextComponent
                    flex={0}
                    text={
                      HandleDateTime.DateString(taskDetail.dueDate.toDate()) ??
                      ''
                    }
                  />
                </RowComponent>
              )}
              <View
                style={{
                  flex: 1,

                  alignItems: 'flex-end',
                }}>
                <AvatarGroup uids={taskDetail.uids} />
              </View>
            </RowComponent>
          </View>
        </SectionComponent>
        <SectionComponent>
          <TitleComponent text="Description" size={22} />
          <CardComponent
            bgColor={colors.bgColor}
            styles={{
              borderWidth: 1,
              borderColor: colors.gray,
              borderRadius: 12,
              marginTop: 12,
            }}>
            <TextComponent
              text={taskDetail.desctiption}
              styles={{textAlign: 'justify'}}
            />
          </CardComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <TitleComponent text="Files & Links" flex={1} />
            <UploadFileComponent
              onUpload={file => file && setAttachments([...attachments, file])}
            />
          </RowComponent>
          {attachments.map((item, index) => (
            <View
              style={{justifyContent: 'flex-start', marginBottom: 8}}
              key={`attachment${index}`}>
              <TextComponent flex={0} text={item.name} />
              <TextComponent
                flex={0}
                text={calcFileSize(item.size)}
                size={12}
              />
            </View>
          ))}
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: colors.success,
                marginRight: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.success,
                  width: 16,
                  height: 16,
                  borderRadius: 100,
                }}
              />
            </View>
            <TextComponent
              flex={1}
              text="Progress"
              font={fontFamilies.medium}
              size={18}
            />
          </RowComponent>
          <SpaceComponent height={12} />
          <RowComponent>
            <View style={{flex: 1}}>
              <Slider
                value={progress}
                onValueChange={val => setProgress(val[0])}
                thumbTintColor={colors.success}
                thumbStyle={{
                  borderWidth: 2,
                  borderColor: colors.white,
                }}
                maximumTrackTintColor={colors.gray2}
                minimumTrackTintColor={colors.success}
                trackStyle={{height: 10, borderRadius: 100}}
              />
            </View>
            <SpaceComponent width={20} />
            <TextComponent
              text={`${Math.floor(progress * 100)}%`}
              font={fontFamilies.bold}
              size={18}
              flex={0}
            />
          </RowComponent>
        </SectionComponent>
        <SectionComponent>
          <RowComponent>
            <TitleComponent flex={1} text="Sub tasks" size={20} />
            <TouchableOpacity>
              <AddSquare size={24} color={colors.success} variant="Bold" />
            </TouchableOpacity>
          </RowComponent>
          <SpaceComponent height={12} />
          {/* {Array.from({length: 3}).map((item, index) => (
            <CardComponent key={`subtask${index}`} styles={{marginBottom: 12}}>
              <RowComponent>
                <TickCircle variant="Bold" color={colors.success} size={22} />
                <SpaceComponent width={8} />
                <TextComponent text="fafa" />
              </RowComponent>
            </CardComponent>
          ))} */}
        </SectionComponent>
      </ScrollView>
      {isChanged && (
        <View
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            left: 20,
          }}>
          <ButtonComponent text="Update" onPress={handleUpdateTask} />
        </View>
      )}
    </>
  ) : (
    <></>
  );
};

export default TaskDetail;
