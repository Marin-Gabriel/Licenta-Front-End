import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import CameraScreen from '../App/Screens/Camera'
import GalleryScreen from '../App/Screens/Gallery'
import Header from '../App/Header/Header';
import React from 'react';

const screens={
    Camera: {
        screen: CameraScreen,
        navigationOptions:{
            headerTitle: () => <Header Title={'Camera'}/>,
            headerStyle: {
                backgroundColor: '#f57c5a',
              }
        }
    },
    Gallery: {
        screen: GalleryScreen,
        navigationOptions:{
            headerTitle: () => <Header Title={'Gallery'}/>,
            headerLeft: ()=> null,
            headerStyle: {
                backgroundColor: '#f57c5a',
              }
        }
    }
}

const stack=createStackNavigator(screens);

export default createAppContainer(stack);