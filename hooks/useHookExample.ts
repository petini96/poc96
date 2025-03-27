import {useState} from "react";

export function useHookExample() {
    const messages = ['Hello', 'Hola', 'Bonjour', 'Ciao', 'Namaste'];
    const [messageIndex, setMessageIndex] = useState(randomIntFromInterval(0, messages.length - 1));

    return messages[messageIndex];
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}