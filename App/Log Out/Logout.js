import React from 'react';
import {StyleSheet, Modal, Text, View,TouchableHighlight} from 'react-native';
import { ImageSetContext } from '../../Context/imageSet-Context';

export default class Logout extends React.Component{

    static contextType = ImageSetContext;

    handleClose = () =>{
        this.context.setLogoutScreenVisible(false)
    }

    handleConfirmLogout = () =>{
        this.context.setLogoutScreenVisible(false)
        this.context.logOut()
    }

    render () {
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.context.logoutScreenVisible}
                onRequestClose={() => {
                    this.handleClose();
                }}
                >
                <View style={styles.OpaqueView}>               
                    <View style={styles.logoutContainer}>
                        <Text style={styles.logoutModalText}>Are you sure you want to Log Out?</Text>
                        <View style={styles.highlightContainers}>
                            <TouchableHighlight style={styles.highlightLogout} onPress={()=>this.handleConfirmLogout()}>
                                <Text style={styles.highlightText}>Log Out</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={styles.highlightCancel} onPress={()=>this.handleClose()}>
                                <Text style={styles.highlightText}>Cancel</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    OpaqueView:{
        backgroundColor:'rgba(227,222,213,0.7)',
        width:'100%',
        height:'100%'
    },
    logoutContainer:{
        backgroundColor:'white',
        alignContent:'center',
        justifyContent:'center',
        alignSelf:'center',
        marginTop:'40%',
        width:'70%',
        height:'30%',
        borderRadius:10
    },
    logoutModalText:{
        fontWeight:'bold',
        textAlign:'center',
        marginBottom:10,
        marginTop:60
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
    },
    highlightLogout:{
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
})