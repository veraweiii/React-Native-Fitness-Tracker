import React from 'react';
import { Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Button from '../components/Button';


class CurrentDayScreen extends React.Component {
render() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
        title="Go to Current Day"
        onPress={() => this.props.navigation.navigate('CurrentDay')}
        />
    </View>
    );
}
}

class DashboardScreen extends React.Component {
render() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* other code from before here */}
        <Button
        title="Go to Dashboard"
        onPress={() => this.props.navigation.navigate('Dashboard')}
        />
    </View>
    );
}
}

const TabNavigator = createBottomTabNavigator({
  Today: CurrentDayScreen,
  Profile: DashboardScreen,
});

export default createAppContainer(TabNavigator);