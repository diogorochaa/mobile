import { VStack, HStack, Text, Box, useTheme } from "native-base";
import { IconProps } from "phosphor-react-native";
import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  footer?: string;
  icon: React.ElementType<IconProps>;
  children?: ReactNode;
};

export function Card({
  title,
  description,
  footer = null,
  icon: Icon,
  children,
}: Props) {
  const { colors } = useTheme();

  return (
    <VStack bg="gray.700" p={5} mt={5} rounded="sm">
      <HStack alignItems="center" mb={4}>
        <Icon color={colors.primary[700]} />
        <Text fontSize="sm" ml={2} textTransform="uppercase" color="gray.300">
          {title}
        </Text>
      </HStack>
      {!!description && (
        <Text fontSize="md" color="gray.100">
          {description}
        </Text>
      )}
      {children}
      {!!footer && (
        <Box borderTopColor="gray.400" borderTopWidth={1} fontSize="sm">
          <Text fontSize="sm" color="gray.300" mt={3}>
            {footer}
          </Text>
        </Box>
      )}
    </VStack>
  );
}
