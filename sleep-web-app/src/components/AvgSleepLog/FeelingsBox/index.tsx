import { Box, Text } from "@chakra-ui/react";
import { fellingBoxStyles } from "../../../pages/styles";

export function FeelingsBox({
  title,
  value
}: {
  title: string;
  value: number;
}) {
  return (
    <Box sx={fellingBoxStyles}>
      <Text>{title}</Text> <Text sx={{ fontWight: "bold" }}>{value}</Text>
    </Box>
  );
}
