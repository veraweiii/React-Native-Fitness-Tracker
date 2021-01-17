import React, { memo, useState } from 'react';
import Background from '../components/Background';
import { Alert, StyleSheet, Text, View, ScrollView, Modal, FlatList} from 'react-native';
import {Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import Header from '../components/Header';


import Paragraph from '../components/Paragraph';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import DatePicker from 'react-native-datepicker';
import { theme } from '../core/theme';

const CurrentDay = (props) => {
  let tempProps = props.navigation.getParam('passedProps');
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var hours = String(today.getHours()).padStart(2, '0');
  var minutes = String(today.getMinutes()).padStart(2, '0');

  today = yyyy + '-' + mm + '-' + dd;
  let todayWithTime = today + 'T' + hours + ':' + minutes;


  const [date, setDate] = useState({value: today, error: ''});
  const [modalVisible, setModalVisible] = useState({value: false, error: ''});
  const [modalTwoVisible, setModalTwoVisible] = useState({value: false, error: ''});
  const [modalThreeVisible, setModalThreeVisible] = useState({value: false, error: ''});
  const [modalMealVisible, setModalMealVisible] = useState({value: false});
  const [modalEditMealVisible, setEditMealModalVisible] = useState({value: false});
  const [modalMealViewVisible, setModalMealViewVisible] = useState({value: false});
  const [modalAddFoodVisible, setModalAddFoodVisible] = useState({value: false});
  const [modalEditFoodVisible, setModalEditFoodVisible] = useState({value: false});
  const [modalFoodViewVisible, setModalFoodViewVisible] = useState({value: false});
  const [modalStatsVisible, setModalStatsVisible] = useState({value: false});

  const [activities, setActivities] = useState({value: []});

  const [meals, setMeals] = useState({value: []});
  const [foods, setFoods] = useState({value: {}});

  const mealRequest = async () => {
    const response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.screenProps.token,
      },
    });
    const res = await response.json();
    if (JSON.stringify(res['meals']) != JSON.stringify(meals.value)) {
      setMeals({value: res['meals']});
    }
  }

  mealRequest();

  const activityRequest = async () => {
    const response = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.screenProps.token,
      },
    });
    const res = await response.json();
    if (JSON.stringify(res['activities']) != JSON.stringify(activities.value)) {
      setActivities({value: res['activities']});
    }
  }

  activityRequest();

  const foodRequest = async (id, reset) => {
    const response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id + '/foods', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': props.screenProps.token,
      },
    });
    const res = await response.json();
    if (reset == true){
      setFoods({value: foods.value});
    } else {
      foods.value[id] = res['foods'];
    }
  }

  for (const meal of meals.value) {
    foodRequest(meal['id'], false);
  }

  const [addingDate, setAddingDate] = useState({value: todayWithTime});
  const [addingName, setAddingName] = useState({value: ''});
  const [addingDuration, setAddingDuration] = useState({value: ''});
  const [addingCalories, setAddingCalories] = useState({value: ''});
  const [addingFat, setAddingFat] = useState({value: ''});
  const [addingCarbohydrates, setAddingCarbohydrates] = useState({value: ''});
  const [addingProtein, setAddingProtein] = useState({value: ''});
  const [id, setId] = useState({value: 0});
  const [mealId, setMealId] = useState({value: 0});
  const [mealName, setMealName] = useState({value: ''});

  let loginMessage = '';
  if (props.screenProps.firstName !== '' || props.screenProps.lastName !== '') {
    loginMessage = props.screenProps.firstName + ' ' + props.screenProps.lastName;
  } else {
    loginMessage = props.screenProps.username;
  }

  const [lastWeek, setLastWeek] = useState({value: []});

  for (let i = 0; i < 7; i++) {
    let info = new Object();
    var today = new Date();
    today.setDate(today.getDate() - i);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = String(today.getHours()).padStart(2, '0');
    var minutes = String(today.getMinutes()).padStart(2, '0');

    today = yyyy + '-' + mm + '-' + dd;

    let dateActivity = 0;
    for (const activity of activities.value) {
      if (activity['date'].substring(0, 10) === today.substring(0, 10)) {
        dateActivity += activity['duration'];
      }
    }

    let dateCalories = 0;
    let dateFat = 0;
    let dateProtein = 0;
    let dateCarbs = 0;

    for (const meal of meals.value) {
      if (meal['date'].substring(0, 10) === today.substring(0, 10)) {
        if (foods.value[meal['id']] !== undefined) {
          for (const food of foods.value[meal['id']]) {
            dateCalories += food['calories'];
            dateFat += food['fat'];
            dateProtein += food['protein'];
            dateCarbs += food['carbohydrates'];
          }
        }
      }
    }

    info['date'] = today;
    info['activity'] = dateActivity;
    info['calories'] = dateCalories;
    info['fat'] = dateFat;
    info['protein'] = dateProtein;
    info['carbs'] = dateCarbs;

    lastWeek.value[i] = info;
  }

  let totalActivity = 0;
  for (const activity of activities.value) {
    if (activity['date'].substring(0, 10) === date.value.substring(0, 10)) {
      totalActivity += activity['duration'];
    }
  }

  let totalCalories = 0;
  let totalFat = 0;
  let totalProtein = 0;
  let totalCarbs = 0;

  for (const meal of meals.value) {
    if (meal['date'].substring(0, 10) === date.value.substring(0, 10)) {
      if (foods.value[meal['id']] !== undefined) {
        for (const food of foods.value[meal['id']]) {
          totalCalories += food['calories'];
          totalFat += food['fat'];
          totalProtein += food['protein'];
          totalCarbs += food['carbohydrates'];
        }
      }
    }
  }

  let currentCalories = 0;
  let currentFat = 0;
  let currentProtein = 0;
  let currentCarbs = 0;
  if (mealId.value !== undefined && mealId.value != '') {
    for (const food of foods.value[mealId.value]) {
      currentCalories += food['calories'];
      currentFat += food['fat'];
      currentProtein += food['protein'];
      currentCarbs += food['carbohydrates'];
    }
  }

  return (

  <View style={{flex: 1}}>
  <ScrollView>
  <Background>
    {/* <Logo /> */}
    <Header>Current Day</Header>
    <Paragraph>
      {'Happy ' + date.value + ' ' + loginMessage + '!'}
    </Paragraph>

    <DatePicker
    style={{width: 200}}
    date ={date.value}
    
    mode="date"
    placeholder="select date"
    format="YYYY-MM-DD"
    confirmBtnText="Confirm"
    cancelBtnText="Cancel"
    onDateChange={(data) => {
      setDate({value: data});
    }}
    customStyles={{
      dateIcon: {
        position: 'absolute',
        left: 0,
        top: 4,
        marginLeft: 0
      },
      dateInput: {
        marginLeft: 36
      },
      dateText: {
        color: theme.colors.primary
      }
    }
    }/>

<Button mode="contained" onPress={() => {
      props.navigation.navigate('Dashboard', {passedProps: props});

      }}>
      Edit Profile
    </Button>
    <Button mode="contained" onPress={() => {
      setModalStatsVisible({value: true});

      }}>
      Weekly Stats
    </Button>

    <Text style={styles.header}>{"\n"}Nutrition</Text>
    <Text style={styles.subheader}>Calories: {totalCalories} / {props.screenProps.calories}</Text>
    <Text style={styles.subheader}>Protein: {totalProtein} / {props.screenProps.protein}</Text>
    <Text style={styles.subheader}>Carbohydrates: {totalCarbs} / {props.screenProps.carbs}</Text>
    <Text style={styles.subheader}>Fat: {totalFat} / {props.screenProps.fat}</Text>
    <Text style={styles.subheader}>Activity: {totalActivity} / {props.screenProps.activity}</Text>
    
    <Text style={styles.header}>Activities</Text>
    <Button mode="outlined" onPress={() => {
      setModalVisible({value: !modalVisible.value});
      
      }}>
      Add Activity
    </Button>
    <FlatList data={activities.value} renderItem={
      ({item}) => {
      if (item['date'].substring(0, 10) === date.value.substring(0, 10)) {
        return (<View>
        <View style={{flexDirection: 'row', width: '100%', flex: 1, justifyContent:'flex-start'}}>
          <Icon           
              reverse
                name="eye"
                style={{marginRight: 10}}
                type='material'
                size={25}
                color="black"
                onPress={() => {
                  id.value = item['id'];
                  addingDate.value = item['date'].slice(0, -4);
                  addingCalories.value = item['calories'];
                  addingDuration.value = item['duration'];
                  addingName.value = item['name'];
                  
                    setModalThreeVisible({value: !modalThreeVisible.value});
                }}
            />
        <Icon           
              reverse
                name="edit"
                style={{marginRight: 10}}
                type='material'
                size={25}
                color="black"
                onPress={() => {
                  id.value = item['id'];
                  addingDate.value = item['date'].slice(0, -4);
                  addingCalories.value = item['calories'];
                  addingDuration.value = item['duration'];
                  addingName.value = item['name'];
                  
                    setModalTwoVisible({value: !modalTwoVisible.value});
                }}
            />
            
            <Icon           
            reverse
              name="trash-o"
              type='material' 
              size={25}
              color="black"
              onPress={() => {
                  fetch('https://mysqlcs639.cs.wisc.edu/activities/' + item['id'], {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'x-access-token': props.screenProps.token,
                                  }
                                }).then(res => {
                                  setActivities({value: activities.value})
                                });
              }}
          />
          <Text style={styles.subheader}>     {item['name']}</Text>
        
              
        </View>
        
        
        </View>)
          }
        }

    }>
         <Divider style={{ backgroundColor: 'blue' }}/> 
    </FlatList>
    
    <Text style={styles.header}>{"\n"}Meals</Text>
    
    <Button mode="outlined" onPress={() => {
      setModalMealVisible({value: !modalMealVisible.value});
      
      }}>
      Add Meal
    </Button>
    <FlatList data={meals.value} renderItem={
      ({item}) => {
      if (item['date'].substring(0, 10) === date.value.substring(0, 10)) {
        return (<View>
        <View style={{flexDirection: 'row', width: '100%', flex: 1, justifyContent:'flex-start'}}>
          <Icon           
              reverse
                name="eye"
                style={{marginRight: 10}}
                type='material'
                size={25}
                color="black"
                onPress={() => {
                  id.value = item['id'];
                  mealId.value = item['id'];
                  mealName.value = item['name'];
                  addingDate.value = item['date'].slice(0, -4);
                  addingName.value = item['name'];
                  
                  setModalMealViewVisible({value: !modalMealViewVisible.value});
                }}
            />
        <Icon           
              reverse
                name="edit"
                style={{marginRight: 10}}
                type='material'
                size={25}
                color="black"
                onPress={() => {
                  id.value = item['id'];
                  mealId.value = item['id'];
                  addingDate.value = item['date'].slice(0, -4);
                  addingName.value = item['name'];
                  mealName.value = item['name'];
                  setEditMealModalVisible({value: !modalEditMealVisible.value});
                }}
            />
            
            <Icon           
            reverse
              name="trash-o"
              type='material' 
              size={25}
              color="black"
              onPress={() => {
                  fetch('https://mysqlcs639.cs.wisc.edu/meals/' + item['id'], {
                                  method: 'DELETE',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'x-access-token': props.screenProps.token,
                                  }
                                }).then(res => {
                                  setMeals({value: meals.value})
                                });
              }}
          />
          <Text style={styles.subheader}>     {item['name']}</Text>
        
              
        </View>
        
        
        </View>)
          }
        }

    }>
         <Divider style={{ backgroundColor: 'blue' }}/> 
    </FlatList>

    <Modal
          animationType="slide"
          transparent={false}
          visible={modalStatsVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
            <View style={{flex: 1, height: '100%'}}>
            <ScrollView>
          <View style={styles.innerContainer}>
              <Header>Weekly Stats</Header>
              <Button style={{width: '75%'}} mode="contained" onPress={() => {
                  setModalStatsVisible({value: false});
                }}>
                Exit
              </Button>
              <FlatList style={{width: '85%'}} data={lastWeek.value} renderItem={
                ({item}) => {
                return (<View style={{marginBottom: '5%', marginTop: '5%'}}>
                    <Text style={styles.header}>Date: {item['date']}</Text>
                    <Text style={styles.subheader}>Calories: {item['calories']} / {props.screenProps.calories}</Text>
                    <Text style={styles.subheader}>Fat: {item['fat']} / {props.screenProps.fat}</Text>
                    <Text style={styles.subheader}>Protein: {item['protein']} / {props.screenProps.protein}</Text>
                    <Text style={styles.subheader}>Carbohydrates: {item['carbs']} / {props.screenProps.carbs}</Text>
                    <Text style={styles.subheader}>Activity: {item['activity']} / {props.screenProps.activity}</Text>
                </View>)
                }
              }>
              </FlatList>
              <Button style={{width: '75%'}} mode="contained" onPress={() => {
                  setModalStatsVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
              </ScrollView>
              </View>
        </Modal>
    
    <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Add Activity</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={String(addingName.value)}
                onChangeText={text => setAddingName({value: text})}
              />
              <TextInput
                placeholder="Duration"
                returnKeyType="done"
                value={String(addingDuration.value)}
                onChangeText={text => setAddingDuration({value: text})}
              />
              <TextInput
                placeholder="Calories"
                returnKeyType="done"
                value={String(addingCalories.value)}
                onChangeText={text => setAddingCalories({value: text})}
              />
              <DatePicker
                style={{width: 200}}
                date ={addingDate.value}
                
                mode="datetime"
                placeholder="select date and time"
                format="YYYY-MM-DDThh:mm"
                minDate="2016-01-01T00:00"
                maxDate="2019-12-31T23:59"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(data) => {
                  if (data === undefined || data === null || data === '') {
                    setAddingDate({value: todayWithTime});
                  } else {
                    setAddingDate({value: data});
                  }
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }
                }/>
                <Button mode="contained" onPress={() => {
                  addingDate.value = todayWithTime;
                  setAddingDate({value: todayWithTime})
                }}>
                Reset To Current Time
                </Button>
                <Button mode="outlined" onPress={() => {
                  const addActivityRequest = async () => {
                    const request = await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': props.screenProps.token,
                      },
                      body: JSON.stringify({
                          "name": addingName.value,
                          "duration": Number(addingDuration.value),
                          "date": addingDate.value + ':00',
                          "calories": Number(addingCalories.value),
                      })
                    });
                    const req = await request.json();
                    console.log("Uploading Activity"); 
                  }
                  
                  addActivityRequest();

                  addingName.value = '';
                  addingCalories.value = '';
                  addingDuration.value = '';
                  addingDate.value = todayWithTime;
                  setModalVisible({value: false});
                }}>
                Save
                </Button>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingCalories.value = '';
                  addingDuration.value = '';
                  addingDate.value = todayWithTime;
                  setModalVisible({value: false});
                }}>
                Cancel
              </Button>
              </View>
          </View>
        </Modal>

        
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalMealVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Add Meal</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={String(addingName.value)}
                onChangeText={text => setAddingName({value: text})}
              />
              <DatePicker
                style={{width: 200}}
                date ={addingDate.value}
                
                mode="datetime"
                placeholder="select date and time"
                format="YYYY-MM-DDThh:mm"
                minDate="2016-01-01T00:00"
                maxDate="2019-12-31T23:59"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(data) => {
                  if (data === undefined || data === null || data === '') {
                    setAddingDate({value: todayWithTime});
                  } else {
                    setAddingDate({value: data});
                  }
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }
                }/>
                <Button mode="contained" onPress={() => {
                  addingDate.value = todayWithTime;
                  setAddingDate({value: todayWithTime})
                  
                }}>
                Reset To Current Time
                </Button>
                <Button mode="outlined" onPress={() => {
                  if (addingName.value === undefined || addingName.value == '') {
                    alert('You must specify a name for the meal!');
                  } else {
                    const uploadMealRequest = async () => {
                      const response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-access-token': props.screenProps.token,
                        },
  
                        body: JSON.stringify({
                            "name": addingName.value,
                            "date": addingDate.value + ':00',
                        })
                      });
                      const res = await response.json();
                      console.log("Uploading Meal:");
                    }
                    uploadMealRequest();
                    /*let mealObject = new Object();
                    mealObject['id'] = -1;
                    mealObject['name'] = addingName.value;
                    mealObject['date'] = addingDate.value;
                    meals.value.push(mealObject);*/
                    addingName.value = '';
                    addingDate.value = todayWithTime;
                    setModalMealVisible({value: false});
                  }
                }}>
                Save
                </Button>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingDate.value = todayWithTime;
                  setModalMealVisible({value: false});
                }}>
                Cancel
              </Button>
              </View>
          </View>
        </Modal>
     
     
     

     <Modal
          animationType="slide"
          transparent={false}
          visible={modalTwoVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Edit Activity</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={String(addingName.value)}
                onChangeText={text => setAddingName({value: text})}
              />
              <TextInput
                placeholder="Duration"
                returnKeyType="done"
                value={String(addingDuration.value)}
                onChangeText={text => setAddingDuration({value: text})}
              />
              <TextInput
                placeholder="Calories"
                returnKeyType="done"
                value={String(addingCalories.value)}
                onChangeText={text => setAddingCalories({value: text})}
              />
              <DatePicker
                style={{width: 200}}
                date ={addingDate.value}
                
                mode="datetime"
                placeholder="select date and time"
                format="YYYY-MM-DDThh:mm"
                minDate="2016-01-01T00:00"
                maxDate="2019-12-31T23:59"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(data) => {
                  if (data === undefined || data === null || data === '') {
                    setAddingDate({value: todayWithTime});
                  } else {
                    setAddingDate({value: data});
                  }
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }
                }/>
                 <Button mode="contained" onPress={() => {
                  addingDate.value = todayWithTime;
                  setAddingDate({value: todayWithTime})
                  
                }}>
                Set To Current Time
              </Button>
                <Button mode="outlined" onPress={() => {
                  const editActivityRequest = async () => {
                    const request = await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + id.value, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': props.screenProps.token,
                      },
                      body: JSON.stringify({
                          "name": addingName.value,
                          "duration": Number(addingDuration.value),
                          "date": addingDate.value + ':00',
                          "calories": Number(addingCalories.value),
                      })
                    });
                    const req = request.json();
                    console.log("Edit Activity");
                  }
                  
                  editActivityRequest();

                  alert('Activity Saved!');
                }}>
                Save
                </Button>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingCalories.value = '';
                  addingDuration.value = '';
                  addingDate.value = todayWithTime;
                  setModalTwoVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
          </View>
        </Modal>
  
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalEditMealVisible.value && !modalFoodViewVisible.value && !modalAddFoodVisible.value 
            && !modalEditFoodVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Edit Meal</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={String(mealName.value)}
                onChangeText={text => setMealName({value: text})}
              />
              <DatePicker
                style={{width: 200}}
                date ={addingDate.value}
                
                mode="datetime"
                placeholder="select date and time"
                format="YYYY-MM-DDThh:mm"
                minDate="2016-01-01T00:00"
                maxDate="2019-12-31T23:59"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(data) => {
                  if (data === undefined || data === null || data === '') {
                    setAddingDate({value: todayWithTime});
                  } else {
                    setAddingDate({value: data});
                  }
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }
                }/>
                 <Button mode="contained" onPress={() => {
                  addingDate.value = todayWithTime;
                  setAddingDate({value: todayWithTime})
                  
                }}>
                Set To Current Time
              </Button>
              <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  setModalAddFoodVisible({value: !modalAddFoodVisible.value});
                  
                  }}>
                  Add Food
                </Button>
                <FlatList data={foods.value[mealId.value]} renderItem={
                  ({item}) => {
                    return (<View>
                    <View style={{flexDirection: 'row', width: '100%', flex: 1, justifyContent:'flex-start'}}>
                      <Icon           
                          reverse
                            name="eye"
                            style={{marginRight: 10}}
                            type='material'
                            size={25}
                            color="black"
                            onPress={() => {
                              id.value = item['id'];
                              addingName.value = item['name'];
                              addingFat.value = item['fat'];
                              addingCalories.value = item['calories'];
                              addingCarbohydrates.value = item['carbohydrates'];
                              addingProtein.value = item['protein'];
                              setModalFoodViewVisible({value: !modalFoodViewVisible.value});
                            }}
                        />

                        <Icon           
                          reverse
                            name="edit"
                            style={{marginRight: 10}}
                            type='material'
                            size={25}
                            color="black"
                            onPress={() => {
                              id.value = item['id'];
                              addingName.value = item['name'];
                              addingFat.value = item['fat'];
                              addingCalories.value = item['calories'];
                              addingCarbohydrates.value = item['carbohydrates'];
                              addingProtein.value = item['protein'];
                              setModalEditFoodVisible({value: true});
                            }}
                        />
   
                        <Icon           
                        reverse
                          name="trash-o"
                          type='material' 
                          size={25}
                          color="black"
                          onPress={() => {
                              fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId.value + '/foods/' + item['id'], {
                                              method: 'DELETE',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                'x-access-token': props.screenProps.token,
                                              }
                                            }).then(res => {
                                              foodRequest(mealId.value, true);
                                            });
                          }}
                      />
                      <Text style={styles.subheader}>     {item['name']}</Text>
                    
                          
                    </View>
                    
                    
                    </View>)
                    }

                }>
                    <Divider style={{ backgroundColor: 'blue' }}/> 
                </FlatList>
                <Button mode="outlined" onPress={() => {
                  if (mealName.value === undefined || setMealName.value == '') {
                    alert('You must specify a non-empty name for the meal!');
                  } else {
                    const editMealRequest = async () => {
                      const request = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + id.value, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-access-token': props.screenProps.token,
                        },
                        body: JSON.stringify({
                            "name": mealName.value,
                            "date": addingDate.value + ':00',
                        })
                      });
                      const res = await request.json();
                      console.log('Updating Meal');
                    }

                    editMealRequest();

                    alert('Meal Saved!');
                  }
                }}>
                Save
                </Button>
                <Button mode="outlined" onPress={() => {
                  mealName.value = '';
                  addingDate.value = todayWithTime;
                  setEditMealModalVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalThreeVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Activity: {addingName.value}</Header>
              <TextInput
                placeholder="Duration"
                returnKeyType="done"
                value={'Duration: ' + String(addingDuration.value)}
                onChangeText={text => setAddingDuration({value: text})}
                disabled
              />
              <TextInput
                placeholder="Calories"
                returnKeyType="done"
                value={'Calories: ' + String(addingCalories.value)}
                onChangeText={text => setAddingCalories({value: text})}
                disabled
              />
              <DatePicker
                style={{width: 200}}
                date ={addingDate.value}
                disabled
                mode="datetime"
                placeholder="select date and time"
                format="YYYY-MM-DDThh:mm"
                minDate="2016-01-01T00:00"
                maxDate="2019-12-31T23:59"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }
                }/>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingCalories.value = '';
                  addingDuration.value = '';
                  addingDate.value = todayWithTime;
                  setModalThreeVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalMealViewVisible.value && !modalFoodViewVisible.value && !modalAddFoodVisible.value 
          && !modalEditFoodVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Meal: {mealName.value}</Header>
              <DatePicker
                style={{width: 200}}
                date ={addingDate.value}
                disabled
                mode="datetime"
                placeholder="select date and time"
                format="YYYY-MM-DDThh:mm"
                minDate="2016-01-01T00:00"
                maxDate="2019-12-31T23:59"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }
                }/>
                <Text style={styles.header}>{"\n"}Nutrition</Text>
                <Text style={styles.subheader}>Calories: {currentCalories} / {props.screenProps.calories}</Text>
                <Text style={styles.subheader}>Protein: {currentProtein} / {props.screenProps.protein}</Text>
                <Text style={styles.subheader}>Carbohydrates: {currentCarbs} / {props.screenProps.carbs}</Text>
                <Text style={styles.subheader}>Fat: {currentFat} / {props.screenProps.fat}</Text>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  setModalAddFoodVisible({value: !modalAddFoodVisible.value});
                  
                  }}>
                  Add Food
                </Button>
                <FlatList data={foods.value[mealId.value]} renderItem={
                  ({item}) => {
                    return (<View>
                    <View style={{flexDirection: 'row', width: '100%', flex: 1, justifyContent:'flex-start'}}>
                      <Icon           
                          reverse
                            name="eye"
                            style={{marginRight: 10}}
                            type='material'
                            size={25}
                            color="black"
                            onPress={() => {
                              id.value = item['id'];
                              addingName.value = item['name'];
                              addingFat.value = item['fat'];
                              addingCalories.value = item['calories'];
                              addingCarbohydrates.value = item['carbohydrates'];
                              addingProtein.value = item['protein'];
                              setModalFoodViewVisible({value: !modalFoodViewVisible.value});
                            }}
                        />

                      <Icon           
                          reverse
                            name="edit"
                            style={{marginRight: 10}}
                            type='material'
                            size={25}
                            color="black"
                            onPress={() => {
                              id.value = item['id'];
                              addingName.value = item['name'];
                              addingFat.value = item['fat'];
                              addingCalories.value = item['calories'];
                              addingCarbohydrates.value = item['carbohydrates'];
                              addingProtein.value = item['protein'];
                              setModalEditFoodVisible({value: true});
                            }}
                        />
   
                        <Icon           
                        reverse
                          name="trash-o"
                          type='material' 
                          size={25}
                          color="black"
                          onPress={() => {
                              fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId.value + '/foods/' + item['id'], {
                                              method: 'DELETE',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                'x-access-token': props.screenProps.token,
                                              }
                                            }).then(res => {
                                              foodRequest(mealId.value, true);
                                            });
                          }}
                      />
                      <Text style={styles.subheader}>     {item['name']}</Text>
                    
                          
                    </View>
                    
                    
                    </View>)
                    }

                }>
                    <Divider style={{ backgroundColor: 'blue' }}/> 
                </FlatList>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingDate.value = todayWithTime;
                  setModalMealViewVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalAddFoodVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Add Food</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={String(addingName.value)}
                onChangeText={text => setAddingName({value: text})}
              />
              <TextInput
                placeholder="Calories"
                returnKeyType="done"
                value={String(addingCalories.value)}
                onChangeText={text => setAddingCalories({value: text})}
              />
              <TextInput
                placeholder="Protein"
                returnKeyType="done"
                value={String(addingProtein.value)}
                onChangeText={text => setAddingProtein({value: text})}
              />
              <TextInput
                placeholder="Carbohydrates"
                returnKeyType="done"
                value={String(addingCarbohydrates.value)}
                onChangeText={text => setAddingCarbohydrates({value: text})}
              />
              <TextInput
                placeholder="Fat"
                returnKeyType="done"
                value={String(addingFat.value)}
                onChangeText={text => setAddingFat({value: text})}
              />
                <Button mode="outlined" onPress={() => {
                  if (addingName.value === undefined || addingName.value == '') {
                    alert('You must specify a name for the food!');
                  } else if (addingCalories.value === undefined || addingCalories.value == '') {
                    alert('You must specify the calories for the food!');
                  } else if (addingFat.value === undefined || addingFat.value == '') {
                    alert('You must specify the fat for the food!');
                  } else if (addingCarbohydrates.value === undefined || addingCarbohydrates.value == '') {
                    alert('You must specify the carbohydrates for the food!');
                  } else if (addingProtein.value === undefined || addingProtein.value == '') {
                    alert('You must specify the protein for the food!');
                  } else {
                    const uploadFoodRequest = async () => {
                      const response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId.value + '/foods', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-access-token': props.screenProps.token,
                        },
  
                        body: JSON.stringify({
                            "name": addingName.value,
                            "calories": addingCalories.value,
                            "protein": addingProtein.value,
                            "carbohydrates": addingCarbohydrates.value,
                            "fat": addingFat.value
                        })
                      });
                      const res = await response.json();
                      console.log("Uploading Food:");
                      Alert.alert("Food added", "Successfully added a new food!", [{text: "OK", onPress: () => {
                        modalAddFoodVisible.value = false;
                        
                        foodRequest(mealId.value, true);
                      }}])
                    }
                    uploadFoodRequest();
                    addingCalories.value = '';
                    addingProtein.value = '';
                    addingCarbohydrates.value = '';
                    addingFat.value = '';
                    addingName.value = '';
                  }
                }}>
                Save
                </Button>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingCalories.value = '';
                  addingProtein.value = '';
                  addingCarbohydrates.value = '';
                  addingFat.value = '';
                  setModalAddFoodVisible({value: false});
                }}>
                Cancel
              </Button>
              </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalEditFoodVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Edit Food</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={String(addingName.value)}
                onChangeText={text => setAddingName({value: text})}
              />
              <TextInput
                placeholder="Calories"
                returnKeyType="done"
                value={String(addingCalories.value)}
                onChangeText={text => setAddingCalories({value: text})}
              />
              <TextInput
                placeholder="Protein"
                returnKeyType="done"
                value={String(addingProtein.value)}
                onChangeText={text => setAddingProtein({value: text})}
              />
              <TextInput
                placeholder="Carbohydrates"
                returnKeyType="done"
                value={String(addingCarbohydrates.value)}
                onChangeText={text => setAddingCarbohydrates({value: text})}
              />
              <TextInput
                placeholder="Fat"
                returnKeyType="done"
                value={String(addingFat.value)}
                onChangeText={text => setAddingFat({value: text})}
              />
                <Button mode="outlined" onPress={() => {
                  if (addingName.value === undefined || addingName.value == '') {
                    alert('You must specify a name for the food!');
                  } else if (addingCalories.value === undefined || addingCalories.value == '') {
                    alert('You must specify the calories for the food!');
                  } else if (addingFat.value === undefined || addingFat.value == '') {
                    alert('You must specify the fat for the food!');
                  } else if (addingCarbohydrates.value === undefined || addingCarbohydrates.value == '') {
                    alert('You must specify the carbohydrates for the food!');
                  } else if (addingProtein.value === undefined || addingProtein.value == '') {
                    alert('You must specify the protein for the food!');
                  } else {
                    const uploadFoodRequest = async () => {
                      const response = await fetch('https://mysqlcs639.cs.wisc.edu/meals/' + mealId.value + '/foods/' + id.value, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'x-access-token': props.screenProps.token,
                        },
  
                        body: JSON.stringify({
                            "name": addingName.value,
                            "calories": addingCalories.value,
                            "protein": addingProtein.value,
                            "carbohydrates": addingCarbohydrates.value,
                            "fat": addingFat.value
                        })
                      });
                      const res = await response.json();
                      console.log("Updating Food:");
                    }
                    uploadFoodRequest();
                    alert("Food " + addingName.value + " edited!");
    
                  }
                }}>
                Save
                </Button>
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingCalories.value = '';
                  addingProtein.value = '';
                  addingCarbohydrates.value = '';
                  addingFat.value = '';
                  setModalEditFoodVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalFoodViewVisible.value}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Header>Food: {addingName.value}</Header>
              <TextInput
                placeholder="Name"
                returnKeyType="done"
                value={"Name " + String(addingName.value)}
                onChangeText={text => setAddingName({value: text})}
                disabled
              />
              <TextInput
                placeholder="Calories"
                returnKeyType="done"
                value={"Calories: " + String(addingCalories.value)}
                onChangeText={text => setAddingCalories({value: text})}
                disabled
              />
              <TextInput
                placeholder="Protein"
                returnKeyType="done"
                value={"Protein: " + String(addingProtein.value)}
                onChangeText={text => setAddingProtein({value: text})}
                disabled
              />
              <TextInput
                placeholder="Carbohydrates"
                returnKeyType="done"
                value={"Carbohydrates: " + String(addingCarbohydrates.value)}
                onChangeText={text => setAddingCarbohydrates({value: text})}
                disabled
              />
              <TextInput
                placeholder="Fat"
                returnKeyType="done"
                value={"Fat: " + String(addingFat.value)}
                onChangeText={text => setAddingFat({value: text})}
                disabled
              />
                <Button mode="outlined" onPress={() => {
                  addingName.value = '';
                  addingCalories.value = '';
                  addingProtein.value = '';
                  addingCarbohydrates.value = '';
                  addingFat.value = '';
                  setModalFoodViewVisible({value: false});
                }}>
                Exit
              </Button>
              </View>
          </View>
        </Modal>

  </Background>
  </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  header: {
    color: theme.colors.primary,
    fontSize: 30,
  },
  subheader: {
    color: theme.colors.primary,
    fontSize: 20,
  },
   container: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  innerContainer: {
    alignItems: 'center',
  },
});

export default memo(CurrentDay);
