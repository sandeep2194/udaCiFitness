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
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { purple, white, gray } from './utils/colors'
import EntryDetail from './components/EntryDetail'
import Live from './components/Live'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Tabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="EntryDetail" component={EntryDetail}
        options={{
          headerTintColor: white,
          headerStyle: {
            backgroundColor: purple,
          },
        }}
      />
    </Stack.Navigator>
  );
}
function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'History') {
            icon = <FontAwesome name={'bookmark'} size={24} color={focused ? purple : gray} />
          }
          else if (route.name === 'AddEntry') {
            icon = <FontAwesome name={'plus-square'} size={24} color={focused ? purple : gray} />
          }
          else if (route.name === 'Live') {
            icon = <Ionicons name={'speedometer'} size={24} color={focused ? purple : gray} />
          }
          return icon
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
      <Tab.Screen name="Live" component={Live} />
    </Tab.Navigator>
  )
}
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
          <MainNavigator />
        </NavigationContainer>
      </View>
    </Provider >
  )
}



export default App
