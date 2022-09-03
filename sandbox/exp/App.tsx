import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  TextInput,
  Button,
  Text,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import { useForm, useField } from "./react-inverted-form";

interface FormFields {
  email: string;
  password: string;
}

interface FormTextInputProps {
  formId: string;
  name: string;
  style: any;
}

const FormTextInput = ({ formId, name, style }: FormTextInputProps) => {
  const field = useField(name, formId, { native: true });

  return <TextInput style={style} {...field.getInputProps()} />;
};

export default function App() {
  const { state, handleSubmit } = useForm<FormFields>({
    formId: "test",
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => alert(JSON.stringify(values, null, 2)),
    onChange: (values) => console.log(values),
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar style="auto" />

          <Text>{JSON.stringify(state, null, 2)}</Text>

          <FormTextInput style={styles.input} name="email" formId="test" />
          <FormTextInput style={styles.input} name="password" formId="test" />

          <Button title="Submit" onPress={() => handleSubmit({} as any)} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderStyle: "solid",
    borderWidth: 1,
    marginBottom: 12,
  },
});
