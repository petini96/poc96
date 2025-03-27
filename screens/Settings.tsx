import {StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import {ComponentExample} from "../components/ComponentExample";
import {useHookExample} from "../hooks/useHookExample";

export default function Settings() {

    const hookExampleResponse = useHookExample();

    return (
        <View style={styles.container}>
            <StatusBar style="auto"/>
            <ComponentExample text={hookExampleResponse}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});