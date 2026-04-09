import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { VStack, Text, HStack, useTheme, ScrollView, Box } from "native-base";
import { Alert } from "react-native";
import firestore from "@react-native-firebase/firestore";
import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
  CircleWavy,
} from "phosphor-react-native";

import { Input } from "../../components/Input";
import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { dateFormat } from "../../utils/firestoreDateFormat";

import type { OrderProps } from "../../components/Order";
import type { OrderFirestoreDTO } from "../../DTOs/orderDTO";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState("");
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams;

  const handleOrderClose = () => {
    if (!solution) {
      return Alert.alert("Atenção", "Por favor, informe a solução do problema");
    }

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closedAt: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Sucesso", "Ordem fechada com sucesso");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Erro", "Ocorreu um erro ao fechar a ordem");
      });
  };

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          solution,
          closedAt,
          createdAt,
          status,
        } = doc.data() as OrderFirestoreDTO;
        const closed = closedAt ? dateFormat(closedAt) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          solution,
          status,
          when: dateFormat(createdAt),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Box px={6} bg="gray.900">
        <Header title="Detalhes" />
      </Box>
      <HStack bg="gray.900" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck color={colors.green[500]} size={22} />
        ) : (
          <Hourglass color={colors.orange[500]} size={22} />
        )}
        <Text
          fontSize="sm"
          color={
            order.status === "closed" ? colors.green[500] : colors.orange[500]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "Fechado" : "Aberto"}
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <Card
          title="Equipamento"
          description={`Patrimonio ${order.patrimony}`}
          icon={DesktopTower}
        />
        <Card
          title="Descrição do problema"
          description={order.description}
          icon={Clipboard}
          footer={`Criado em ${order.when}`}
        />
        <Card
          title="solução"
          icon={CircleWavy}
          description={order.solution}
          footer={order.closed && `Fechado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              bg="gray.900"
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </Card>
      </ScrollView>
      {order.status === "open" && (
        <Button title="Encerrar" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
