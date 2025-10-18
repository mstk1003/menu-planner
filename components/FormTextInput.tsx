import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from "react-native";

type FormTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

const FormTextInput = forwardRef<TextInput, FormTextInputProps>(
  ({ style, placeholderTextColor = "#8A8A8A", ...rest }, ref) => {
    return (
      <TextInput
        ref={ref}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, style]}
        {...rest}
      />
    );
  }
);

FormTextInput.displayName = "FormTextInput";

export default FormTextInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#222222",
    backgroundColor: "#FFFFFF",
  },
});
