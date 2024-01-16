import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import HomeScreen from '../screens/homes/HomeScreen';
import AddNewTask from '../screens/tasks/AddNewTask';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/auth/LoginScreen';
import SigninScreen from '../screens/auth/SigninScreen';
import TaskDetail from '../screens/tasks/TaskDetail';
import ListTasks from '../screens/tasks/ListTasks';
import Notifications from '../screens/Notifications';
import {useLinkTo} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {Linking} from 'react-native';
import {NotificationModel} from '../models/NotificationModel';
import AddNewAudio from '../screens/AddNewAudio';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);

  const linkTo = useLinkTo();

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });

    messaging().onNotificationOpenedApp((mess: any) => {
      const data = mess.data;
      const taskid = data.taskId;

      linkTo(`/task-detail/${taskid}`);
    });
  }, []);

  const Stack = createNativeStackNavigator();

  const MainRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTask" component={AddNewTask} />
      <Stack.Screen name="TaskDetail" component={TaskDetail} />
      <Stack.Screen name="ListTasks" component={ListTasks} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="AddNewAudio" component={AddNewAudio} />
    </Stack.Navigator>
  );

  const AuthRouter = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SigninScreen" component={SigninScreen} />
    </Stack.Navigator>
  );
  return isLogin ? MainRouter : AuthRouter;
};

export default Router;
