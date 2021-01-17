import React, {useState} from 'react';
import { Provider } from 'react-native-paper';
import App from './src';
import { theme } from './src/core/theme';
import Router from './src/index.js'

const Main = () => {
  return (
  /*<Provider theme={theme}>
    <App screenProps={{setToken={setToken}, setUsername={setUsername}, username={username},  getToken=token,}}/>
  </Provider>*/
  <Application/>);
};

export default Main;

class Application extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      token: '',
      firstName:'',
      lastName:'',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      activity: '',
    }
    this.setToken = this.setToken.bind(this);
    this.setUserName = this.setUserName.bind(this);    
    this.setState = this.setState.bind(this);  
    this.logout = this.logout.bind(this);            
  }

  logout(){
    this.state.username = '';
    this.state.token = '';
    this.state.firstName = '';
    this.state.lastName = '';
    this.state.calories = 0;
    this.state.protein = 0;
    this.state.carbs = 0;
    this.state.fat = 0;
    this.state.activity = 0;
  }

  setUserName(username) {
    console.log('setting username: ' + username);
    this.state.username = username;
    this.setState({
      username: username
    });
  }

  setToken(token) {
    console.log('setting token: ' + token);
    this.setState({
      token: token
    });
    this.state.token = token;
    fetch('https://mysqlcs639.cs.wisc.edu/users/' + this.state.username, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
  }).then(response => response.json()).then(res => {
    //console.log(res);
    
    this.state.firstName = res['firstName'] === null ? '' : res['firstName'];
    this.state.lastName = res['lastName'] === null ? '' : res['lastName'];
    this.state.calories = res['goalDailyCalories'] === undefined ? 0 : res['goalDailyCalories'];
    this.state.protein = res['goalDailyProtein'] === undefined ? 0 : res['goalDailyProtein'];
    this.state.carbs = res['goalDailyCarbohydrates'] === undefined ? 0 : res['goalDailyCarbohydrates'];
    this.state.fat = res['goalDailyFat'] === undefined ? 0 : res['goalDailyFat'];
    this.state.activity = res['goalDailyActivity'] === undefined ? 0 : res['goalDailyActivity'];

    //console.log(this.state.calories);
    

    this.setState({
      token: token,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      calories: this.state.calories,
      protein: this.state.protein,
      carbs: this.state.carbs,
      fat: this.state.fat,
      activity: this.state.activity,
      date: this.state.date
      
    });
  });
  }

  render() {
    return (
      <Provider theme={theme}>
        <Router screenProps={{
          setToken:this.setToken,
          logout:this.logout,
           setUserName:this.setUserName,
            username:this.state.username, 
             token: this.state.token,
      setFirstName: (value) => this.state.firstName = value,
      firstName: this.state.firstName,
      setLastName: (value) => this.state.lastName = value,
      lastName: this.state.lastName,
      setCalories: (value) => this.state.calories = value,
      calories: this.state.calories,
      setProtein: (value) => this.state.protein = value,
      protein: this.state.protein,
      setCarbs: (value) => this.state.carbs = value,
      carbs: this.state.carbs,
      setFat: (value) => this.state.fat = value,
      fat: this.state.fat,
      setActivity: (value) => this.state.activity = value,
      activity: this.state.activity,
      rerenderParent:() => {this.setState({})},
      }}/>
      </Provider>
      );
  }
}


// import React from 'react';
// import { View, Text } from 'react-native';
// import Modal from './Modal';
// import Button from './Button';
// import Login from './Login';


// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showModal: false
//     }
//   }

//   componentDidMount() {
//     fetch('https://mysqlcs639.cs.wisc.edu/users/', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: 'username',
//         password: 'password',
//       }),
//     });
//   }

//   render() {
//     return (
//       // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
//       //   <Button buttonStyle={{backgroundColor: '#aaaaaa', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10}} textStyle={{color: '#ffffff'}} text={'Show Modal'} onPress={() => this.showModal()}/>
//       //   <Modal width={300} height={600} show={this.state.showModal} hide={() => this.hideModal()}/>
//       // </View>
//       <Login></Login>
//     );
//   }

//   showModal() {
    
//     this.setState({showModal: true});
//   }

//   hideModal() {
//     this.setState({showModal: false});
//   }
// }

// export default App;
