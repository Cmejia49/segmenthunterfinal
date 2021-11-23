import React from 'react';
import {StyleSheet,Button, Text, View, Alert,FlatList,ActivityIndicator,TouchableOpacity} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import PushNotification from "react-native-push-notification";

export default class TargetList extends React.Component
{
    state={
       isLoading:Boolean,
        NamedNodeMap:'null',
        init_lat:'unknown',
        init_long:'unknown',
        data:[],
        startDis:0,
        endDis:0,
        message:'hello'
    }
   
    initPush(){
      PushNotification.createChannel({
        channelId:"test",
        channelName:"test-test-test"
      })
    }
    notify(value){
      PushNotification.localNotification({
        channelId:"test",
        title:"Notify",
        message:value,
      })
    }
    //Compute The Distance of two point
    distanceToStart(lat1, lon1, lat2, lon2) 
    {
        var R = 6371; // km
        var dLat = this.toRad(lat2-lat1);
        var dLon = this.toRad(lon2-lon1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    distanceToEnd(lat1, lon1, lat2, lon2) 
    {
        var R = 6371; // km
        var dLat = this.toRad(lat2-lat1);
        var dLon = this.toRad(lon2-lon1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);
  
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }
    toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

    handleSelection = (id) => {
      var selectedId = this.state.selectedId
   
      if(selectedId === id)
        this.setState({selectedId: null})
      else 
        this.setState({selectedId: id})
   }

   getData = async () => {
    try {  
      const keys =await AsyncStorage.getAllKeys();  
      const result = await AsyncStorage.multiGet(keys); 
      // do something what you need with response
      for(var i = 0 ; i<result.length;i++)
      {

        //  console.log(result[i][key]);
         this.setState({data:this.state.data.concat(JSON.parse(result[i][1]))});
        
      }
   } catch (error) {
      // do something...
   }finally {
    this.setState({isLoading: false});
   } 
   }

 async removeItemValue(key) {
   this.handleSelection(key)
  try {
     this.setState({
      data:[...this.state.data.filter(e => e.id != key )]
  })
      await AsyncStorage.removeItem("data"+key);  
      return true;
  }
  catch(exception) {
    return false;
  }
}
    componentDidMount(){
      this.initPush();
      this.getData();
        this.watchID = Geolocation.watchPosition(position => {

           const lat = JSON.stringify(position.coords.latitude);
           const long = JSON.stringify(position.coords.longitude);
           this.setState({init_lat:lat});
           this.setState({init_long:long});
     
            for(var i = 0 ; i<this.state.data.length;i++)
            {
                const distanceToStart =  this.distanceToStart(this.state.init_lat,
                    this.state.init_long,
                    this.state.data[i].start_latitude,
                    this.state.data[i].start_longitude).toFixed(4);
        
                    const distanceToEnd =  this.distanceToEnd(this.state.init_lat,
                        this.state.init_long,
                        this.state.data[i].end_latitude,
                        this.state.data[i].end_longitude).toFixed(4);
                    
                    this.setState({startDis:distanceToStart});
                    this.setState({endDis:distanceToEnd});
                    if(this.state.startDis < 0.009)
                    {
                       this.setState({message:"Segment Reach"});
                       this.setState({name:this.state.data[i].name});
                       this.notify(this.state.message + " " + this.state.name );
                    }
                    if(this.state.endDis < 0.009)
                    {
                      
                        this.setState({message:"Segment end"})
                        this.setState({name:this.state.data[i].name});
                        this.notify(this.state.message + " " + this.state.name );
                    }
            }
            },error => Alert.alert('Error', JSON.stringify(error)),
            {
               enableHighAccuracy: true,
               timeout: 0,
               maximumAge: 0,
               distanceFilter: 0.009,
               forceRequestLocation: true,
               forceLocationManager: false,
               showLocationDialog: true,
            },);
       }
   
       componentWillUnmount() {
         this.watchID != null && Geolocation.clearWatch(this.watchID);
       }

       renderItem = ({ item }) => (         
        <View style={styles.row}>
          <View style={styles.txtContainer}>
          <Text style={styles.text}>{item.name}</Text>
          </View>
          <View style={styles.btnAlign}>
          
          <TouchableOpacity 
          onPress={() =>this.removeItemValue(item.id)}
>
          <Text>
            <Icon name="trash-o" size={40} color="#FC5200" />
          </Text>
        </TouchableOpacity>
          </View>
        </View>
      );
          ItemSeparator = () => <View style={{
            height: 2,
            backgroundColor: "#FC5200",
        }}
        />
       render(){
           return(
            <View>    
             {this.state.isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={this.state.data}
          keyExtractor={({ id }, index) => id}
          renderItem={item => this.renderItem(item)}
          ItemSeparatorComponent={this.ItemSeparator}
          extraData={this.state.data}
        />
         )}
         </View>
           )
       }
}


const styles = StyleSheet.create({
  row:{
    margin:1,
    flexDirection:'row',
    flex:1
  },
  container:{
      flex:1
  },
  selected:{
      backgroundColor:"#6e3b6e"
  },
  txtContainer:{
    flex:1,
    justifyContent:'flex-end',
    padding:2,
    margin:10,
    alignSelf:'flex-start'
  },
  text:{
    fontSize:21,
    fontWeight:'bold'
  },
  btnAlign:{
    flexDirection:'row',
    padding:10,
    justifyContent:'flex-end'
  }
});

