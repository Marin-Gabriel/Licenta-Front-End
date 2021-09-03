import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import Navigator from './Routes/Stack'
import StartScreen from './App/Screens/Start';
import * as SecureStore from 'expo-secure-store';
import { ImageSetContext } from './Context/imageSet-Context';
import FlashMessage from "react-native-flash-message";

class App extends React.Component {

  setImageSet = imageSet =>{
    this.setState({imageSet})
  }

  addImageSet = newImageSet =>{
    this.state.imageSet.push(newImageSet)
  }

  deleteImageSet = async deletedSetId =>{

    let accessToken = await SecureStore.getItemAsync('accessToken')

    fetch('http://100.64.102.26:10000/api/delete?SetId='+deletedSetId, {
      method: "DELETE",
      headers:{'Authorization': 'Bearer '+accessToken}
    }).then(response => response.json())
      .then((response) => {
        if(!response) {
          throw new Error(response.status);
        }
        else
        {
          if(this.state.imageSet.length==1)
          {
            this.setState({imageSet:[]})
          }
          else{
          for( var i = 0; i < this.state.imageSet.length; i++){ 
            if ( this.state.imageSet[i].key === deletedSetId) { 
              this.state.imageSet.splice(i, 1); 
            }
          }
        }
        }
      })
      .catch(error => {
        console.log("Delete error", error);
      });
  }

  setLogged = value =>{
    this.setState({isLoggedIn : value})
  }

  setLogoutScreenVisible = value =>{
    this.setState({logoutScreenVisible:value})
  }

  setInfoScreenVisible = value =>{
    this.setState({infoScreenVisible:value})
  }

  logOut = async () =>{
    this.setImageSet([])
    this.setLogged(false)
    await SecureStore.deleteItemAsync('accessToken')
  }
  state={
    logoutScreenVisible:false,
    infoScreenVisible:false,
    isLoggedIn : false,
    imageSet:[],
    setImageSet:this.setImageSet,
    addImageSet:this.addImageSet,
    deleteImageSet:this.deleteImageSet,
    setLogged:this.setLogged,
    logOut:this.logOut,
    setLogoutScreenVisible:this.setLogoutScreenVisible,
    setInfoScreenVisible:this.setInfoScreenVisible,
  }
  async save(key, value) {
    await SecureStore.setItemAsync(key, value);
  }

  login = (result,accessToken) =>{
    this.setState({
      isLoggedIn : result
    })

    if(result){
    this.save('accessToken',accessToken)
    fetch('http://100.64.102.26:10000/api/getImages',{
      method: "GET",
      headers:{'Authorization': 'Bearer '+accessToken,
        'Content-Type':'application/json'}
    })
    .then(response => response.json())
    .then((response) => {
      this.setImageSet(response)
      })
      .catch(error => {
        console.log("Get images error", error);
      });
    }
  }

  render ()
  {
    const navigator = <ImageSetContext.Provider value={this.state}><Navigator /><FlashMessage position="top" /></ImageSetContext.Provider>;
    const login=<View><StartScreen callback={this.login.bind(this)}></StartScreen></View>;
    let rendered;

    if(this.state.isLoggedIn){
      rendered=navigator;
    }
    else{
      rendered=login
    }

    return (
    rendered
    );}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;