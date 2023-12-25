import React, {ReactNode} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../constants/colors';

interface Props {
  children: ReactNode;
  styles?: StyleProp<ViewStyle>;
  color?: string;
}

const SectionComponent = (props: Props) => {
  const {children, styles, color} = props;

  return (
    <View
      style={[
        globalStyles.section,
        {backgroundColor: color ?? undefined},
        styles,
      ]}>
      {children}
    </View>
  );
};

export default SectionComponent;
