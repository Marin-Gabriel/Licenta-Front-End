import React from 'react';
import {StyleSheet, Modal, Text, View,TouchableHighlight,Image,Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import {ImageSetContext} from '../../Context/imageSet-Context'
import NetInfo from "@react-native-community/netinfo";

export default class ExpandingImage extends React.Component{

    static contextType = ImageSetContext;

    state={
        modalVisible: false,
        deleteModalVisible:false
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
    
    setDeleteModalVisible = (visible) =>{
        this.setState({ deleteModalVisible: visible });
    }

    atemptDelete = () =>{
        NetInfo.fetch().then(async networkState => {
            if(networkState.isConnected){
                this.setDeleteModalVisible(true) 
            }
            else{
                this.props.displayMessage()
            }
        })
    }

    handleConfirmDelete = async () =>{
        await this.props.deleteImageSet()
        this.props.forceRender()
        this.setDeleteModalVisible(false)
    }

    render()
    {
        const { modalVisible, deleteModalVisible } = this.state;

        return(

            <View style={styles.ViewContainer}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                    this.setDeleteModalVisible(!modalVisible);
                }}
                >
                <View style={styles.OpaqueView}>               
                    <View style={styles.deleteContainer}>
                        <Text style={styles.deleteModalText}>This action is not reversible. Are you sure you want to delete the image set?</Text>
                        <View style={styles.highlightContainers}>
                            <TouchableHighlight style={styles.highlightDelete} onPress={()=>this.handleConfirmDelete()}>
                                <Text style={styles.highlightText}>Delete</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.highlightCancel} onPress={()=>this.setDeleteModalVisible(false)}>
                                <Text style={styles.highlightText}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
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
                        <Image source={{uri:this.props.Image}} style={styles.ModalImage}></Image>
                    </ImageZoom>
                    <View style={styles.modalView}>
                        <TouchableHighlight onPress={() => this.setModalVisible(!modalVisible)}>
                            <Text style={styles.modalText}>Close</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
            
                <TouchableHighlight delayLongPress={1000} onLongPress={()=>this.atemptDelete()} onPress={() => this.setModalVisible(!modalVisible)} style={styles.ImageContainer}>
                    <View>
                        <Image source={{uri:this.props.Image}} style={styles.Image}></Image>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ViewContainer:{
        width:"45%",
        height:"80%",
        marginLeft:'2%',
        marginRight:'2%',
        marginTop:'4%'
    },
    ImageContainer:{
        width:"100%",
        height:"100%",
    },
    Image:{
        width:'100%',
        height:'100%',
        borderWidth:3,
        borderColor:'#f2f2f2'
        
    },
    ModalImage:{
        width:'100%',
        height:'50%',
        resizeMode: 'contain',
        marginTop:200      
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        }
    },
    modalText:{
        backgroundColor:'green',
        fontWeight:'bold',
        color:'white',
        width:70,
        height:30,
        textAlign:'center',
        textAlignVertical:'center'
    },
    ImageZoom:{
        backgroundColor:'white'    
    },
    deleteContainer:{
        backgroundColor:'white',
        alignContent:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:'40%',
        width:'70%',
        height:'30%',
        borderRadius:10
    },
    OpaqueView:{
        backgroundColor:'rgba(227,222,213,0.7)',
        width:'100%',
        height:'100%'
    },
    deleteModalText:{
        fontWeight:'bold',
        textAlign:'center',
        marginBottom:10,
        marginTop:60
    },
    highlightDelete:{
        backgroundColor:'red',
        width:70,
        height:30,
        justifyContent:'center',
        marginRight:20
    },
    highlightCancel:{
        backgroundColor:'#6e4bc4',
        width:70,
        height:30,
        justifyContent:'center',
    },
    highlightContainers:{
        marginTop:20,
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        width:'100%'
    },
    highlightText:{
        color:'white',
        fontWeight:'bold',
        alignSelf:'center'
    }
});