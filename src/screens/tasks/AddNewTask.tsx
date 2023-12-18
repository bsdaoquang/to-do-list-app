import React, {useState} from 'react';
import {Button, View} from 'react-native';
import Container from '../../components/Container';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import InputComponent from '../../components/InputComponent';
import RowComponent from '../../components/RowComponent';
import SectionComponent from '../../components/SectionComponent';
import SpaceComponent from '../../components/SpaceComponent';
import {TaskModel} from '../../models/TaskModel';

const initValue: TaskModel = {
  title: '',
  desctiption: '',
  dueDate: new Date(),
  start: new Date(),
  end: new Date(),
  uids: [],
  fileUrls: [],
};

const AddNewTask = ({navigation}: any) => {
  const [taskDetail, setTaskDetail] = useState<TaskModel>(initValue);

  const handleChangeValue = (id: string, value: string | Date) => {
    const item: any = {...taskDetail};

    item[`${id}`] = value;

    setTaskDetail(item);
  };

  const handleAddNewTask = async () => {
    console.log(taskDetail);
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
      </SectionComponent>
      <SectionComponent>
        <Button title="Save" onPress={handleAddNewTask} />
      </SectionComponent>
    </Container>
  );
};

export default AddNewTask;
