import React, {useEffect, useState} from 'react';
import Container from '../components/Container';
import TextComponent from '../components/TextComponent';
import SectionComponent from '../components/SectionComponent';
import TitleComponent from '../components/TitleComponent';
import RowComponent from '../components/RowComponent';
import InputComponent from '../components/InputComponent';
import {Lock, Sms} from 'iconsax-react-native';
import {colors} from '../constants/colors';
import {Text, View} from 'react-native';
import ButtonComponent from '../components/ButtonComponent';
import {globalStyles} from '../styles/globalStyles';
import SpaceComponent from '../components/SpaceComponent';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (email) {
      setErrorText('');
    }
  }, [email]);

  const handleCreateAccount = async () => {
    if (!email) {
      setErrorText('Please enter your email!!!');
    } else if (!password || !confirmPassword) {
      setErrorText('Please enter your password!!!');
    } else if (password !== confirmPassword) {
      setErrorText('Password is not match!!!');
    } else if (password.length < 6) {
      setErrorText('Password must be to 6 characters');
    } else {
      setIsLoading(true);
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          const user = userCredential.user;

          if (user) {
            console.log(user);
            setIsLoading(false);
          }
        })
        .catch(error => {
          setIsLoading(false);
          setErrorText(error.message);
        });
    }
  };
  return (
    <Container>
      <SectionComponent
        styles={{
          flex: 1,
          justifyContent: 'center',
        }}>
        <RowComponent styles={{marginBottom: 16}}>
          <TitleComponent text="SIGN IN" size={32} flex={0} />
        </RowComponent>
        <InputComponent
          title="Email"
          value={email}
          onChange={val => setEmail(val)}
          placeholder="Email"
          prefix={<Sms size={22} color={colors.gray2} />}
          allowClear
          type="email-address"
        />
        <InputComponent
          title="Password"
          isPassword
          value={password}
          onChange={val => setPassword(val)}
          placeholder="Password"
          prefix={<Lock size={22} color={colors.gray2} />}
        />
        <InputComponent
          title="Comfirm password"
          isPassword
          value={confirmPassword}
          onChange={val => setConfirmPassword(val)}
          placeholder="Comfirm password"
          prefix={<Lock size={22} color={colors.gray2} />}
        />

        {errorText && <TextComponent text={errorText} color="coral" flex={0} />}
        <SpaceComponent height={20} />

        <ButtonComponent
          isLoading={isLoading}
          text="Register"
          onPress={handleCreateAccount}
        />

        <RowComponent styles={{marginTop: 20}}>
          <Text style={[globalStyles.text]}>
            You have an account?{' '}
            <Text
              style={{color: 'coral'}}
              onPress={() => navigation.navigate('LoginScreen')}>
              Login
            </Text>
          </Text>
        </RowComponent>
      </SectionComponent>
    </Container>
  );
};

export default RegisterScreen;
