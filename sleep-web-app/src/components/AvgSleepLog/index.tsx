import { Box, Flex, Text } from "@chakra-ui/react";
import { format } from "date-fns";
import { formatDate } from "date-fns/format";
import { FeelingsBox } from "./FeelingsBox";

export function AvgSleepLog({ state }: any) {
  if (!state?.average_sleep_time) {
    return null;
  }

  const [avgHours, avgMins] = state.average_sleep_time
    .toFixed(2)
    .toString()
    .split(".");

  return (
    <Box>
      <Flex justifyContent="center" alignItems="baseline">
        {`${format(state.first_date, "LLLL")}, ${format(
          state.first_date,
          "dd"
        )}`}
        <Text sx={{ fontSize: "0.8em", padding: "0 3px" }}>to</Text>
        {`${format(state.last_date, "LLLL")}, ${format(state.last_date, "dd")}`}
      </Flex>
      <Flex justifyContent="center" sx={{ fontWeight: "bold" }}>
        {`${avgHours} h ${avgMins} min`}
      </Flex>
      <Flex justifyContent="center">
        <div>{`${formatDate(
          state.average_bed_time_start,
          "hh:mm a"
        )} - ${formatDate(state.average_bed_time_end, "hh:mm a")}`}</div>
      </Flex>
      <Flex justifyContent="center">
        <FeelingsBox title="Bad" value={state.count_bad} />
        <FeelingsBox title="OK" value={state.count_ok} />
        <FeelingsBox title="Good" value={state.count_good} />
      </Flex>
    </Box>
  );
}
