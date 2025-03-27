declare module "react-native-signature-canvas" {
    import { Component } from "react";
    import { WebViewProps } from "react-native-webview";

    interface SignatureCanvasProps extends WebViewProps {
        ref?: React.Ref<any>;
        onOK?: (signature: string) => void;
        onEmpty?: () => void;
        onClear?: () => void;
        onBegin?: () => void;
        onEnd?: () => void;
        penColor?: string;
        descriptionText?: string;
        clearText?: string;
        confirmText?: string;
        webStyle?: string;
        autoClear?: boolean;
    }

    class SignatureCanvas extends Component<SignatureCanvasProps> {
        readSignature: () => void;
        clearSignature: () => void;
    }

    export default SignatureCanvas;
}