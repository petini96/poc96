import {Text} from "react-native";

interface ComponentExampleParams {
    text: string
}

export function ComponentExample({text}: ComponentExampleParams) {
    return (
            <Text>{text}</Text>
        )
}