import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import Container from '../../components/Container';
import firestore from '@react-native-firebase/firestore';
import {FlatList} from 'react-native';
import RowComponent from '../../components/RowComponent';
import TextComponent from '../../components/TextComponent';
import SectionComponent from '../../components/SectionComponent';
import ButtonComponent from '../../components/ButtonComponent';
import SpaceComponent from '../../components/SpaceComponent';

interface AudioModel {
  title: string;
  description: string;
  audioURL: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt: FirebaseFirestoreTypes.Timestamp;
}

const HomeScreen = ({navigation}: any) => {
  const [audios, setAudios] = useState<AudioModel[]>([]);

  useEffect(() => {
    firestore()
      .collection('audios')
      .onSnapshot(snap => {
        if (snap.empty) {
          console.log(`Audio not found!!!`);
        } else {
          const items: AudioModel[] = [];

          snap.forEach((item: any) => {
            items.push({
              id: item.id,
              ...item.data(),
            });
          });

          setAudios(items);
        }
      });
  }, []);

  return (
    <Container title="Audios">
      <FlatList
        data={audios}
        renderItem={({item}) => (
          <RowComponent>
            <TextComponent text={item.title} />
          </RowComponent>
        )}
        ListFooterComponent={
          audios.length > 0 ? (
            <ButtonComponent
              text="Add new"
              onPress={() => navigation.navigate('AddNewAudio')}
              color="white"
            />
          ) : null
        }
        ListEmptyComponent={
          <SectionComponent
            styles={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TextComponent text="Audio not found!!!" />
            <SpaceComponent height={16} />
            <ButtonComponent
              text="Add new"
              onPress={() => navigation.navigate('AddNewAudio')}
              color="white"
            />
          </SectionComponent>
        }
      />
    </Container>
  );
};

export default HomeScreen;
