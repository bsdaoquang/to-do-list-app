import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

interface Props {
  color?: string;
  value: number;
  maxValue?: number;
}

const CicularComponent = (props: Props) => {
  const {color, value, maxValue} = props;
  return (
    <CircularProgress
      value={value}
      title={`${value}%`}
      showProgressValue={false}
      activeStrokeColor={color ?? colors.blue}
      inActiveStrokeColor={'#3C444A'}
      titleColor={colors.text}
      titleFontSize={32}
      titleStyle={{
        fontFamily: fontFamilies.semiBold,
      }}
    />
  );
};

export default CicularComponent;
