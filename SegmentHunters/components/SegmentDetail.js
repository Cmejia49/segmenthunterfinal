
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
      ActivityIndicator, 
      FlatList, 
      Text, 
      View, 
      StyleSheet,
      TouchableOpacity, 
      Image,
      Button} from 'react-native';
const auth_link = "https://www.strava.com/oauth/token"
export default class SegmentDetail extends React.Component{
    state = {
        data:[],
        isLoading:Boolean,
        id:'null',
        name:'null',
        location:'null',
        distance:'null',
        avgGrade:'null',
        highElev:'null',
        lowElev:'null',
        climbCat:'null',
        elevProfile:'null',
        start_lat:'null',
        start_long:'null',
        end_lat:'null',
        end_long:'null'
       };

       conDecimalPlace=(digit)=>{
        return digit.toFixed(0)
      }
      

      getAccessToken(){
        fetch(auth_link,{
          method:'post',
          headers:{
            'Accept':'application/json, text/plain, */*',
            'content-type' : 'application/json'
          },
  
          body: JSON.stringify({
              client_id:'74070',
              client_secret:'43d3c732cd04a2608256d2f02d2b7894a4d058cd',
              refresh_token:'468ff3881c74b36d4632f6f4e4b08737542cdd50',
              grant_type:'refresh_token'
          })
        }).then(res => res.json())
        .then(res => this.fetchSegment(res))
      }

      fetchSegment(res){
        try {
           fetch("https://www.strava.com/api/v3/segments/" + this.props.route.params.selectedId, {
           method: "GET",
           headers: {
             'Authorization': 'Bearer ' + res.access_token
           }
         }).then((response) => response.json())
         .then(json => {
           this.setState({id:json.id})
           this.setState({name: json.name})
           this.setState({location: json.city + ", "+ json.state + ", " + json.country})
           this.setState({distance: json.distance})
           this.setState({avgGrade: json.average_grade})
           this.setState({highElev: json.elevation_high})
           this.setState({lowElev:  json.elevation_low})
           this.setState({climbCat: json.climb_category})
           this.setState({elevProfile: json.elevation_profile})
           this.setState({start_lat:json.start_latitude})
           this.setState({start_long:json.start_longitude})
           this.setState({end_lat:json.end_latitude})
           this.setState({end_long:json.end_longitude})
           this.setState({data:json})
         })
       } catch (error) {
         console.error(error);
       } finally {
         this.setState({isLoading: false});
       }
    }

    //Get data 
    
  storeData = async () => {
    try {
      const jsonStringfy = JSON.stringify(this.state.data);
      await AsyncStorage.setItem('data'+this.state.id,jsonStringfy)
       this.props.navigation.navigate('targetList', 
                 { name: 'targetList',
                 })     

    } catch (e) {
      // saving error
    }
   }
    componentDidMount()
    {
      this.getAccessToken();
    }
 
   render(){
       return(
           <View style={styles.container}>
             <View style={styles.nameContainer}>
               <Text style={styles.textName}>{this.state.name}</Text>
               <Text>{this.state.location}</Text>
             </View>
              <View style={styles.column}>
                 <View style={styles.lblContaner}>
                    <Text style={styles.txtlbl}>Distance</Text>
                    <Text style={styles.txtlbl}>Avg Grade</Text>
                    <Text style={styles.txtlbl}>Highes Elev</Text>
                    <Text style={styles.txtlbl}>Lowest Elev</Text>
                    <Text style={styles.txtlbl}>Elev Diff</Text>
                 </View>
                 <View style={styles.lblValue}>
                    <Text style={styles.txtValue}>{this.conDecimalPlace(this.state.distance/1000)+"km"}</Text>
                    <Text style={styles.txtValue}>{this.state.avgGrade + "%"}</Text>
                    <Text style={styles.txtValue}>{this.state.highElev + "m"}</Text>
                    <Text style={styles.txtValue}>{this.state.lowElev + "m"}</Text>
                    <Text style={styles.txtValue}>{this.conDecimalPlace(this.state.highElev - this.state.lowElev) + "m"}</Text>
                 </View>
              </View>
               <View style={styles.elevProfile}>
                  <Text>Elevation Profile: </Text>
                  <Image
                    style={styles.logo}
                    source={{uri:this.state.elevProfile }}/>
               </View>
               <View style={styles.catContainer}>
                  <Text>Climb Category: {this.state.climbCat}</Text>
               </View>
               
                <View style={styles.btnContainer}>
                <TouchableOpacity
                 onPress={() => this.storeData()}
                 style={styles.btn}
                 activeOpacity = { .5 }> 
                    <Text style={styles.btnTextStyle}> Add To Target </Text>
      </TouchableOpacity>
                </View>
                
           </View>
       )
   }
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       marginTop: 8,
    },
    nameContainer:{
     marginLeft:15
    },
    column:{
       margin:10,
       flexDirection:'column'
    },
    logo:{
      margin:10,
      width:350,
      height:200,
      borderWidth: 2,
      borderColor:'#FC5200',
      resizeMode: 'stretch',
      justifyContent:'center',
      alignContent:'center',
      alignSelf:'center'
    },
    lblContaner:{
      flexDirection:'row',
      alignSelf:'flex-start'
    },
    txtlbl:{
       paddingTop:10,
       paddingHorizontal:5,
       color:'rgba(73,73,80,0.5)'
    },
    txtValue:{
     paddingHorizontal:7,
     marginLeft:5,
     marginRight:12,
     marginTop:2,
     marginBottom:3,
     fontSize:18,
     justifyContent:'space-evenly'
    },
    lblValue:{
     flexDirection:'row',
   
    },
    textName:{
      fontSize:20,
      fontFamily:'sans-serif-medium',
      fontWeight:'bold'
    },
    elevProfile:{
     alignItems:'center',
     paddingTop:30,
     marginTop:20
    },
    btnContainer:{
     flex:1,
     alignItems:'stretch',
     justifyContent:'center',
     marginHorizontal: 16,
     paddingTop:20,
     paddingBottom:30
   },
   btn:{ 
   marginRight:20,
   marginLeft: 20,
   marginTop: 10,
   paddingTop: 15,
   paddingBottom: 15,
   backgroundColor: '#FC5200',
   },
   btnTextStyle:{
     color:'#fff',
     textAlign:'center',
     fontSize:15,
     fontFamily:'sans-serif-medium',
   },
   
    catContainer:{
      marginLeft:20
    }
   });