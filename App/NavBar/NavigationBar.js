import React, { Component } from "react";
import { Text,StyleSheet,View,TouchableHighlight } from "react-native";
import { useNavigation } from '@react-navigation/native';


class NavigationBar extends React.Component {


    render () {

        const { navigation } = this.props;

        return(
            <React.Fragment>
            <TouchableHighlight style={styles.HighlightCamera} >
                <View style={styles.Button}>
                    <Text style={styles.ButtonText}>Camera</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.HighlightGallery} >
                <View style={styles.Button}>
                    <Text style={styles.ButtonText}>Gallery</Text>
                </View>
            </TouchableHighlight>
            </React.Fragment>
        );
    }
}

export default function(props){
    const navigation = useNavigation();
    return <NavigationBar {...props} navigation={navigation}/>
}

const styles=StyleSheet.create({
    Button:{
        backgroundColor:'#3bc491'
    },
    ButtonText:{
        color:'white',
        fontWeight:'bold',
        textAlign:"center",
        marginTop:5
    },
    HighlightCamera:{
        backgroundColor:'#4bc491', 
        position: 'absolute',
        bottom:0,
        left:0,
        width:'50%',
        height:'5%',
    },
    HighlightGallery:{
        backgroundColor:'#4bc491', 
        position: 'absolute',
        bottom:0,
        right:0,
        width:'50%',
        height:'5%'
    }
})