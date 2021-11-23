
import React from 'react';
import { StyleSheet, Text, View ,StatusBar,useColorScheme} from 'react-native';
import { NavigationContainer,DefaultTheme,  DarkTheme,  } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Home from './components/Home.js';
import segmentList from './components/SegmentList';
import segmentDetail from './components/SegmentDetail';
import targetList from './components/TargetList';

const stack = createNativeStackNavigator();

export default class App extends React.Component {
  
  render() {
    return (
      <NavigationContainer>
        <stack.Navigator initialRouteName="Home">
          <stack.Screen name="Home"
          component={Home}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#FC5200',
            },
            
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}/>
          <stack.Screen name="segmentList" component={segmentList}
            options={{
              title: 'SegmentList',
              headerStyle: {
                backgroundColor: '#FC5200',
              },
              
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}/>
          <stack.Screen name="segmentDetail"
           component={segmentDetail}
            options={{
              title: 'SegmentDetail',
              headerStyle: {
                backgroundColor: '#FC5200',
              },
              
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}/>

          <stack.Screen name="targetList"
           component={targetList}
            options={{
              title: 'TargetList',
              headerStyle: {
                backgroundColor: '#FC5200',
              },
              
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}/>
        </stack.Navigator>
      </NavigationContainer>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },

  try:{
    color:'white'
  }
});
