import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ActivityIndicator} from 'react-native';
import firebase from './src/firebaseConnection';

console.disableYellowBox=true;

export default function App(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  async function signUp(){
    await firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(value => {
      firebase.database().ref('users').child(value.user.uid).set({
        name,
      })

      alert("User created!")
      setName('')
      setEmail('')
      setPassword('')
    })
    .catch(error => {
      alert("Something went wrong...")
    })
  }

  

  return(
    <View style={styles.container}>
      
      <Text style={styles.texto}>Name</Text>
      <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      onChangeText={(text) => setName(text) }
      value={name}
      />

      <Text style={styles.texto}>E-mail</Text>
      <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      onChangeText={(text) => setEmail(text) }
      value={email}
      />

      <Text style={styles.texto}>Password</Text>
      <TextInput
      style={styles.input}
      underlineColorAndroid="transparent"
      onChangeText={(text) => setPassword(text) }
      value={password}
      />

      <Button
      title="Sign Up"
      onPress={signUp}
      />
     
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    margin: 10,
  },
  texto: {
    fontSize: 20,
  },
  input:{
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#121212',
    height: 45,
    fontSize: 17
  }
});