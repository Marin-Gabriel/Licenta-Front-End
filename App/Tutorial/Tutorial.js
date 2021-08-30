import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,Image,Modal,FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ImageSetContext } from '../../Context/imageSet-Context';

export default class Tutorial extends React.Component{

    static contextType = ImageSetContext;

    state={
        Sections:[
            {SectionName:'Camera Screen',
            Subsections:
            [
                {Information:' By clicking the upload picture button you can pick a image of a text from the internal memory of the phone and send it to be translated.',key:'1'},
                {Information:' By clicking the snap a picture button you can take a live image of the text and send it to be translated.',key:'2'},
                {Information:' By clicking the target language dropdown you can select the language in which you want the text int the image to be translated to. If not selected the text will be translated to romanian',key:'3'},
                {Information:' After the image and language are selected you can send it to be processed. Do not turn of the internet connection while the image is being processed ',key:'4'},
                {Information:' After the processed image is shown you can double tap to zoom in',key:'5'},
                {Information:' You can store the original image and the processed image by clicking the keep button or you can discard the set by clicking the discard button',key:'6'}
            ],
            key:'A'},
            {SectionName:'Gallery screen',
            Subsections:
            [
                {Information:' Each image set contains the original image of the text (left) and the processed version (right)',key:'7'},
                {Information:' You can click on either for a closer inspection by double tapping to zoom in',key:'8'},
                {Information:' If you want to delete any of the image sets just press and hold on one of the images until the dialog box shows up',key:'9'}
            ],
            key:'B'},
            {SectionName:'Header',
            Subsections:
            [
                {Information:' You can press on the right icon to log out',key:'9'}
            ],
            key:'C'},
            {SectionName:'Navigation Bar',
            Subsections:
            [
                {Information:' You can use the bottom buttons to navigate between the camera screen and the gallery screen',key:'10'}
            ],
            key:'D'}
        ]
      }

    handleClose = () =>{
        this.context.setInfoScreenVisible(false)
    }

    render (){
        return(
            <Modal 
            animationType="slide"
            transparent={false}
            visible={this.context.infoScreenVisible}
            onRequestClose={() => {
                this.handleClose();}}
            >
                <View style={styles.container}>
                <FlatList
                data={this.state.Sections}
                renderItem={
                    ({item}) =>(
                    <View style={styles.sectionView} key={item.key}>
                        <Text style={styles.sectionNameText} key={item.SectionName}>{item.SectionName}</Text>
                        {item.Subsections.map(subsection=><Text style={styles.sectionInfoText} key={subsection.key}><Text style={styles.bulletPoint}>{'\u2B24'}</Text>{subsection.Information}</Text>)}
                    </View>
                    )
                } 
                />
                    <View style={styles.buttonContainer}>
                        <TouchableHighlight onPress={() =>  this.handleClose()} style={styles.closeButton}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        alignContent:'center',
        justifyContent: 'center',
    },
    buttonContainer:{
        marginTop:7,
        width:'100%',
        height:75,
        alignContent:'center'
    },
    closeButton: {
        width:75,
        height:30,
        backgroundColor:'red',
        alignSelf:'center'
    },
    buttonText:{
        color:'white',
        fontWeight:'bold',
        backgroundColor:'red',
        textAlign:'center',
        textAlignVertical:'center',
        height:'100%'
    },
    sectionView:{
        borderBottomWidth:2,
        marginTop:5,
        marginLeft:10,
        marginRight:10
    },
    sectionNameText:{
        fontWeight:'bold',
        fontSize:25,
        textAlign:'center'
    },
    sectionInfoText:{
        fontWeight:'bold',
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5  
    },
    bulletPoint:{
        color:'orange'
    }
  });