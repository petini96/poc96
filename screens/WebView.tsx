import { WebView } from "react-native-webview";
import { StyleSheet, View } from 'react-native';

export default function WebViewScream() {
    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: 'https://youtube.com' }}
                style={styles.webview}
                javaScriptEnabled={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webview: {
        flex: 1,
    },
});
