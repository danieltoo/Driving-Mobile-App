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
  TextInput,
  Button
} from 'react-native';
import { NavigationActions } from 'react-navigation'

import OCB from '../services/OCBConnection'

import Toolbar from '../components/Toolbar'
import Nav from '../components/Nav'

export default class MakeAlertsScreen extends Component {
  
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this)
    this.checkType = this.checkType.bind(this)
    this.chageEvent = this.chageEvent.bind(this)
    this.chageDescription = this.chageDescription.bind(this)
    this.sendAlert = this.sendAlert.bind(this)
    this.state = {
    	userid : "",
      typeAlert : "",
      event:"",
      description: "",
      message : ""
    }
    
  } 

  componentDidMount() {

    let t = this
    AsyncStorage.getItem('userid').then((user) =>{
      t.setState({userid: user})
    })
    this.setState({typeAlert : this.props.navigation.state.params.type })
     
  }


  
  checkType (){
    if (this.props.navigation.state.params.type === 'Traffic Jam'){
      return (
          <Image style={styles.imageLogo} source={require('../images/icons/009-traffic-light.png')}/>
        )
    }else if(this.props.navigation.state.params.type === 'Speeding'){
       return (
          <Image style={styles.imageLogo} source={require('../images/icons/010-cone.png')}/>
        )
    }else{
       return (
          <Image style={styles.imageLogo} source={require('../images/icons/007-warning.png')}/>
        )
    }
  }


  sendAlert(){
    let t = this
    navigator.geolocation.getCurrentPosition((position) =>{
    
      AsyncStorage.getItem('device').then((device) =>{
        let alert = {
          id : `Alert:${device}:${Date.now()}`,
          type: "Alert",
          category: "Traffic",
          subCategory : t.state.typeAlert,
          location :{
            type : "geo:point",  
            value : `18.876420, -99.219536`
            //value : `${position.coords.latitude} ,${position.coords.longitude}`
          },
          dateObserved: new Date(),
          validFrom: new Date(),
          validTo: new Date(),
          description: t.state.description,
          alertSource: device,
          severity : "informational"
        }

        let newJson = OCB.sendAlert(alert)
        let backAction = NavigationActions.back()
        this.props.navigation.dispatch(backAction)
      })

    },
    (error) => {
        ToastAndroid.showWithGravity( error.message , ToastAndroid.SHORT, ToastAndroid.CENTER);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  
  chageEvent (text) { 
    this.setState({event : text})
  } 

  chageDescription (text) { 
    this.setState({description : text})
  } 

  onPress (){
    this.refs['DRAWER'].openDrawer()
  }
  onClose(){
    this.refs['DRAWER'].closeDrawer()
  }
  render() { 
    const { navigate } = this.props.navigation;

    return (
    	<DrawerLayoutAndroid
    		ref={'DRAWER'}
		    drawerWidth={250}
		    drawerPosition={DrawerLayoutAndroid.positions.Left}
		    renderNavigationView={() => (<Nav navigate={navigate} screen={'Home'} onClose={this.onClose.bind(this)}/>)}>
        <Toolbar navigation={this.props.navigation} title={'Make Alert'}  counter={this.state.conter} onPress={this.onPress.bind(this)}/>
        <ScrollView style={styles.container}> 
          <View style={{alignItems : 'center'}}> 
            <Text style={styles.title}>{this.props.navigation.state.params.type}</Text>
            {this.checkType()}
          </View>
          <Text>{this.state.message}</Text>
          <View style={{backgroundColor : 'white', marginBottom : 10}}>
            <TextInput onChangeText={this.chageDescription} placeholder={'Description'} style={styles.input} />
          </View>
          <Button title='Send Alert' style={styles.button} onPress={this.sendAlert}/>
        </ScrollView>
	    </DrawerLayoutAndroid> 
      
    )
  }
  
}



const styles = StyleSheet.create({
	container: {
	    flex: 1,
	    marginTop:55,
      //alignItems: 'center'
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
    width : 200,
    height: 200,
    marginBottom : 20,
    
  },
  title : {
    fontSize : 20,
    marginBottom : 20,
    marginTop : 20,
    fontWeight :"bold",
    color: "#2c3e50"
  },
  button: {
  	flex: 1,
    margin : 10
  },
  form:{
    backgroundColor : 'red'
  },
  input:{
    margin : 10
  }

});