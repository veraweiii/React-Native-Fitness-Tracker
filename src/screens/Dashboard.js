import React, { memo, useState } from 'react';
import Background from '../components/Background';
import { TouchableOpacity, StyleSheet, Text, View, ScrollView} from 'react-native';
import { Input } from 'react-native-elements';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';

const deleteUser = (username, token) => {
  fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
                                method: 'DELETE',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'x-access-token': token,
                                }
                              }).then(res => {
                              });
};

const setInformation = (username, token, password, firstName, lastName, 
  goalDailyCalories, goalDailyProtein, goalDailyCarbohydrates, goalDailyFat, goalDailyActivity, props) =>{
    props.screenProps.setFirstName(firstName);
    props.screenProps.setLastName(lastName);
    props.screenProps.setCalories(goalDailyCalories);
    props.screenProps.setProtein(goalDailyProtein);
    props.screenProps.setCarbs(goalDailyCarbohydrates);
    props.screenProps.setFat(goalDailyFat);
    props.screenProps.setActivity(goalDailyActivity);
    console.log(username + ' ' + token);
    if (password === '' || password === undefined || password === null) {
      fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'x-access-token': token,
                                },
                                body: JSON.stringify({
                                    "firstName": firstName,
                                    "lastName": lastName,
                                    "goalDailyCalories": Number(goalDailyCalories),
                                    "goalDailyProtein": Number(goalDailyProtein),
                                    "goalDailyCarbohydrates": Number(goalDailyCarbohydrates),
                                    "goalDailyFat": Number(goalDailyFat),
                                    "goalDailyActivity": Number(goalDailyActivity),
                                })
                              }).then(res => {
                                console.log('updated user');

                              });
    } else {
      fetch('https://mysqlcs639.cs.wisc.edu/users/' + username, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'x-access-token': token,
                                },
                                body: JSON.stringify({
                                    "password": password,
                                    "firstName": firstName,
                                    "lastName": lastName,
                                    "goalDailyCalories": Number(goalDailyCalories),
                                    "goalDailyProtein": Number(goalDailyProtein),
                                    "goalDailyCarbohydrates": Number(goalDailyCarbohydrates),
                                    "goalDailyFat": Number(goalDailyFat),
                                    "goalDailyActivity": Number(goalDailyActivity),
                                })
                              }).then(res => {
                               // res.text()
                                 ('updated user');

                              });
    }
    props.screenProps.rerenderParent();
};

const Dashboard = (props) => {
  props = props.navigation.getParam('passedProps');
  const [password, setPassword] = useState({value:'', error: ''});
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [calories, setCalories] = useState({ value: '', error: '' });
  const [protein, setProtein] = useState({ value: '', error: '' });
  const [carbs, setCarbs] = useState({ value: '', error: '' });
  const [fat, setFat] = useState({ value: '', error: '' });
  const [activity, setActivity] = useState({ value: '', error: '' });

  if (firstName.value == '') {
    firstName.value = props.screenProps.firstName;
  }
  if (lastName.value == '') {
    lastName.value = props.screenProps.lastName;
  }
  if (calories.value == '') {
    calories.value = props.screenProps.calories;
  }
  if (protein.value == '') {
    protein.value = props.screenProps.protein;
  }
  if (carbs.value == '') {
    carbs.value = props.screenProps.carbs;
  }
  if (fat.value == '') {
    fat.value = props.screenProps.fat;
  }
  if (activity.value == '') {
    activity.value = props.screenProps.activity;
  }

  let loginMessage = '';
  if (firstName.value !== '' || lastName.value !== '') {
    loginMessage = 'Hi ' + firstName.value + ' ' + lastName.value + '!';
  } else {
    loginMessage = 'Hello ' + props.screenProps.username + '!';
  }

  return (

  <View style={{flex: 1}}>
  <ScrollView>
  <Background>
    {/* <Logo /> */}
    <BackButton goBack={() => props.navigation.navigate('CurrentDay', {passedProps: props})} />
    <Header>Profile</Header>
    <Paragraph>
      {loginMessage}
    </Paragraph>
    <Input
        label="Password"
        placeholder="Change Password"
        returnKeyType="done"
        defaultValue={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        // error={!!password.error}
        // errorText={password.error}
        secureTextEntry
      />
      <Input
        label="First Name"
        placeholder="First Name"
        returnKeyType="done"
        defaultValue={firstName.value}
        onChangeText={text => {
          firstName.value = text;
          //props.screenProps.setFirstName(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
      {/* <Text
      label="I am Bold"
      /> */}
      <Input
        label = "Last Name"
        placeholder="Last Name"
        returnKeyType="done"
        defaultValue={lastName.value}
        onChangeText={text => {
          lastName.value = text;
          //props.screenProps.setLastName(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
      <Input
        label="Daily Calories Goal"
        placeholder="Daily Calories Goal"
        returnKeyType="done"
        defaultValue={String(calories.value)}
        onChangeText={text => {
          calories.value = text;
          //props.screenProps.setCalories(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
      <Input
        label="Daily Protein"
        placeholder="Daily Protein"
        returnKeyType="done"
        defaultValue={String(protein.value)}
        onChangeText={text => {
          protein.value = text;
          //props.screenProps.setProtein(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
      <Input
        label="Daily Carbs"
        placeholder="Daily Carbs"
        returnKeyType="done"
        defaultValue={String(carbs.value)}
        onChangeText={text => {
          carbs.value = text;
          //props.screenProps.setCarbs(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
      <Input
        label="Daily Fat"
        placeholder="Daily Fat"
        returnKeyType="done"
        defaultValue={String(fat.value)}
        onChangeText={text => {
          fat.value = text;
        //props.screenProps.setFat(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
      <Input
        label="Daily Activity"
        placeholder="Daily Activity"
        returnKeyType="done"
        defaultValue={String(activity.value)}
        onChangeText={text => {
          activity.value = text;
          //props.screenProps.setActivity(text);
        }}
        // error={!!password.error}
        // errorText={password.error}
        // secureTextEntry
      />
    <Button mode="contained" onPress={() => {
      setInformation(props.screenProps.username, props.screenProps.token, password.value, firstName.value,
        lastName.value,
      calories.value, protein.value, carbs.value, fat.value, activity.value, props);
      }}>             
        Save
      </Button>

    
    <Button mode="outlined" onPress={() => {
      props.navigation.navigate('HomeScreen');
      props.screenProps.logout();
      }}>
      Logout
    </Button>
    <Button mode="outlined" onPress={() => {
      deleteUser(props.screenProps.username, props.screenProps.token);
      props.navigation.navigate('HomeScreen');
      props.screenProps.logout();
      }}>
      Delete Account
    </Button>


  </Background>
  </ScrollView>
  </View>
  );
};

export default memo(Dashboard);
