import { Buffer } from "buffer";
import * as DocumentPicker from "expo-document-picker";
import * as FileReader from "expo-file-system";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
export default function App() {
  const { width, height } = Dimensions.get("screen");

  const [file, setFile] = useState<{ base64: string; type: string }>({
    base64: "",
    type: "",
  });
  const [uri, setUri] = useState("");

  async function handleReceivedFile(uri: string) {
    try {
      const fileData = await FileReader.readAsStringAsync(uri);
      const base64Data = Buffer.from(fileData).toString("base64");
      return base64Data;
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Algo deu errado");
    }
  }

  async function upload() {
    setFile({ base64: "", type: "" });
    const { assets, canceled } = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (canceled) {
      Alert.alert("Cancelado", "acção cancelada pelo usuário");
    } else {
      const { uri, mimeType } = assets[0];
      const base64 = await handleReceivedFile(uri);
      setFile({ base64: `data:${mimeType};base64,${base64}`, type: mimeType });
      setUri(uri);
      ToastAndroid.show("Documento carregado", 100);
    }
  }

  return (
    <View style={styles.container}>
      {file.base64.trim().length !== 0 && (
        <>
          {file.type === "application/pdf" ? (
            <Pdf
              source={{ uri }}
              style={{
                width: (90 / 100) * width,
                height: (70 / 100) * height,
              }}
            />
          ) : (
            <Image
              source={{ uri }}
              style={{ width: (90 / 100) * width, height: (70 / 100) * height }}
              onError={(e) => {
                Alert.alert("Erro ao carregar imagem", e.nativeEvent.error);
              }}
            />
          )}
        </>
      )}
      <TouchableOpacity
        style={{
          width: "100%",
          borderRadius: 16,
          padding: 8,
          alignItems: "center",
          backgroundColor: "#3b56",
          position: "absolute",
          bottom: 16,
        }}
        onPress={upload}
      >
        <Text>Upload</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    position: "relative",
  },
});
