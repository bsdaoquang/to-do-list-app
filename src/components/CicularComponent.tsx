import React from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';

interface Props {
  color?: string;
  value: number;
  maxValue?: number;
}

const CicularComponent = (props: Props) => {
  const {color, value, maxValue} = props;
  return <CircularProgress value={value} />;
};

export default CicularComponent;
