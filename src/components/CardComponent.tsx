import {View, Text, StyleProp, ViewStyle, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';
import {colors} from '../constants/colors';

interface Props {
  children: ReactNode;
  bgColor?: string;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const CardComponent = (props: Props) => {
  const {children, bgColor, styles, onPress} = props;

  return onPress ? (
    <TouchableOpacity
      onPress={onPress}
      style={[
        globalStyles.inputContainer,
        {padding: 12, backgroundColor: bgColor ?? colors.gray},
        styles,
      ]}>
      {children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        globalStyles.inputContainer,
        {padding: 12, backgroundColor: bgColor ?? colors.gray},
        styles,
      ]}>
      {children}
    </View>
  );
};

export default CardComponent;
