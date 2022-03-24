import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import {
   StyleSheet, 
   Text, 
   TextInput, 
   View, 
   SafeAreaView, 
   TouchableOpacity,
   FlatList,
   Keyboard
} 
from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import Login from './src/components/Login'
import TaskList from './src/components/TaskList';
import firebase from './src/services/firebaseConnection';

export default function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTasks] = useState('');
  const inputRef = useRef(null);
  const [key, setKey] = useState('')

  useEffect(() => {
    function getUser() {
      if(!user) {
        return;
      }

      firebase.database().ref('tasks').child(user).once('value', (snapshot) => {
        setTasks([])

        snapshot?.forEach((child) => {
          let data = {
            key: child.key,
            name: child.val().name
          }
          setTasks(oldTasks => [...oldTasks, data])
        })

      })
    }

    getUser()
  }, [user])


  function handleAdd() {

    if(newTask === '') {
      return;
    }

    if(key !== '') {
      
      firebase.database().ref('tasks').child(user).child(key).update({
        name: newTask
      })
      .then(() => {
        const taskIndex = tasks.findIndex(task => task.key === key)
        let taskClone = tasks;
        taskClone[taskIndex].name = newTask

        setTasks([...taskClone])

      })
      
      Keyboard.dismiss()
      setNewTasks('')
      setKey('')
      return;
    }
    else{
    
      let tasks  = firebase.database().ref('tasks').child(user)
      let key = tasks.push().key

      tasks.child(key).set({
        name: newTask,
      })
      .then(() => {
        const data = {
          key: key,
          name: newTask,
        }

        setTasks(oldTasks => [...oldTasks, data])
      })

      setNewTasks('')
      Keyboard.dismiss()
    }
  }

  function handleDelete(key) {
    firebase.database().ref('tasks').child(user).child(key).remove()
    .then(() => {
      const remainingTasks = tasks.filter(item => item.key !== key)
      setTasks(remainingTasks)
    })
  }

  function handleEdit(data) {
    setKey(data.key)
    setNewTasks(data.name)
    inputRef.current.focus()
  }

  function cancelEdit() {
    setKey('')
    setNewTasks('')
    Keyboard.dismiss()
  }

  if(!user) {
    return <Login changeStatus={user => setUser(user)}/>
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {key.length > 0 && (
        <View style={{flexDirection: 'row', marginBottom: 8}}>
          <TouchableOpacity onPress={cancelEdit}>
            <Feather name="x-circle" size={20} color="#ff0000"/>
          </TouchableOpacity>
          <Text style={{marginLeft: 5, color: '#ff0000'}}>
            You are editing this task!
          </Text>
        </View>
      )}
      
      <View style={styles.containerTask}>
        <TextInput 
          style={styles.textInput} 
          placeholder="What do you need to do today?"
          value={newTask}
          onChangeText={(text) => setNewTasks(text)}
          ref={inputRef}
        />

        <TouchableOpacity onPress={handleAdd} style={styles.buttonAdd}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList 
        data={tasks} 
        keyExtractor={item => item.key} 
        renderItem ={({item}) => (
          <TaskList data={item} editItem={handleEdit} deleteItem={handleDelete} />
        )} 
      />
      <StatusBar style="auto" />
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
  containerTask: {
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#141414',
    height: 45
  },
  buttonAdd: { 
    backgroundColor: '#141414',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingHorizontal: 14,
    borderRadius: 5
  }, 
  buttonText: {
    color: '#fff',
    fontSize: 22
  }
});
