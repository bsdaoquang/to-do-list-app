import {Lock, Sms} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import ButtonComponent from '../../components/ButtonComponent';
import Container from '../../components/Container';
import InputComponent from '../../components/InputComponent';
import SectionComponent from '../../components/SectionComponent';
import TitleComponent from '../../components/TitleComponent';
import {colors} from '../../constants/colors';
import {fontFamilies} from '../../constants/fontFamilies';
import SpaceComponent from '../../components/SpaceComponent';
import {globalStyles} from '../../styles/globalStyles';
import auth from '@react-native-firebase/auth';
import TextComponent from '../../components/TextComponent';

const SigninScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    if (email || password) {
      setErrorText('');
    }
  }, [email, password]);

  const handleSigninWithEmail = async () => {
    if (!email || !password) {
      setErrorText('Please enter your email and password!!!');
    } else {
      setErrorText('');
      setIsLoading(true);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;
          setIsLoading(false);
        })
        .catch((error: any) => {
          setIsLoading(false);
          setErrorText(error.message);
        });
    }
  };

  return (
    <Container>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          flex: 1,
        }}>
        <TitleComponent
          text="Sign In"
          size={32}
          font={fontFamilies.bold}
          styles={{textTransform: 'uppercase', flex: 0, textAlign: 'center'}}
        />

        <View style={{marginVertical: 20}}>
          <InputComponent
            value={email}
            onChange={val => setEmail(val)}
            prefix={<Sms size={20} color={colors.desc} />}
            placeholder="Email"
            title="Email"
            allowClear
          />
          <InputComponent
            value={password}
            onChange={val => setPassword(val)}
            prefix={<Lock size={20} color={colors.desc} />}
            placeholder="Password"
            title="Password"
            isPassword
          />
          {errorText && (
            <TextComponent text={errorText} color="coral" flex={0} />
          )}
        </View>

        <ButtonComponent
          isLoading={isLoading}
          text="Sign in"
          onPress={handleSigninWithEmail}
        />

        <SpaceComponent height={20} />
        <Text style={[globalStyles.text, {textAlign: 'center'}]}>
          You have an already account?{' '}
          <Text
            style={{color: 'coral'}}
            onPress={() => navigation.navigate('LoginScreen')}>
            Login
          </Text>
        </Text>
      </SectionComponent>
    </Container>
  );
};

export default SigninScreen;
