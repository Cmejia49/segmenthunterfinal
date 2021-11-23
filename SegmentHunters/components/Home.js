
 import React from 'react';
 import {StyleSheet,Text, View, Image,TouchableOpacity} from 'react-native';
 import PushNotification from "react-native-push-notification";


 export default class Home extends React.Component
  {
    
    state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      isLoading:Boolean,
      data:[]
    };
   
    initPush(){
      PushNotification.createChannel({
        channelId:"test",
        channelName:"test-test-test"
      })
    }
    componentDidMount() {
      this.initPush();
    }
    render() {    
    const { navigate } = this.props.navigation;
      return (
        <View style={styles.container}>
          <View style={styles.imgContainer}>
          <Image style={styles.tinyLogo} source={require('./strava_icon.png')} />
          </View>
          <View style={styles.row}>
          <TouchableOpacity
                 onPress={() => navigate('segmentList',{name:'segmentList'})}
                 style={styles.btn}
                 activeOpacity = { .5 }> 
                    <Text style={styles.btnTextStyle}>Segment List</Text>
          </TouchableOpacity>
          <TouchableOpacity
                 onPress={() => navigate('targetList',{name:'targetList'})}
                 style={styles.btn}
                 activeOpacity = { .5 }> 
                    <Text style={styles.btnTextStyle}>Target List</Text>
          </TouchableOpacity>
          </View>
          </View>
      );
    }
  }
  const styles = StyleSheet.create({
    container:{
      flex:1,
      alignContent:'center',
      justifyContent:'space-evenly', 
    },
    title: {
      fontWeight: '500',
    },
    row:{
      justifyContent:'space-between'
    },
    btn:{ 
      marginRight:40,
      marginLeft: 40,
      marginTop: 10,
      paddingTop: 15,
      paddingBottom:15,
      backgroundColor: '#FC5200',
      },
      btnTextStyle:{
        color:'#fff',
        textAlign:'center',
        fontSize:21,
        fontFamily:'sans-serif-medium',
      },
      imgContainer:{
          margin:10,
          padding:10,
          alignItems:'center',
          justifyContent:'flex-end'
      },
      tinyLogo: {
        justifyContent:'flex-end',
        width: 250,
        height: 250,
      },
      
  });