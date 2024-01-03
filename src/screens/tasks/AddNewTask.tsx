import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {Alert, Button, View} from 'react-native';
import ButtonComponent from '../../components/ButtonComponent';
import Container from '../../components/Container';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import DropdownPicker from '../../components/DropdownPicker';
import InputComponent from '../../components/InputComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import TextComponent from '../../components/TextComponent';
import UploadFileComponent from '../../components/UploadFileComponent';
import {fontFamilies} from '../../constants/fontFamilies';
import {SelectModel} from '../../models/SelectModel';
import {Attachment, TaskModel} from '../../models/TaskModel';
import auth from '@react-native-firebase/auth';
import {posts} from '../../data/posts';
import {HandleNotification} from '../../utils/handleNotification';

const initValue: TaskModel = {
  title: '',
  desctiption: '',
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  attachments: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isUrgent: false,
};

const AddNewTask = ({navigation, route}: any) => {
  const {editable, task}: {editable: boolean; task?: TaskModel} = route.params;

  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [usersSelect, setUsersSelect] = useState<SelectModel[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const user = auth().currentUser;

  useEffect(() => {
    handleGetAllUsers();
  }, []);

  useEffect(() => {
    user && setTaskDetail({...taskDetail, uids: [user.uid]});
  }, [user]);

  useEffect(() => {
    task &&
      setTaskDetail({
        ...taskDetail,
        title: task.title,
        desctiption: task.desctiption,
        uids: task.uids,
      });
  }, [task]);

  const handleGetAllUsers = async () => {
    await firestore()
      .collection('users')
      .get()
      .then(snap => {
        if (snap.empty) {
          console.log(`users data not found`);
        } else {
          const items: SelectModel[] = [];

          snap.forEach(item => {
            items.push({
              label: item.data().displayName,
              value: item.id,
            });
          });

          setUsersSelect(items);
        }
      })
      .catch((error: any) => {
        console.log(`Can not get users, ${error.message}`);
      });
  };

  const handleChangeValue = (id: string, value: string | string[] | Date) => {
    const item: any = {...taskDetail};

    item[`${id}`] = value;

    setTaskDetail(item);
  };

  const handleAddNewTask = async () => {
    if (user) {
      const data = {
        ...taskDetail,
        attachments,
        createdAt: task ? task.createdAt : Date.now(),
        updatedAt: Date.now(),
      };

      if (task) {
        await firestore()
          .doc(`tasks/${task.id}`)
          .update(data)
          .then(() => {
            if (usersSelect.length > 0) {
              usersSelect.forEach(member => {
                member.value !== user.uid &&
                  HandleNotification.SendNotification({
                    title: 'Update task',
                    body: `Your task updated by ${user?.email}`,
                    taskId: task?.id ?? '',
                    memberId: member.value,
                  });
              });
            }
            navigation.goBack();
          });
      } else {
        await firestore()
          .collection('tasks')
          .add(data)
          .then(snap => {
            if (usersSelect.length > 0) {
              usersSelect.forEach(member => {
                member.value !== user.uid &&
                  HandleNotification.SendNotification({
                    title: 'New task',
                    body: `You have a new task asign by ${user?.email}`,
                    taskId: snap.id,
                    memberId: member.value,
                  });
              });
            }
            navigation.goBack();
          })
          .catch(error => console.log(error));
      }
    } else {
      Alert.alert('You not login!!!');
    }
  };

  return (
    <Container back title="Add new task">
      <SectionComponent>
        <InputComponent
          value={taskDetail.title}
          onChange={val => handleChangeValue('title', val)}
          title="Title"
          allowClear
          placeholder="Title of task"
        />
        <InputComponent
          value={taskDetail.desctiption}
          onChange={val => handleChangeValue('desctiption', val)}
          title="Description"
          allowClear
          placeholder="Content"
          multible
          numberOfLine={3}
        />

        <DateTimePickerComponent
          selected={taskDetail.dueDate}
          onSelect={val => handleChangeValue('dueDate', val)}
          placeholder="Choice"
          type="date"
          title="Due date"
        />

        <RowComponent>
          <View style={{flex: 1}}>
            <DateTimePickerComponent
              selected={taskDetail.start}
              type="time"
              onSelect={val => handleChangeValue('start', val)}
              title="Start"
            />
          </View>
          <SpaceComponent width={14} />
          <View style={{flex: 1}}>
            <DateTimePickerComponent
              selected={taskDetail.end}
              onSelect={val => handleChangeValue('end', val)}
              title="End"
              type="time"
            />
          </View>
        </RowComponent>

        <DropdownPicker
          selected={taskDetail.uids}
          items={usersSelect}
          onSelect={val => handleChangeValue('uids', val)}
          title="Members"
          multible
        />

        <View>
          <RowComponent
            styles={{
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            <TextComponent
              text="Attachments"
              flex={0}
              font={fontFamilies.bold}
              size={16}
            />
            <SpaceComponent width={8} />
            <UploadFileComponent
              onUpload={file => file && setAttachments([...attachments, file])}
            />
          </RowComponent>
          {attachments.length > 0 &&
            attachments.map((item, index) => (
              <RowComponent
                key={`attachment${index}`}
                styles={{paddingVertical: 12}}>
                <TextComponent text={item.name ?? ''} />
              </RowComponent>
            ))}
        </View>
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          text={task ? 'Update' : 'Save'}
          onPress={handleAddNewTask}
        />
      </SectionComponent>
    </Container>
  );
};

export default AddNewTask;
