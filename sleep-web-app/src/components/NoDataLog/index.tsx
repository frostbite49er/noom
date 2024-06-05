import { Box, Flex } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { containerStyles, iconStyles } from "../../pages/styles";
import { CreateSleepLogForm } from "../CreateSleepLogForm";

export function NoDataLog({ refetchData }: any) {
  const [showForm, setShowForm] = useState(false);

  const handleCancel = () => setShowForm(false);

  return (
    <Box sx={containerStyles}>
      {showForm ? (
        <CreateSleepLogForm
          handleCancel={handleCancel}
          handleSave={refetchData}
        />
      ) : (
        <Flex flexDirection="column" alignItems="center">
          <Box>No sleep information</Box>
          <Box sx={iconStyles} onClick={() => setShowForm(true)}>
            <AddIcon />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
