import React from 'react';
import { StyleSheet, Text,Alert, View,TouchableHighlight,Image,ScrollView,FlatList,TextInput,Modal } from 'react-native';
import FlashMessage from "react-native-flash-message";
import {showMessage, hideMessage} from "react-native-flash-message"; 
import NetInfo from "@react-native-community/netinfo";

class StartScreen extends React.Component {

    state={
        username:'',
        password:'',
        loginModalVisible:false,
        registerModalVisible:false,
        inputError:false,
        errorMessage:'ERROR',
        logo:require('../TestImages/logo2.jpg')
    }

    setUsername = (text) => {
        this.setState({ username:text });
      }

    setPassword = (text) => {
        this.setState({ password:text });
      }

    setModalLoginVisible = (visible) => {
        this.setState({ loginModalVisible: visible });
      }

    setModalRegisterVisible = (visible) => {
        this.setState({ registerModalVisible: visible });
      }
    
    setInputError = (value) =>{
        this.setState({ inputError: value });
    }

    setErrorMessage = (message) =>{
        this.setState({ errorMessage: message });
    }

    handleLoginBackPress = (visible) => {
        this.setModalLoginVisible(visible)
        this.setInputError(false)
    }

    handleRegisterBackPress = (visible) => {
        hideMessage();
        this.setModalRegisterVisible(visible)
        this.setInputError(false)
    }

    checkForErrors = (targetScreen) =>{
        if(targetScreen=='Register'){
            if(this.state.username.length==0)
            {
                this.setErrorMessage("Please fill in the username field")
                this.setInputError(true)
                return true      
            }
            else if(this.state.password.length==0)
            {
                this.setErrorMessage("Please fill in the password field")
                this.setInputError(true)
                return true
            }
            else if(this.state.password.length>18)
            {
                this.setErrorMessage("The password should not exceed 18 characters")
                this.setInputError(true)
                return true
            }
            else if(this.state.password.length<8)
            {
                this.setErrorMessage("The password should be at least 8 characters")
                this.setInputError(true)
                return true
            }
            return false
        }
        else{
            if(this.state.username.length==0)
            {
                this.setErrorMessage("Please fill in the username field")
                this.setInputError(true)
                return true      
            }
            else if(this.state.password.length==0)
            {
                this.setErrorMessage("Please fill in the password field")
                this.setInputError(true)
                return true
            }
            else if(this.state.password.length>18)
            {
                this.setErrorMessage("The password should not exceed 18 characters")
                this.setInputError(true)
                return true
            }
            return false
        }
        
    }

