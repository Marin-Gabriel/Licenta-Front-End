import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { ImageSetContext } from '../../Context/imageSet-Context';

export default class Header extends React.Component{

    static contextType = ImageSetContext;

    handleDisconnect = async () =>{
    this.context.setLogoutScreenVisible(true)
    }
    
    handleShowInfo = () =>{
        this.context.setInfoScreenVisible(true)
    }

    render () {
        return(
        <View style={styles.HeaderContainer}>
            <Entypo name="info" size={24} color="white" style={styles.InfoIcon} onPress={()=>this.handleShowInfo()}/>
            <Entypo name="log-out" size={24} color="white" style={styles.LogOutIcon} onPress={()=>this.handleDisconnect()}/>
            <View>
                <Text style={styles.HeaderText}>{this.props.Title}</Text>
            </View>
        </View>
        );
    }
}

const styles=StyleSheet.create({
    HeaderContainer:{
        width:'100%',
        height:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
    },
    HeaderText:{
        fontWeight:'bold',
        fontSize:20,
        color:'white'
    },
    LogOutIcon:{
        position:'absolute',
        right:5
    },
    InfoIcon:{
        position:'absolute',
        left:5
    }
})