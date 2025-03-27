import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from '@expo/vector-icons';
import Home from "../screens/Home";
import CameraScreen from "../screens/CameraScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import SignatureScreen from "../screens/SignatureScreen";
import LocationScreen from "../screens/LocationScreen";

const Tab = createBottomTabNavigator();

export function Routes() {
  return (
    <Tab.Navigator screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitle: "POC. App",
          headerTitleStyle: {
            color: "white"
          },
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="camera-alt" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitle: "Tirar Foto",
          headerTitleStyle: {
            color: "white"
          }
        }}
      />
      <Tab.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          tabBarButton: () => null,
          headerStyle: {
            backgroundColor: "black",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitle: "Detalhes do Post",
          headerTitleStyle: {
            color: "white"
          }
        }}
      />
      <Tab.Screen
        name="Signature"
        component={SignatureScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="edit" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitle: "Assinatura",
          headerTitleStyle: {
            color: "white"
          }
        }}
      />
      <Tab.Screen
        name="Location"
        component={LocationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="location-on" size={size} color={color} />
          ),
          headerStyle: {
            backgroundColor: "black",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitle: "Minha Localização",
          headerTitleStyle: {
            color: "white"
          }
        }}
      />
    </Tab.Navigator>
  );
}