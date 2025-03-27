## Como instalar com túnelamento

1) baixar comand-line tools, apenas sdk zipado(commandlinetools-win-11076708_latest.zip)
https://developer.android.com/studio?hl=pt-br#command-line-tools-only

2) descompactar zip em C:\Users\vinicius.petini\app-resource

3) editar variável PATH para corresponder binário
C:\Users\vinicius.petini\app-resource\commandlinetools-win-11076708_latest\cmdline-tools\bin

4) criar pastar C:\Users\vinicius.petini\app-resource\android

5) instalar sdk na pasta acima e definir variável ANDROID_HOME 
sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" --sdk_root=C:\Users\vinicius.petini\app-resource\android\sdk

6) ANDROID_HOME deve ser o valor: C:\Users\vinicius.petini\app-resource\android\sdk

7) editar variável PAHT para adicionar adb: 
C:\Users\vinicius.petini\app-resource\android\sdk\platform-tools

8) Ativar modo desenvolvedor no seu celular

9) Ativar modo de depuração nas configurações do desenvolvedor

10) Fazer cadastro no ngrok

11) Autenticar no ngrok com:
ngrok config add-authtoken $YOUR_AUTHTOKEN

12) iniciar ngrok na porta 8081: 
ngrok http 8081 --host-header=localhost

13) guardar a url https do ngrok: 
https://903d-177-5-247-196.ngrok-free.app

14) iniciar o expo com host local:
npx expo start --host localhost

15) abrir expo no smartphone e acessar via url, trocar https:// por exp://
exp://903d-177-5-247-196.ngrok-free.app

16) apertar A para abrir no smartphone