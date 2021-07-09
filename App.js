import React from 'react'
import 'react-native-gesture-handler';
import { View, StatusBar } from 'react-native'
import AddEntry from './components/AddEntry'
import History from './components/History'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { purple, white, gray } from './utils/colors'

const Tab = createBottomTabNavigator();

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: 60 }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const App = () => {
  return (
    <Provider store={createStore(reducer)}>
      <View style={{ flex: 1 }}>
        <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused }) => {
                let iconName;
                if (route.name === 'History') {
                  iconName = 'bookmark'
                }
                else if (route.name === 'AddEntry') {
                  iconName = 'plus-square'
                }
                return <FontAwesome name={iconName} size={24} color={focused ? purple : gray} />
              }
            })}
            tabBarOptions={{
              activeTintColor: purple,
              inactiveTintColor: gray,
              style: {
                height: 56,
                backgroundColor: white,
                shadowColor: 'rgba(0,0,0,0.24)',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 6,
                shadowOpacity: 1,
              }
            }}
          >
            <Tab.Screen name="History" component={History} />
            <Tab.Screen name="AddEntry" component={AddEntry} />
          </Tab.Navigator>
        </NavigationContainer>

      </View>
    </Provider >
  )
}



export default App
