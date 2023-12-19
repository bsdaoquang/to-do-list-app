import {
  View,
  Text,
  Modal,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SelectModel} from '../models/SelectModel';
import TitleComponent from './TitleComponent';
import RowComponent from './RowComponent';
import TextComponent from './TextComponent';
import {colors} from '../constants/colors';
import {
  ArrowDown2,
  Check,
  SearchNormal1,
  TickCircle,
} from 'iconsax-react-native';
import InputComponent from './InputComponent';
import ButtonComponent from './ButtonComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SpaceComponent from './SpaceComponent';

interface Props {
  items: SelectModel[];
  selected?: string[];
  onSelect: (val: string[]) => void;
  multible?: boolean;
  title?: string;
}

const DropdownPicker = (props: Props) => {
  const {title, items, selected, multible, onSelect} = props;
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState<SelectModel[]>([]);
  const [dataSelected, setDataSelected] = useState<string[]>(selected ?? []);

  useEffect(() => {
    if (!searchKey) {
      setResults([]);
    } else {
      const data = items.filter(element =>
        element.label.toLowerCase().includes(searchKey.toLowerCase()),
      );

      data.length > 0 && setResults(data);
    }
  }, [searchKey]);

  useEffect(() => {
    if (!multible) {
      dataSelected.length === 1 && handleConfirmSelect();
    }
  }, [multible, dataSelected]);

  useEffect(() => {
    isVisibleModal && selected && setDataSelected(selected);
  }, [isVisibleModal]);

  const handleSelectItem = (item: SelectModel) => {
    const data: string[] = [...dataSelected];

    const index = data.findIndex(element => element === item.value);

    if (index !== -1) {
      data.splice(index, 1);
    } else {
      data.push(item.value);
    }

    setDataSelected(data);
  };

  const handleConfirmSelect = () => {
    onSelect(dataSelected);
    setIsVisibleModal(false);
    setDataSelected([]);
  };

  const handleRemoveItem = (index: number) => {
    if (selected) {
      selected.splice(index, 1);

      onSelect(selected);
    }
  };

  const renderSeletedItem = (id: string, index: number) => {
    const item = items.find(element => id === element.value);

    return (
      item && (
        <RowComponent
          onPress={() => handleRemoveItem(index)}
          key={id}
          styles={{
            padding: 4,
            borderWidth: 0.5,
            borderColor: colors.gray2,
            borderRadius: 100,
            marginRight: 8,
            marginBottom: 8,
          }}>
          <TextComponent text={item.label} flex={0} />
          <SpaceComponent width={4} />
          <AntDesign name="close" color={colors.white} size={14} />
        </RowComponent>
      )
    );
  };

  return (
    <View>
      {title && <TitleComponent text={title} />}
      <RowComponent
        onPress={() => setIsVisibleModal(true)}
        styles={{
          paddingHorizontal: 10,
          paddingVertical: 16,
          borderRadius: 12,
          backgroundColor: colors.gray,
          marginTop: title ? 8 : 0,
        }}>
        <View style={{flex: 1}}>
          {selected && selected.length > 0 ? (
            <RowComponent styles={{flexWrap: 'wrap'}} justify="flex-start">
              {selected.map((id, index) => renderSeletedItem(id, index))}
            </RowComponent>
          ) : (
            <TextComponent text="Select" color={colors.gray2} flex={0} />
          )}
        </View>

        <ArrowDown2 size={20} color={colors.text} />
      </RowComponent>

      <Modal
        transparent
        animationType="slide"
        visible={isVisibleModal}
        style={{flex: 1}}
        statusBarTranslucent={false}>
        <View
          style={{
            flex: 1,
            padding: 20,
            paddingVertical: 60,
            backgroundColor: colors.bgColor,
          }}>
          <FlatList
            style={{
              flex: 1,
            }}
            ListHeaderComponent={
              <>
                <RowComponent styles={{}}>
                  <View style={{flex: 1, marginRight: 12}}>
                    <InputComponent
                      value={searchKey}
                      onChange={val => setSearchKey(val)}
                      prefix={<SearchNormal1 size={20} color={colors.gray2} />}
                      placeholder="Search..."
                      allowClear
                    />
                  </View>
                  <TouchableOpacity onPress={() => setIsVisibleModal(false)}>
                    <TextComponent text="Cancel" color="coral" flex={0} />
                  </TouchableOpacity>
                </RowComponent>
              </>
            }
            data={searchKey ? results : items}
            renderItem={({item}) => (
              <RowComponent
                onPress={() => handleSelectItem(item)}
                key={item.value}
                styles={{paddingVertical: 16}}>
                <TextComponent
                  text={item.label}
                  color={
                    dataSelected.includes(item.value) ? 'coral' : colors.text
                  }
                  size={16}
                />
                {dataSelected.includes(item.value) && (
                  <TickCircle size={22} color="coral" />
                )}
              </RowComponent>
            )}
          />
          <>
            <ButtonComponent text="Confirm" onPress={handleConfirmSelect} />
          </>
        </View>
      </Modal>
    </View>
  );
};

export default DropdownPicker;
