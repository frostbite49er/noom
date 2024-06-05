import { Box, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { containerStyles, switchToAvgButtonStyles } from "./styles";
import { requestHandler } from "../helpers";
import { NoDataLog } from "../components/NoDataLog";
import { ulrArgumentNightLog, urlOneNightLogGet } from "../api";
import { LastNightSleepLog } from "../components/LastNightSleepLog";
import { AvgSleepLog } from "../components/AvgSleepLog";

export enum Feeling {
  Bad = 1,
  Ok,
  Good
}

export interface OneNightLog {
  bed_time_end: string;
  bed_time_start: string;
  feeling: Feeling;
  id: number;
}

export function IndexPage() {
  const [loading, setLoading] = useState(false);
  const [switchToAvg, setSwitchToAvg] = useState<boolean>(false);
  const [state, setState] = useState<OneNightLog | null>(null);

  const refetchData = () => {
    setLoading(true);

    requestHandler(urlOneNightLogGet).then((response) => {
      setState(response);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);

    requestHandler(switchToAvg ? ulrArgumentNightLog : urlOneNightLogGet).then(
      (response) => {
        setState(response);
        setLoading(false);
      }
    );
  }, [switchToAvg]);

  switch (true) {
    case loading: {
      return <div>loading...</div>;
    }
    case !!state: {
      return (
        <Box sx={containerStyles}>
          <Box sx={switchToAvgButtonStyles}>
            <Button onClick={() => setSwitchToAvg((previous) => !previous)}>
              {switchToAvg ? "BACK" : "AVG"}
            </Button>
          </Box>
          {switchToAvg ? (
            <AvgSleepLog state={state} />
          ) : (
            <LastNightSleepLog state={state} />
          )}
        </Box>
      );
    }
    default: {
      return <NoDataLog refetchData={() => refetchData()} />;
    }
  }
}
