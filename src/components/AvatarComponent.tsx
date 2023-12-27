import {View, Text, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {colors} from '../constants/colors';
import {globalStyles} from '../styles/globalStyles';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  uid: string;
  index?: number;
}

const AvatarComponent = (props: Props) => {
  const {uid, index} = props;

  const [userDetail, setUserDetail] = useState<any>();

  useEffect(() => {
    firestore()
      .doc(`users/${uid}`)
      .get()
      .then((snap: any) => {
        snap.exists &&
          setUserDetail({
            uid,
            ...snap.data(),
          });
      })
      .catch(error => console.log(error));
  }, [uid]);
  const imageStyle = {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.white,
  };
  return userDetail ? (
    userDetail.imgUrl ? (
      <Image
        source={{uri: userDetail.imgUrl}}
        key={`image${uid}`}
        style={[imageStyle, {marginLeft: index && index > 0 ? -10 : 0}]}
      />
    ) : (
      <View
        key={`image${uid}`}
        style={[
          imageStyle,
          {
            marginLeft: index && index > 0 ? -10 : 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.gray2,
          },
        ]}>
        <Text
          style={[
            globalStyles.text,
            {fontFamily: fontFamilies.bold, fontSize: 14},
          ]}>
          {userDetail.name.substring(0, 1)}
        </Text>
      </View>
    )
  ) : (
    <></>
  );
};

export default AvatarComponent;
