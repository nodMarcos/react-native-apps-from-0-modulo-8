import { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import firebase from '../../services/firebaseConnection';

export default function Login({changeStatus}) {
  const [email, setEmail] = useState('');
  const [type, setType] = useState('login');
  const [password, setPassword] = useState('');

  function handleLogin() {
    if(type === 'login') {
      const user = firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        changeStatus(user.user.uid);
      })
      .catch(err => {
          console.log(err)
          alert("Something went wrong, please try again.")
          return 
      })
    }
    else {
      const user = firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        changeStatus(user.user.uid);
      })
      .catch(err => {
        console.log(err)
        alert("Something went wrong, please try again.")
        return 
    })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <TextInput 
        placeholder="Your e-mail"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        placeholder="*******"
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity 
        style={[styles.handleLogin, {backgroundColor: type === 'login' ? '#3ea6f2' : '#141414'}]}
        onPress={handleLogin}
      > 
        <Text style={styles.buttonText}>{type === 'login' ? "Login" : "Sign Up"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setType(type => type === 'login' ? "sign up" : "login")}> 
        <Text style={{textAlign: 'center'}}>{type === 'login' ? "Create an account" : "I already have an account"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 10,
    backgroundColor: '#f2f6fc'
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: '#141414'
  },
  handleLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 15,
    color: '#fff'
  }
});
