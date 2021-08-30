import React from 'react';
import { StyleSheet, Text, View,TouchableHighlight,Image } from 'react-native';
import ExpandingImage from '../ExpandableImage/ExpandingImage';
import {ImageSetContext} from '../../Context/imageSet-Context'

export default class ImageSet extends React.Component{

    static contextType = ImageSetContext;

    render()
    {
        return (
            <View style={styles.SetContainer}>
                <ExpandingImage displayMessage={()=>this.props.displayMessage()} forceRender={()=>this.props.forceRender()}Image={this.props.OriginalImage} style={styles.LeftImage} deleteImageSet={()=>this.context.deleteImageSet(this.props.SetId)}></ExpandingImage>
                <ExpandingImage displayMessage={()=>this.props.displayMessage()} forceRender={()=>this.props.forceRender()} Image={this.props.ProcessedImage} style={styles.RightImage} deleteImageSet={()=>this.context.deleteImageSet(this.props.SetId)}></ExpandingImage>
            </View>
    );
}
}
const styles = StyleSheet.create({
    SetContainer:{
        backgroundColor:'white',
        width:'90%',
        height:150,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft:'5%',
        borderTopWidth:2,
        borderTopColor:'#4bc491'
    },
    LeftImage:{
        alignSelf:'flex-start',
    },
    RightImage:{
        alignSelf:'flex-end',
    }
});