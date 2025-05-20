import { View, Text, Button, ScrollView, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";

export default function ProjectView() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

      <View style={styles.row}>
        {/* Group 1: First two buttons */}
        <View style={styles.group}>
          <View style={styles.buttonWrapper}>
            <Button title="Add Global Default Rule" onPress={() => router.push("/addrule")} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Add Conditional Block Rule" onPress={() => router.push("/addrule")} />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Group 2: Last two buttons */}
        <View style={styles.group}>
          <View style={styles.buttonWrapper}>
            <Button title="Optimize Rules" onPress={() => router.push("/addrule")} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Download Project" onPress={() => router.push("/addrule")} />
          </View>
        </View>
      </View>

      <View style={styles.projectBox}>
        <Text style={styles.projectText}>Project View (Rules will appear here)</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
  },
  content: {
    paddingVertical: 20,
    alignItems: "center",
  },
  projectBox: {
    width: '100%',
    minHeight: 400,
    backgroundColor: "black",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  projectText: {
    color: "white",
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  group: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    marginHorizontal: 5,
    width: 300,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
});
