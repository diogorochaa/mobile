import { Center, Spinner } from "native-base";

function Loading() {
  return (
    <Center flex={1} bg="gray.900">
      <Spinner color="green.700" />
    </Center>
  );
}
export { Loading };
