import React, {Component} from 'react';
import { 
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  ScrollView, 
  Image,
  ToastAndroid,
  Alert,
  AsyncStorage,
  TouchableHighlight,
  Modal
} from 'react-native';
import { Avatar, TYPO,COLOR,Button } from 'react-native-material-design';
import NgsiModule from '../NativeModules/NgsiModule';

import Toolbar from '../components/Toolbar'
import Nav from '../components/Nav'
import MyFloatButton from '../components/MyFloatButton'
import ServerConnection from '../services/ServerConnection'

import Functions from '../functions/Functions'



export default class HomeScreen extends Component {
  
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this)
    this.isInside = this.isInside.bind(this)
    this.isOutside = this.isOutside.bind(this)
    this.state = {
      message : "No te encuentras en ningun campus",
      campus : null,
      modalVisible: false
    }
  } 
  
  componentDidMount(){
    let t = this
    navigator.geolocation.watchPosition((position) =>{
      AsyncStorage.getItem('campus').then((campus) =>{
        if (campus === "{}"){
          t.setState({campus: null})
        }else{
          let camp = JSON.parse(campus)
          t.setState({campus: camp})
        }       
      })
    },
    (error) => {
        Alert.alert(
          'Alert',
          error.message,
          [
            {text: 'ok', onPress: () => console.log('Ask me later pressed')}
          ],
          { cancelable: true }
        )
        t.setState({message:error.message})
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000,distanceFilter:0.5 },
    );

    
  
  }

  onPress (){
    this.refs['DRAWER'].openDrawer()
  }
  onClose(){
    this.refs['DRAWER'].closeDrawer()
  }

  isInside () {
    return(
      <View style={{flex:4, alignItems:'center', marginTop : '20%'}} >
        <Image
          source={require('../images/inside.png')}
        />
        <Text style={{fontWeight:'bold'}}>Campus :{this.state.campus.name}</Text>
        <Text style={{textAlign: 'center'}}>Address : {this.state.campus.address}</Text>
      </View>
    )
   
  }
  isOutside(){
    return (
      <View style={{flex:4, alignItems:'center', marginTop : '40%'}} >

        <Image
          style={{width : 200, height: 200}}
          source={require('../images/outside.png')}
        />
        <Text style={{fontWeight:'bold'}}>{this.state.message}</Text>
      </View>
    )
  }
  render() { 
    const { navigate } = this.props.navigation;
    return (
    	<DrawerLayoutAndroid
    		ref={'DRAWER'}
		    drawerWidth={250}
		    drawerPosition={DrawerLayoutAndroid.positions.Left}
		    renderNavigationView={() => (<Nav navigate={navigate} screen={'Home'} onClose={this.onClose.bind(this)}/>)}>
        <Toolbar navigation={this.props.navigation} title={'Driving App'} isHome={true} counter={this.state.conter} onPress={this.onPress.bind(this)}/>
	      <View style={styles.container}>
          <View style={styles.cardContainer}>
            {this.state.campus ? this.isInside(): this.isOutside()}
          </View>
          <Text>Texto</Text>
          <MyFloatButton navigate={navigate}/>
        </View>
	    </DrawerLayoutAndroid> 
    )
  }
  
}

const styles = StyleSheet.create({
	container: {
	    flex: 1,
	    marginTop:45,
	   alignItems: 'center',
     backgroundColor : 'white'
	}, 
	  icon: { 
	    width: 30,
	    height: 25,
	},
	header: {
	    paddingTop: 16
	},
	text: {
	    marginTop: 20
	},
	imageLogo : {
    width : 400,
    height: 400
    
  },
  title : {
    fontSize : 20,
    fontWeight :"bold",
    color: "#2c3e50"
  },
  button: {
  	flex: 2
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  cardContainer:{
    alignItems:'center', 
    marginTop: 13,
    marginBottom :13,
    backgroundColor: "white",
  },
  cardAvatar:{
    flex:1,
    alignItems:'center', 
  }

});