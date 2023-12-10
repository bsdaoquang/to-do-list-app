import React, {ReactNode} from 'react';
import {View} from 'react-native';
import {globalStyles} from '../styles/globalStyles';

interface Props {
  children: ReactNode;
}

const SectionComponent = (props: Props) => {
  const {children} = props;

  return <View style={[globalStyles.section]}>{children}</View>;
};

export default SectionComponent;
