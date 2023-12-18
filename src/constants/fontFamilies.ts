import {Platform} from 'react-native';

export const fontFamilies =
  Platform.OS === 'ios'
    ? {
        regular: 'normal',
        medium: '500',
        light: '300',
        semiBold: '600',
        bold: '700',
      }
    : {
        regular: 'NunitoSans_10pt-Regular',
        medium: 'NunitoSans_10pt-Medium',
        light: 'NunitoSans_10pt-Light',
        semiBold: 'NunitoSans_10pt-SemiBold',
        bold: 'NunitoSans_10pt-Bold',
      };
