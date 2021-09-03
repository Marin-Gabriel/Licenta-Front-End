import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import ImageSet from '../ImageSet/ImageSet';
import {ImageSetContext} from '../../Context/imageSet-Context'
import Tutorial from '../Tutorial/Tutorial';
import {showMessage} from "react-native-flash-message"; 
import Logout from '../Log Out/Logout';
class GalleryScreen extends React.Component {

  static contextType = ImageSetContext;

  forceRender = () =>{
    this.forceUpdate()
  }

  displayMessage = () =>{
    showMessage({
      message: "Please connect to the internet",
      description: "Network error",
      type: "warning",
  })
  }

  render()
          {
            return (
            
            <View style={styles.container}>

              {this.context.infoScreenVisible ? <Tutorial/> : <View/>}
              {this.context.logoutScreenVisible ? <Logout/>:<View/>}

              <FlatList
              style={styles.FlatList} 
              ListEmptyComponent={() => <View style={styles.placeholder}><Text style={styles.placeholderShrug}>¯\_(ツ)_/¯</Text><Text style={styles.placeholderText}>You have no images stored yet.</Text></View>}
              data={this.context.imageSet}
              renderItem={
                ({item}) =>(<ImageSet displayMessage={()=>this.displayMessage()} forceRender={()=>this.forceRender()} OriginalImage={item.image} ProcessedImage={item.processedImage} SetId={item.key}></ImageSet>)
              } 
              />

              <StatusBar backgroundColor="#d9593c" style="auto" />
              <TouchableHighlight style={styles.HighlightCamera} onPress={() => { this.props.navigation.navigate('Camera') }} >
                  <View style={styles.Button}>
                    <Text style={styles.ButtonText}>Camera</Text>
                  </View>
              </TouchableHighlight>
              <TouchableHighlight style={styles.HighlightGallery}  >
                    <View style={styles.Button}>
                        <Text style={styles.ButtonText}>Gallery</Text>
                    </View>
              </TouchableHighlight>
            </View>
          );
        }
}

export default withNavigation(GalleryScreen);

const styles = StyleSheet.create({
  logo: {
    marginTop:200
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop:10
  },
  Button:{
    backgroundColor:'#f57c5a',
    height:'100%'
},
ButtonText:{
    color:'white',
    fontWeight:'bold',
    textAlign:"center",
    marginTop:5
},
HighlightCamera:{
    backgroundColor:'#f57c5a', 
    position: 'absolute',
    bottom:0,
    left:0,
    width:'50%',
    height:'5%',
},
HighlightGallery:{
    backgroundColor:'#f57c5a', 
    position: 'absolute',
    bottom:0,
    right:0,
    width:'50%',
    height:'5%'
},
ImageSet:{
  marginTop:15,
  paddingTop:15
},
FlatList:{
  width:'100%',
},
placeholder:{
  alignItems: 'center',
  justifyContent:"center",
  marginTop:200
},
placeholderText:{
  marginTop:10,
  fontWeight:'bold'
},
placeholderShrug:{
  fontSize:60,
  fontWeight:'bold'
}
});