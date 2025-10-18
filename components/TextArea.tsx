import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from "react-native";

import FormTextInput from "./FormTextInput";

type TextAreaProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
  minHeight?: number;
};

const TextArea = forwardRef<TextInput, TextAreaProps>(
  ({ style, minHeight = 120, ...rest }, ref) => {
    return (
      <FormTextInput
        ref={ref}
        multiline
        textAlignVertical="top"
        style={[styles.textArea, { minHeight }, style]}
        {...rest}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;

const styles = StyleSheet.create({
  textArea: {
    paddingTop: 14,
  },
});
