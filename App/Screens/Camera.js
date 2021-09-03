import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View,TouchableHighlight,Alert,Image,Modal,Dimensions,ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { withNavigation } from 'react-navigation';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import {showMessage} from "react-native-flash-message"; 
import mime from "mime"
import ImageZoom from 'react-native-image-pan-zoom';
import * as SecureStore from 'expo-secure-store';
import { ImageSetContext } from '../../Context/imageSet-Context';
import SelectDropdown from 'react-native-select-dropdown'
import { AntDesign } from '@expo/vector-icons'; 
import Tutorial from '../Tutorial/Tutorial';
import NetInfo from "@react-native-community/netinfo";
import Logout from '../Log Out/Logout';

 class CameraScreen extends React.Component {

  static contextType = ImageSetContext;

  state={
    photo:null,
    fileName:'data:image/jpg;base64,',
    jsonData:null,
    modalVisible: false,
    loadingModalVisible:false,
    newImageSet:null,
    targetLanguage:'ro'
  }

  async componentDidMount(){
    this.connectToServer();
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  setModalLoadingVisible = (visible) => {
    this.setState({ loadingModalVisible: visible });
  }

  handleSave=()=>{
    this.setModalVisible(false)
    this.context.addImageSet(this.state.newImageSet)
  }

  handleDiscard= async ()=>{
    this.setModalVisible(false)
    this.setState({newImageSet:null})

    let accessToken = await SecureStore.getItemAsync('accessToken')

    fetch('http://100.64.102.26:10000/api/discard', {
      method: "DELETE",
      headers:{'Authorization': 'Bearer '+accessToken}
    }) 
    .then(response => response.json())
      .then((response) => {
        if(!response) throw new Error(response.status);
      })
      .catch(error => {
        console.log("Discard error", error);
      });
  }

  savedata = (responseText) => {
       this.setState({fileName: 'data:image/png;base64,'+responseText.message});
   } 

  createFormData = (photo,body) => {
    const newImageUri =  "file:///" + photo.uri.split("file:/").join("");
    const data = new FormData();
    data.append("photo", {
      name: newImageUri.split("/").pop(),
      type: mime.getType(newImageUri),
      uri: newImageUri
    });
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };
  
    handleUploadPhoto =  async () => {
      let accessToken = await SecureStore.getItemAsync('accessToken')
      fetch('http://100.64.102.26:10000/api/upload', {
        method: "POST",
        headers:{'Authorization': 'Bearer '+accessToken},
        body: this.createFormData(this.state.photo,{language:this.state.targetLanguage})
      }) 
      .then(response => response.json())
        .then(data => {
          this.savedata(data)
          this.setState({newImageSet:data.newImageSet})
          this.setState({ photo: null });
          this.setModalVisible(true)
          this.setModalLoadingVisible(false)
        })
        .catch(error => {
          this.setModalVisible(false)
          this.setModalLoadingVisible(false)
          console.log("upload error", error);
          alert("Upload failed!");
        }); 
    };

  pickFromGallery = async () =>{
    NetInfo.fetch().then(async networkState => {
      if(networkState.isConnected){ 
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
          let data = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:1.0,
            includeBase64:true
          })
          if(data.uri){
            this.setState({photo:data})
            this.handleUploadPhoto()
            this.setModalLoadingVisible(true)
          }
        }
        else{
          Alert.alert("The app requests permission to gallery.")
        }
      }
      else{
        showMessage({
          message: "Please connect to the internet",
          description: "Network error",
          type: "warning",
      })
      }
    })
  }

  pickFromCamera = async () =>{
    NetInfo.fetch().then(async networkState => {
      if(networkState.isConnected){
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
          let data = await ImagePicker.launchCameraAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.Images,
            allowsEditing:true,
            aspect:[1,1],
            quality:1.0
          })
          if(data.uri){
            this.setState({photo:data})
            this.handleUploadPhoto()
            this.setModalLoadingVisible(true)
          }
        }
        else{
          Alert.alert("The app requests permission to camera.")
        }
      }
      else {
        showMessage({
          message: "Please connect to the internet",
          description: "Network error",
          type: "warning",
      })
      }
    })
  }

  connectToServer= async () => {
    const timeout = new Promise((resolve, reject) => {
      setTimeout(reject, 1500, 'Request timed out');
  });

  let accessToken = await SecureStore.getItemAsync('accessToken')
  
  const request = fetch('http://100.64.102.26:10000/',{
    method: "GET",
    headers:{'Authorization': 'Bearer '+accessToken}
  });

  return Promise
      .race([timeout, request])
      .then(response => {showMessage({
        message: "Connection established",
        description: "The OCR server is online",
        type: "success",
      })
    })
      .catch(error => {showMessage({
        message: "Connection failed",
        description: "The OCR server is offline",
        type: "warning",
      })
    }
    );
  }

  selectLanguage = (language) =>{
    if(language=='Romanian'){
      this.setState({targetLanguage:'ro'})
    }
    else if(language=='English')
    {
      this.setState({targetLanguage:'en'})
    }
    else if(language=='French')
    {
      this.setState({targetLanguage:'fr'})
    }
    else if(language=='Spanish')
    {
      this.setState({targetLanguage:'es'})
    }
    else if(language=='German')
    {
      this.setState({targetLanguage:'de'})
    }
  }

  render(){

    const { modalVisible,loadingModalVisible } = this.state;

    const languages = ["Romanian", "English", "French", "Spanish","German"]

    return (
      <View style={styles.container}>

        {this.context.infoScreenVisible ? <Tutorial/> : <View/>}
        {this.context.logoutScreenVisible ? <Logout/>:<View/>}
        <Modal 
        animationType="slide"
        transparent={true}
        visible={loadingModalVisible}
        onRequestClose={() => {
            this.setModalLoadingVisible(!loadingModalVisible);}}
        >
          <View style={styles.centeredView}>
            <Text style={styles.TextLoadingModal}>The image is being processed..</Text>
            <ActivityIndicator style={styles.ActivityIndicator} size="large" color="#00ff00" />
          </View>
        </Modal>

        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
            this.setModalVisible(!modalVisible);
        }}
        >
          <View style={styles.centeredView}>
            <ImageZoom 
                style={styles.ImageZoom}
                cropWidth={Dimensions.get('window').width}
                cropHeight={Dimensions.get('window').height*0.6}
                imageWidth={Dimensions.get('window').width}
                imageHeight={Dimensions.get('window').height}
                pinchToZoom={true}>

              <Image source={{uri:this.state.fileName}} style={styles.ModalImage}></Image>

            </ImageZoom>

              <View style={styles.modalView}>

                <TouchableHighlight style={styles.HighlightModalSave} onPress={() => this.handleSave()}>
                  <Text style={styles.modalText}>Keep</Text>
                </TouchableHighlight>

                <TouchableHighlight style={styles.HighlightModalDiscard} onPress={() => this.handleDiscard()}>
                  <Text style={styles.modalText}>Discard</Text>
                </TouchableHighlight>

              </View>

          </View>

        </Modal>

        <View style={styles.fixToText}>
          <View style={styles.uploadButtons}>

            <TouchableHighlight onPress={() => this.pickFromGallery()} style={styles.GalleryButton}>
              <View style={styles.buttonView}>
                <Text style={styles.ButtonText}>Upload picture</Text>
                <AntDesign name="upload" size={24} color="white" /> 
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.pickFromCamera()} style={styles.CameraButton}>
              <View style={styles.buttonView}>
                <Text style={styles.ButtonText}>Snap a picture</Text>
                <AntDesign name="camerao" size={24} color="white" />    
              </View>
            </TouchableHighlight>

          </View>

          <View style={styles.dropDownView}>
            <SelectDropdown
                data={languages}
                defaultButtonText="Target language"
                buttonStyle={styles.DropDown}
                buttonTextStyle={styles.DropDownText}
                onSelect={(selectedItem, index) => {
                  this.selectLanguage(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
            />
          </View>

        </View>
        
        <StatusBar backgroundColor="#d9593c" style="auto" />

        <TouchableHighlight style={styles.HighlightCamera}  >
          <View style={styles.Button}>
            <Text style={styles.ButtonText}>Camera</Text>
          </View>
        </TouchableHighlight>

        <TouchableHighlight style={styles.HighlightGallery} onPress={() => { this.props.navigation.navigate('Gallery') }} >
          <View style={styles.Button}>
              <Text style={styles.ButtonText}>Gallery</Text>
          </View>
        </TouchableHighlight>

      </View>
  );
}
}

