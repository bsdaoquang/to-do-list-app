import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Container from '../components/Container';
import SectionComponent from '../components/SectionComponent';
import {DocumentPickerResponse} from 'react-native-document-picker';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponent';
import RowComponent from '../components/RowComponent';
import TextComponent from '../components/TextComponent';
import {AttachSquare} from 'iconsax-react-native';
import {colors} from '../constants/colors';
import SpaceComponent from '../components/SpaceComponent';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {calcFileSize} from '../utils/calcFileSize';
import firestore from '@react-native-firebase/firestore';

const initValues = {
  title: '',
  description: '',
};
const AddNewAudio = () => {
  const [formData, setFormData] = useState(initValues);
  const [selectedFile, setSelectedFile] = useState<DocumentPickerResponse>();
  const [isUploading, setIsUploading] = useState(false);
  const [fileTransfered, setFileTransfered] = useState(0);

  const updateFromData = (key: string, value: string) => {
    const data: any = {...formData};
    data[`${key}`] = value;

    setFormData(data);
  };

  const getFilePath = async (file: DocumentPickerResponse) => {
    return ``;
  };

  const handleUploadAudio = async () => {
    if (formData.title && selectedFile) {
      const filename = selectedFile.name;
      const path = `audios/${filename}`;

      const res = storage().ref(path).putFile(selectedFile.uri);

      res.on('state_changed', snap => {
        setFileTransfered(snap.bytesTransferred);
      });

      res.catch(error => {
        console.log(error);
      });

      res.then(() => {
        storage()
          .ref(path)
          .getDownloadURL()
          .then(async url => {
            const data = {
              ...formData,
              audioUrl: url,
              createdAt: firestore.FieldValue.serverTimestamp(),
              updatedAt: firestore.FieldValue.serverTimestamp(),
            };

            await firestore()
              .collection('audios')
              .add(data)
              .then(() => {
                console.log('Update successfully!!!');
              });
          });
      });
    } else {
      Alert.alert('', 'File audio is missing!!!');
    }
  };

  return (
    <Container title="Add new audio">
      <SectionComponent>
        <InputComponent
          value={formData.title}
          onChange={val => updateFromData('title', val)}
          placeholder="Title"
          allowClear
        />
        <InputComponent
          value={formData.description}
          onChange={val => updateFromData('description', val)}
          placeholder="Description"
          multible
          numberOfLine={3}
          allowClear
        />
        <RowComponent
          onPress={() =>
            DocumentPicker.pick({
              allowMultiSelection: false,
              type: [DocumentPicker.types.audio],
            })
              .then(files => {
                files && files.length > 0 && setSelectedFile(files[0]);
              })
              .catch(error => {
                console.log(error);
              })
          }>
          <AttachSquare size={18} color={colors.text} />
          <SpaceComponent width={8} />
          <TextComponent text="Audio file" />
        </RowComponent>

        {selectedFile && (
          <RowComponent styles={{paddingVertical: 12}}>
            <View style={{flex: 1}}>
              <TextComponent text={selectedFile.name ?? ''} flex={0} />
              <TextComponent
                text={calcFileSize(selectedFile.size ?? 0)}
                size={12}
                color={colors.gray2}
                flex={0}
              />
            </View>
            <TouchableOpacity onPress={() => setSelectedFile(undefined)}>
              <AntDesign name="close" color={colors.error} size={20} />
            </TouchableOpacity>
          </RowComponent>
        )}
      </SectionComponent>
      <SectionComponent>
        <ButtonComponent
          onPress={handleUploadAudio}
          text="Upload"
          color="coral"
        />
      </SectionComponent>
    </Container>
  );
};

export default AddNewAudio;
