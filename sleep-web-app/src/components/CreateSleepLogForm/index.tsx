import { FormLabel, Input, Button, Box, Select } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { format, subDays } from "date-fns";
import { requestHandler } from "../../helpers";
import { urlOneNightLogPost } from "../../api";
import { Feeling } from "../../pages/IndexPage";

interface submitedForm {
  bedTimeStart: string;
  bedTimeEnd: string;
  feeling: number;
}

export function CreateSleepLogForm({ handleCancel, handleSave }: any): any {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  function onSubmit(values: submitedForm) {
    const updatedValues = {
      bedTimeStart: `${format(subDays(new Date(), 1), "yyyy-MM-dd")} ${
        values.bedTimeStart
      }`,
      bedTimeEnd: `${format(new Date(), "yyyy-MM-dd")} ${values.bedTimeEnd}`,
      feeling: Number(values.feeling)
    };
    requestHandler(urlOneNightLogPost, "POST", updatedValues).then(() => {
      handleSave();
      handleCancel();
    });
  }

  return (
    <Box sx={{ width: "300px" }}>
      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormLabel htmlFor="bedTimeStart">Bed Time Start</FormLabel>
        <Input
          id="bedTimeStart"
          placeholder="21:00"
          {...register("bedTimeStart", {
            required: "This input is required.",
            minLength: { value: 5, message: "Minimum length should be 5" }
          })}
        />
        {errors?.bedTimeStart?.message || ""}
        <FormLabel htmlFor="bedTimeEnd">Bed Time End</FormLabel>
        <Input
          id="bedTimeEnd"
          placeholder="07:00"
          {...register("bedTimeEnd", {
            required: "This input is required.",
            minLength: { value: 5, message: "Minimum length should be 5" }
          })}
        />
        {errors?.bedTimeEnd?.message || ""}
        <FormLabel htmlFor="feeling">Feeling</FormLabel>
        <Select {...register("feeling")} placeholder="Select option" value={3}>
          <option value={Feeling.Bad}>Bad</option>
          <option value={Feeling.Ok}>Ok</option>
          <option value={Feeling.Good}>Good</option>
        </Select>

        <Button
          mt={4}
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
        >
          Save
        </Button>
        <Button
          mt={4}
          colorScheme="teal"
          onClick={() => handleCancel()}
          sx={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </form>
    </Box>
  );
}
