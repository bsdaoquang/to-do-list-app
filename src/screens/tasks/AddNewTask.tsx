import React, {useEffect, useState} from 'react';
import {Button, View} from 'react-native';
import Container from '../../components/Container';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import InputComponent from '../../components/InputComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import {TaskModel} from '../../models/TaskModel';
import DropdownPicker from '../../components/DropdownPicker';
import {SelectModel} from '../../models/SelectModel';
import firestore from '@react-native-firebase/firestore';
import ButtonComponent from '../../components/ButtonComponent';
import TitleComponent from '../../components/TitleComponent';
import {AttachSquare} from 'iconsax-react-native';
import {colors} from '../../constants/colors';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import TextComponent from '../../components/TextComponent';
import storage from '@react-native-firebase/storage';

const initValue: TaskModel = {
  title: '',
  desctiption: '',
  dueDate: undefined,
  start: undefined,
  end: undefined,
  uids: [],
  fileUrls: [],
};

const AddNewTask = ({navigation}: any) => {
  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);
  const [usersSelect, setUsersSelect] = useState<SelectModel[]>([]);
  const [attachments, setAttachments] = useState<DocumentPickerResponse[]>([]);
  const [attachmentsUrl, setAttachmentsUrl] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleGetAllUsers();
  }, []);

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
              label: item.data().name,
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
    const data = {
      ...taskDetail,
      fileUrls: attachmentsUrl,
    };

    await firestore()
      .collection('tasks')
      .add(data)
      .then(() => {
        console.log('New task added!!');
        navigation.goBack();
      })
      .catch(error => console.log(error));
  };

  const handlePickerDocument = () => {
    DocumentPicker.pick({})
      .then(res => {
        setAttachments(res);

        res.forEach(item => handleUploadFileToStorage(item));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleUploadFileToStorage = async (item: DocumentPickerResponse) => {
    const filename = item.name ?? `file${Date.now()}`;
    const path = `documents/${filename}`;
    const items = [...attachmentsUrl];

    await storage().ref(path).putFile(item.uri);

    await storage()
      .ref(path)
      .getDownloadURL()
      .then(url => {
        items.push(url);
        setAttachmentsUrl(items);
      })
      .catch(error => console.log(error));
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
          <RowComponent justify="flex-start" onPress={handlePickerDocument}>
            <TitleComponent text="Attachments" flex={0} />
            <SpaceComponent width={8} />
            <AttachSquare size={20} color={colors.white} />
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
        <ButtonComponent text="Save" onPress={handleAddNewTask} />
      </SectionComponent>
    </Container>
  );
};

export default AddNewTask;
