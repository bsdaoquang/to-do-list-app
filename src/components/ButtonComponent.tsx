import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {ReactNode} from 'react';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';

interface Props {
  text: string;
  icon?: ReactNode;
  onPress: () => void;
  color?: string;
  isLoading?: boolean;
}

const ButtonComponent = (props: Props) => {
  const {text, icon, onPress, color, isLoading} = props;

  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={onPress}
      style={{
        backgroundColor: color ? color : isLoading ? colors.gray2 : colors.blue,
        padding: 16,
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TextComponent
          text={text}
          flex={0}
          size={16}
          styles={{textTransform: 'uppercase'}}
        />
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
