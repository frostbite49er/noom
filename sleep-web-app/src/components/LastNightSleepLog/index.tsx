import { Box, Flex, Text } from "@chakra-ui/react";
import { format, intervalToDuration } from "date-fns";
import { formatDate } from "date-fns/format";
import { Feeling } from "../../pages/IndexPage";

export function LastNightSleepLog({ state }: any) {
  if (!state?.bed_time_start) {
    return null;
  }
  const sleepDuration = intervalToDuration({
    start: state.bed_time_start,
    end: state.bed_time_end
  });

  return (
    <Box>
      <Flex justifyContent="center">
        {`${format(state.bed_time_start, "LLLL")}, ${format(
          state.bed_time_start,
          "dd"
        )}`}
      </Flex>
      <Flex justifyContent="center" sx={{ fontWeight: "bold" }}>
        {sleepDuration.hours ? `${sleepDuration.hours} h` : ""}
        {sleepDuration.minutes ? `${sleepDuration.minutes} min` : ""}
      </Flex>
      <Flex justifyContent="center">
        {`${formatDate(state.bed_time_start, "hh:mm a")} - ${formatDate(
          state.bed_time_end,
          "hh:mm a"
        )}`}
      </Flex>
      <Flex justifyContent="center">
        You felt:{" "}
        <Text sx={{ fontWeight: "bold" }}>{Feeling[state.feeling]}</Text>
      </Flex>
    </Box>
  );
}