    atemptLogin=()=>{
        NetInfo.fetch().then(networkState => {
            if(networkState.isConnected){
                var inputErrors=this.checkForErrors('Login')
                //console.log(inputErrors)
                if(inputErrors){
                    console.log('erori login')
                }
                else{
                    fetch('http://45.88.173.109:10000/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: this.state.password
                    })
                    })
                    .then((response) => {
                        if(!response.ok) throw new Error(response.status);
                        else return response.json();
                      })
                    .then(data => {
                        if(data.ok)
                            console.log(data.accessToken)
                            this.props.callback(true,data.accessToken)
                    })
                    .catch(error => {
                    console.log("login error", error);
                    console.log(error.message)
                    if(error.message==404)
                    {
                        showMessage({
                            message: "Login Failed",
                            description: "Incorrect credentials",
                            type: "warning",
                        })
                    }
                    else if(error.message==500)
                    {
                        showMessage({
                            message: "Login Failed",
                            description: "Internal server error",
                            type: "warning",
                        })
                    }
                    });
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

    atemptRegistration=()=>{
        NetInfo.fetch().then(networkState => {
            if(networkState.isConnected){
                var inputErrors=this.checkForErrors('Register')
                if(inputErrors){
                    console.log('erori register')
                }
                else{
                fetch('http://45.88.173.109:10000/register', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.state.username,
                        password: this.state.password
                    })
                    })
                    .then((response) => {
                        if(!response.ok) throw new Error(response.status);
                        else return response.json();
                      })
                    .then(data => {
                        if(data.ok)
                        {
                            showMessage({
                                message: "Registration Successful",
                                description: "The account has been created",
                                type: "success",
                            })
                        }
                        console.log(data.ok)
                    })
                    .catch(error => {
                    console.log("register error", error);
                    if(error.message==409)
                    {
                        showMessage({
                            message: "Registration Failed",
                            description: "An account with this username already exists",
                            type: "warning",
                        })
                    }
                    else if(error.message==500)
                    {
                        showMessage({
                            message: "Registration Failed",
                            description: "Internal server error",
                            type: "warning",
                        })
                    }
                    });
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

    render () 
    {
        const {loginModalVisible,registerModalVisible,inputError,errorMessage} = this.state;

        return (
            
            <View>

                <Modal 
                animationType="slide"
                transparent={false}
                visible={loginModalVisible}
                onRequestClose={() => {
                    this.setModalLoginVisible(loginModalVisible);}}
                >

                <View style={styles.InputsContainer}>
                    {inputError ? <Text style={styles.ErrorMessage}>{errorMessage}</Text> : null }
                    <TextInput placeholder=" Username" textAlign='center' maxLength={30} onChangeText={text => this.setUsername(text)} style={styles.TextInput}></TextInput>
                    <TextInput placeholder=" Password" textAlign='center' maxLength={30} onChangeText={text => this.setPassword(text)} secureTextEntry={true} style={styles.TextInput}></TextInput>
               </View>
               <View style={styles.HighlightsContainer}>
                    <TouchableHighlight style={styles.LoginHighlight} onPress={() => this.atemptLogin()}>
                        <Text style={styles.HighlightTextLogin}>Login</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.BackHighlight} onPress={() => this.handleLoginBackPress(!loginModalVisible)}>
                        <Text style={styles.HighlightTextBack}>Back</Text>
                    </TouchableHighlight>
               </View>
               <FlashMessage position="top" />
                </Modal>
 
                <Modal 
                animationType="slide"
                transparent={false}
                visible={registerModalVisible}
                onRequestClose={() => {
                    this.setModalRegisterVisible(registerModalVisible);}}
                >

                    <View style={styles.InputsContainer}>
                        {inputError ? <Text style={styles.ErrorMessage}>{errorMessage}</Text> : null }
                        <TextInput placeholder=" Username" textAlign='center' maxLength={30} onChangeText={text => this.setUsername(text)} style={styles.TextInput}></TextInput>
                        <TextInput placeholder=" Password" textAlign='center' maxLength={30} onChangeText={text => this.setPassword(text)} secureTextEntry={true} style={styles.TextInput}></TextInput>
                    </View>
                    <View style={styles.HighlightsContainer}>
                        <TouchableHighlight style={styles.RegisterHighlight} onPress={() => this.atemptRegistration()}>
                            <Text style={styles.HighlightTextRegister}>Register</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.BackHighlight} onPress={() => this.handleRegisterBackPress(!registerModalVisible)}>
                            <Text style={styles.HighlightTextBack}>Back</Text>
                        </TouchableHighlight>
                    </View>
                    <FlashMessage position="top" />
                </Modal>

                <View style={styles.LogoView}>
                    <Image source={this.state.logo} style={styles.Logo}></Image>
                </View>

               <View style={styles.StartHighlightsContainer}>
                    <TouchableHighlight style={styles.StartLoginHighlight} onPress={() => this.setModalLoginVisible(true)}>
                        <Text style={styles.StartHighlightTextLogin}>Login</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.StartRegisterHighlight} onPress={() => this.setModalRegisterVisible(true)}>
                        <Text style={styles.StartHighlightTextRegister}>Register</Text>
                    </TouchableHighlight>
               </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    InputsContainer:{
        marginTop:'20%',
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
        height:'40%'
    },
    HighlightsContainer:{
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    StartHighlightsContainer:{
        marginTop:0,
        alignItems: 'center',
        width:'100%',
        height:'100%'
    },
    TextInput:{
        width:'60%',
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
    LoginHighlight:{
    marginTop:20,
    backgroundColor:'#4bc491',
    width:'50%',
    height:50
    },
    BackHighlight:{
        marginTop:20,
        backgroundColor:'#f2b124',
        width:'50%',
        height:50
    },
    RegisterHighlight:{
        marginTop:20,
        backgroundColor:'blue',
        width:'50%',
        height:50
    },
    StartLoginHighlight:{
        marginTop:25,
        backgroundColor:'#4bc491',
        width:250,
        height:60
    },
    StartRegisterHighlight:{
        marginTop:60,
        backgroundColor:'blue',
        width:250,
        height:60
    },
    HighlightTextLogin:{
        backgroundColor:'#4bc491',
        fontWeight:'bold',
        color:'white',
        width:'100%',
        height:'100%',
        textAlign:'center',
        textAlignVertical:'center'
    },
    HighlightTextBack:{
        backgroundColor:'#f2b124',
        fontWeight:'bold',
        color:'white',
        width:'100%',
        height:'100%',
        textAlign:'center',
        textAlignVertical:'center'
    },
    StartHighlightTextLogin:{
        backgroundColor:'#4bc491',
        fontWeight:'bold',
        color:'white',
        width:'100%',
        height:'100%',
        textAlign:'center',
        textAlignVertical:'center'
    },
    HighlightTextRegister:{
        backgroundColor:'#57bdd4',
        fontWeight:'bold',
        color:'white',
        width:'100%',
        height:'100%',
        textAlign:'center',
        textAlignVertical:'center'
    },
    StartHighlightTextRegister:{
        backgroundColor:'#57bdd4',
        fontWeight:'bold',
        color:'white',
        width:'100%',
        height:'100%',
        textAlign:'center',
        textAlignVertical:'center'
    },
    ErrorMessage:{
        color:'red'
    },
    LogoView:{
        width:"100%",
        height:"30%",
        marginTop:20,
        alignItems: 'center',
        justifyContent:'center'
    },
    Logo:{
        width:"50%",
        height:"50%"
    }
})

export default StartScreen;