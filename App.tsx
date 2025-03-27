import {ThemeProvider} from "./themes/MainTheme";
import {NavigationContainer} from '@react-navigation/native';
import {Routes} from "./routes/Routes";
import {StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";


export default function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <Routes/>
            </NavigationContainer>
        </ThemeProvider>
    );
}