export default withNavigation(CameraScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Button:{
    backgroundColor:'#f57c5a',
    height:'100%'
},
CameraButton:{
padding: 10,
backgroundColor:'#fac146',
},
DropDown:{
backgroundColor:'#c45d4b'
},
DropDownText:{
color:'white',
fontSize:16,
fontWeight:'bold'
},
fixToText: {
  flexDirection: 'column',
  justifyContent: 'space-evenly',
},
uploadButtons:{
  flexDirection: 'row',
  justifyContent: 'space-evenly',
 // borderTopWidth:2,
  borderBottomWidth:2,
  borderColor:'#d9593c',
  paddingTop:5,
  paddingBottom:10,
  width:'90%'
},
buttonView:{
    flexDirection: 'row',
    justifyContent: 'space-evenly',
},
GalleryButton:{
  padding: 10,
  backgroundColor:'#6e4bc4'
  },
ButtonText:{
    color:'white',
    fontWeight:'bold',
    textAlign:"center",
    marginTop:5,
    fontSize:16,
    marginBottom:4
},
HighlightCamera:{
    backgroundColor:'#f57c5a', 
    position: 'absolute',
    bottom:0,
    left:0,
    width:'50%',
    height:'5%',
},
logo: {
  width: 300,
  height: 200,
  borderRadius:15,
  paddingTop:15
},
HighlightGallery:{
    backgroundColor:'#f57c5a', 
    position: 'absolute',
    bottom:0,
    right:0,
    width:'50%',
    height:'5%'
},
ViewContainer:{
  width:"45%",
  height:"80%",
  marginLeft:'2%',
  marginRight:'2%',
  marginTop:'4%'
},
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "white",
},
ImageZoom:{
  backgroundColor:'white'    
},
ModalImage:{
  width:'100%',
  height:'50%',
  resizeMode: 'contain',
  marginTop:200      
},
modalText:{
  borderRadius:20,
  fontWeight:'bold',
  color:'white',
  width:'100%',
  height:'100%',
  textAlign:'center',
  textAlignVertical:'center'
},
HighlightModalSave:
{
  backgroundColor:'green',
  marginTop:20,
  width:70,
  height:30,
  marginRight:'10%',
},
HighlightModalDiscard:
{
  backgroundColor:'red',
  width:70,
  height:30,
  marginTop:20
},
TextLoadingModal:{
  fontWeight: 'bold',
},
ActivityIndicator:{
  marginTop:15
},
modalView:{
  flex:1,
  flexDirection:'row'
},
dropDownView:{
justifyContent:'center',
alignItems:'center',
marginTop:10
}
});