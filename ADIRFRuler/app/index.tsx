import { useState } from "react";
import { Text, View, Button } from "react-native";
import ProjectView from "./components/ProjectView";

export default function Index() {
  const [showProjectActions, setShowProjectActions] = useState(false);

  const handleAddRule = () => alert("Adding new rule...");
  const handleDeleteProject = () => alert("Deleting project...");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>
        Welcome to the ADIRF Rule Elicitator Tool
      </Text>

      <Text style={{ marginBottom: 30, textAlign: "center" }}>
        To start click on "Create New Project" or open the documentation by clicking on the "Documentation" button.
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <View style={{ marginRight: 10 }}>
          <Button title="Create New Project" onPress={() => setShowProjectActions(true)} disabled={showProjectActions}/>
        </View>

        <View style={{ width: 1, height: "100%", backgroundColor: "#ccc", marginHorizontal: 10 }} />

        {showProjectActions && (
          <View>
            <View style={{ marginLeft: 10 }}>
              <Button title="Clear Project" onPress={handleDeleteProject} />
            </View>
            <View style={{ width: 1, height: "100%", backgroundColor: "#ccc", marginHorizontal: 10 }} /> 
          </View>
        )}
      
        {showProjectActions && (
          <View>
            <View style={{ marginLeft: 10 }}>
              <Button title="Clear Project" onPress={handleDeleteProject} />
            </View>
            <View style={{ width: 1, height: "100%", backgroundColor: "#ccc", marginHorizontal: 10 }} /> 
          </View>
        )}
      

        
        <View style={{ marginLeft: 10 }}>
          <Button title="Configure Topic Parameters" onPress={() => alert("Opening Documentation...")} />
        </View>

        <View style={{ width: 1, height: "100%", backgroundColor: "#ccc", marginHorizontal: 10 }} />

        <View style={{ marginLeft: 10 }}>
          <Button title="Documentation" onPress={() => alert("Opening Documentation...")} />
        </View>
      </View>

      {showProjectActions && (
        <ProjectView/>
      )}
    </View>
  );
}
