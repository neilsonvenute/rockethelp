import { IInputProps, Input as NativeBaseInput } from 'native-base';

export function Input({ ...rest }: IInputProps) {
  return (
    <NativeBaseInput
      bg="gray.700"
      size="md"
      h={14}
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      _focus={{
        borderWidth: 1,
        borderColor: 'green.500',
        bg: "gray.700"
      }}
      {...rest}
    />
  );
}