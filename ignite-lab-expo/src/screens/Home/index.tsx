import { useState, useEffect } from "react";
import { Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { SignOut, ChatTeardropText } from "phosphor-react-native";
import firestore from "@react-native-firebase/firestore";
import {
  HStack,
  IconButton,
  VStack,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
} from "native-base";

import { Filter } from "../../components/Filter";
import { Order } from "../../components/Order";
import { Button } from "../../components/Button";
import { Loading } from "../../components/Loading";
import { dateFormat } from "../../utils/firestoreDateFormat";

import type { OrderProps } from "../../components/Order";

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<"open" | "closed">(
    "open"
  );
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const { colors } = useTheme();

  const navigation = useNavigation();

  const handleNewOrder = () => {
    navigation.navigate("new");
  };

  const handleOpenDetails = (orderId: string) => {
    navigation.navigate("details", { orderId });
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .catch((error) => {
        Alert.alert("Info", error.message);
      });
  };

  useEffect(() => {
    setIsLoading(true);

    const unsubscribe = firestore()
      .collection("orders")
      .where("status", "==", statusSelected)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const { patrimony, description, status, createdAt } = doc.data();
          return {
            id: doc.id,
            patrimony,
            description,
            status,
            when: dateFormat(createdAt),
          };
        });
        setOrders(data);
        setIsLoading(false);
      });
    return unsubscribe;
  }, [statusSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.900">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.800"
        pt={12}
        pb={5}
        px={6}
      >
        <Text color="gray.100">Home</Text>
        <IconButton
          onPress={handleLogout}
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack
          w="full"
          justifyContent="space-between"
          alignItems="center"
          mt={8}
          mb={4}
        >
          <Heading color="gray.100">Solicitações</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            title="em andamento"
            type="open"
            onPress={() => setStatusSelected("open")}
            isActive={statusSelected === "open"}
          />
          <Filter
            title="finalizados"
            type="closed"
            onPress={() => setStatusSelected("closed")}
            isActive={statusSelected === "closed"}
          />
        </HStack>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" textAlign="center">
                  Você ainda não possui solicitações
                  {statusSelected === "open" ? " em andamento" : " finalizadas"}
                </Text>
              </Center>
            )}
          />
        )}
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
