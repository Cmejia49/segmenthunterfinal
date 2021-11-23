
import React from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet,TouchableOpacity } from 'react-native';
const auth_link = "https://www.strava.com/oauth/token"
export default class SegmentList extends React.Component
{
    state = {
        access_token:'null',
        selectedId:'null',
        isLoading:Boolean,
        data:[]
      };
     


      handleSelection = (id) => {
        var selectedId = this.state.selectedId
     
        if(selectedId === id)
          this.setState({selectedId: null})
        else 
          this.setState({selectedId: id})
     }
     
     conTwoDecDigit=(digit)=>{
      return digit.toFixed(2)
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
      const TOKEN = "2d4f31e3111a05fc46685e841cfb6ddc671cb49b";
      try {
         fetch("https://www.strava.com/api/v3/segments/starred?page=1&per_page=30", {
         method: "GET",
         headers: {
           'Authorization': 'Bearer ' + res.access_token
         }
       }).then((response) => response.json())
       .then(json => {
         this.setState({data: json})
       })
     } catch (error) {
       console.error(error);
     } finally {
       this.setState({isLoading: false});
     }
  }

      componentDidMount(){
        this.getAccessToken();
      }
        //ItemSeparator
        ItemSeparator = () => <View style={{
            height: 2,
            backgroundColor: "#FC5200",
        }}
        />
        
        renderItem = ({ item }) => (
  
            
            <TouchableOpacity 
            onPress={() => this.props.navigation.navigate('segmentDetail', 
            { name: 'segmentDetail',
              selectedId:item.id,
            })}
            style={item.id === this.state.selectedId ? styles.selected : null} 
            >
              <View>
              <Text style={styles.txtContainer}>
             <Text style={styles.txtName}>{item.name} {'\n'}</Text>
             <Text>{this.conTwoDecDigit(item.distance/1000)+ 'Km'},      {item.average_grade + '%'} </Text>
             </Text>
              </View>
          </TouchableOpacity>
          );
       render(){
           return(
            <View>      
        {this.state.isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={this.state.data}
          keyExtractor={({ id }, index) => id}
          extraData={this.state.data}
          renderItem={item => this.renderItem(item)}
          ItemSeparatorComponent={this.ItemSeparator}
        />
        )}
            </View>
           )
       }
  
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    selected:{
        backgroundColor:"#6e3b6e"
    },
    txtContainer:{
      margin:10,
    },
    txtName:{
      fontSize:18,
      fontWeight:'bold'
    }
    
});