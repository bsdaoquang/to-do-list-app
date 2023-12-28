import {View, Text, TouchableOpacity, Modal, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Attachment} from '../models/TaskModel';
import {DocumentUpload} from 'iconsax-react-native';
import {colors} from '../constants/colors';
import DocumentPicker, {
  DocumentPickerResponse,
  DocumentPickerOptions,
} from 'react-native-document-picker';
import TextComponent from './TextComponent';
import {globalStyles} from '../styles/globalStyles';
import TitleComponent from './TitleComponent';
import SpaceComponent from './SpaceComponent';
import {calcFileSize} from '../utils/calcFileSize';
import {Slider} from '@miblanchard/react-native-slider';
import RowComponent from './RowComponent';
import storage from '@react-native-firebase/storage';

interface Props {
  onUpload: (file: Attachment) => void;
}

const UploadFileComponent = (props: Props) => {
  const {onUpload} = props;

  const [file, setfile] = useState<DocumentPickerResponse>();
  const [isVisibelModalUpload, setIsVisibelModalUpload] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);
  const [attachmentFile, setAttachmentFile] = useState<Attachment>();

  useEffect(() => {
    file && handleUploadFileToStorage();
  }, [file]);

  useEffect(() => {
    if (attachmentFile) {
      onUpload(attachmentFile);
      setIsVisibelModalUpload(false);
      setProgressUpload(0);
      setAttachmentFile(undefined);
    }
  }, [attachmentFile]);

  useEffect(() => {
    console.log(progressUpload);
  }, [progressUpload]);

  const handleUploadFileToStorage = () => {
    if (file) {
      setIsVisibelModalUpload(true);

      const path = `/documents/${file.name}`;

      const res = storage().ref(path).putFile(file.uri);

      res.on('state_changed', task => {
        setProgressUpload(task.bytesTransferred / task.totalBytes);
      });

      res.then(() => {
        storage()
          .ref(path)
          .getDownloadURL()
          .then(url => {
            const data: Attachment = {
              name: file.name ?? '',
              url,
              size: file.size ?? 0,
            };

            setAttachmentFile(data);
          });
      });

      res.catch(error => console.log(error.message));
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() =>
          DocumentPicker.pick({
            allowMultiSelection: false,
            type: [
              'application/pdf',
              DocumentPicker.types.doc,
              DocumentPicker.types.xls,
            ],
          })
            .then(res => {
              setfile(res[0]);
            })
            .catch(error => console.log(error))
        }>
        <DocumentUpload size={22} color={colors.white} />
      </TouchableOpacity>
      <Modal
        visible={isVisibelModalUpload}
        statusBarTranslucent
        animationType="slide"
        style={{flex: 1}}
        transparent>
        <View
          style={[
            globalStyles.container,
            {
              backgroundColor: `${colors.gray}80`,
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              width: Dimensions.get('window').width * 0.8,
              height: 'auto',
              padding: 12,
              backgroundColor: colors.white,
              borderRadius: 12,
            }}>
            <TitleComponent text="Uploading" color={colors.bgColor} flex={0} />
            <SpaceComponent height={12} />
            <View>
              <TextComponent
                color={colors.bgColor}
                text={file?.name ?? ''}
                flex={0}
              />
              <TextComponent
                color={colors.gray2}
                text={`${calcFileSize(file?.size as number)}`}
                size={12}
                flex={0}
              />
            </View>
            <RowComponent>
              <View style={{flex: 1, marginRight: 12}}>
                <Slider
                  disabled
                  value={progressUpload}
                  renderThumbComponent={() => null}
                  trackStyle={{
                    height: 6,
                    borderRadius: 100,
                  }}
                  minimumTrackTintColor={colors.success}
                  maximumTrackTintColor={colors.desc}
                />
              </View>
              <TextComponent
                text={`${Math.floor(progressUpload * 100)}%`}
                color={colors.bgColor}
                flex={0}
              />
            </RowComponent>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default UploadFileComponent;
