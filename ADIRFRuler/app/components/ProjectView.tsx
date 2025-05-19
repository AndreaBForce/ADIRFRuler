import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function ProjectView({
}: {
}) {
  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <View
        style={{
          width: "100%",
          height: 300,
          backgroundColor: "black",
          borderRadius: 10,
          marginBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Project View (Rules will appear here)</Text>
      </View>

      <View style={{ marginBottom: 10, width: "60%" }}>
      <Button title="Add New Rule" onPress={() => router.push("/addrule")} />
      </View>
    </View>
  );
}
