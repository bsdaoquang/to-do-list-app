import {View, Text, StyleProp, TextStyle, Platform} from 'react-native';
import React from 'react';
import {globalStyles} from '../styles/globalStyles';
import {fontFamilies} from '../constants/fontFamilies';
import {colors} from '../constants/colors';

interface Props {
  text: string;
  size?: number;
  font?: string;
  color?: string;
  flex?: number;
  styles?: StyleProp<TextStyle>;
  line?: number;
}

const TextComponent = (props: Props) => {
  const {text, font, size, color, flex, styles, line} = props;
  const weight: any =
    Platform.OS === 'ios'
      ? font
        ? {
            fontWeight: font,
          }
        : {fontWeight: fontFamilies.regular}
      : {};
  return (
    <Text
      numberOfLines={line}
      style={[
        globalStyles.text,
        weight,
        {
          flex: flex ?? 1,
          fontFamily: font ?? fontFamilies.regular,
          fontSize: size ?? 14,
          color: color ?? colors.desc,
        },
        styles,
      ]}>
      {text}
    </Text>
  );
};

export default TextComponent;
