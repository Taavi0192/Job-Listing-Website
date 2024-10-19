"use client"

import { useRadio, Box } from "@chakra-ui/react";

export default function TestAnswerOption(props: any) {
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const radio = getRadioProps();

  return (
    <Box
      w="full"
      as="label"
    >
      <input {...input} />
      <Box
        // px={5}
        // py={3}
        {...radio}
        cursor="pointer"
        borderWidth={1}
        borderRadius="md"
        userSelect="none"
        _checked={{
          bg: "primary.500",
          color: "white",
          borderColor: "primary.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        // {...checkbox}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}
