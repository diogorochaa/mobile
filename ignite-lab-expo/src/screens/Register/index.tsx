import { useState } from "react";
import { VStack } from "native-base";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigation();

  const handleNewOrderRegister = () => {
    if (!patrimony || !description) {
      return Alert.alert("Info", "Informe o patrimônio e a descrição");
    }
    setIsLoading(true);
    firestore()
      .collection("orders")
      .add({
        patrimony,
        description,
        status: "open",
        createdAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Info", "Ordem registrada com sucesso");
        setIsLoading(false);
        setPatrimony("");
        setDescription("");
        navigation.goBack();
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("Info", "Erro ao registrar ordem ");
      });
  };

  return (
    <VStack flex={1} p={6} bg="gray.800">
      <Header title="Solicitação" />
      <Input
        placeholder="Número do patrimônio"
        mt={4}
        onChangeText={setPatrimony}
      />
      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />
      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}
