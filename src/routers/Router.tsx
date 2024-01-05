import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import HomeScreen from '../screens/homes/HomeScreen';
import AddNewTask from '../screens/tasks/AddNewTask';
import auth from '@react-native-firebase/auth';
import LoginScreen from '../screens/auth/LoginScreen';
import SigninScreen from '../screens/auth/SigninScreen';
import TaskDetail from '../screens/tasks/TaskDetail';
import ListTasks from '../screens/tasks/ListTasks';

const Router = () => {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
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
