import {View, Text} from 'react-native';
import React, {Children, ReactNode} from 'react';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
}

const SectionComponent = (props: Props) => {
  const {children} = props;

  return <View style={[globalStyles.section]}>{children}</View>;
};

export default SectionComponent;
