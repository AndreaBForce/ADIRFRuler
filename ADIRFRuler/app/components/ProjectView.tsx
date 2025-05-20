import { useState } from "react";
import { View, Text, Button, ScrollView, StyleSheet } from "react-native";
import RuleBlock from "../components/RuleBlock";
import ConditionalBlock from "./ConditionalBlock";

const topics = [
  { name: "/cmd_vel", color: "#f87171" },
  { name: "/odom", color: "#60a5fa" },
  { name: "/camera/camera_info", color: "#34d399" },
  { name: "/camera/image_raw/compressed", color: "#fbbf24" },
  { name: "/camera/image_raw", color: "#a78bfa" },
  { name: "/imu", color: "#38bdf8" },
  { name: "/joint_state", color: "#fb7185" },
  { name: "/scan", color: "#facc15" },
  { name: "/tf", color: "#4ade80" },
];

const topicProperties = [
  "pose_x",
  "pose_y",
  "pose_z",
  "velocity",
  "acceleration",
];

const tierLabels = [
  "Unacceptable",
  "Marginal",
  "Acceptable",
  "Desirable",
  "Competitive",
  "Excessive",
];

type Rule = {
  topic: string;
  status: string;
};

type Condition = {
  topic: string;
  property: string;
  operator: string;
  value: string;
  logic?: string; 
};

type FrequencySetting = {
  topic: string;
  tier: string;
};

type ConditionalBlock = {
  conditions: Condition[];
  frequencies: FrequencySetting[];
};

export default function ProjectView() {
  const [rules, setRules] = useState<Rule[]>([]);

  const [conditionalBlocks, setConditionalBlocks] = useState<ConditionalBlock[]>([]);

  const addConditionalBlock = () => {
    setConditionalBlocks([
      ...conditionalBlocks,
      {
        conditions: [
          { topic: "", property: "", operator: ">", value: "", logic: "" },
        ],
        frequencies: [],
      },
    ]);
  };

  const removeConditionalBlock = (index: number) => {
    setConditionalBlocks(conditionalBlocks.filter((_, i) => i !== index));
  };

  const updateCondition = (blockIndex: number, condIndex: number, field: keyof Condition, value: string) => {
    const updatedBlocks = [...conditionalBlocks];
    updatedBlocks[blockIndex].conditions[condIndex][field] = value;
    setConditionalBlocks(updatedBlocks);
  };
  
  const updateFrequency = (blockIndex: number, freqIndex: number, field: keyof FrequencySetting, value: string) => {
    const updatedBlocks = [...conditionalBlocks];
    updatedBlocks[blockIndex].frequencies[freqIndex][field] = value;
    setConditionalBlocks(updatedBlocks);
  };

  const addConditionToBlock = (blockIndex: number) => {
    const updatedBlocks = [...conditionalBlocks];
    updatedBlocks[blockIndex].conditions.push({
      topic: "",
      property: "",
      operator: ">",
      value: "",
      logic: updatedBlocks[blockIndex].conditions.length > 0 ? "AND" : "",
    });
    setConditionalBlocks(updatedBlocks);
  };


  const removeConditionFromBlock = (blockIndex: number, condIndex: number) => {
    const updatedBlocks = [...conditionalBlocks];
    if (updatedBlocks[blockIndex].conditions.length > 1) {
      updatedBlocks[blockIndex].conditions.splice(condIndex, 1);

      if (updatedBlocks[blockIndex].conditions.length > 0) {
        updatedBlocks[blockIndex].conditions[0].logic = "";
      }

      setConditionalBlocks(updatedBlocks);
    }
  };

  const addFrequencyToBlock = (blockIndex: number) => {
    const updatedBlocks = [...conditionalBlocks];
    updatedBlocks[blockIndex].frequencies.push({
      topic: "",
      tier: "",
    });
    setConditionalBlocks(updatedBlocks);
  };

  const removeFrequencyFromBlock = (blockIndex: number, freqIndex: number) => {
    const updatedBlocks = [...conditionalBlocks];
    updatedBlocks[blockIndex].frequencies.splice(freqIndex, 1);
    setConditionalBlocks(updatedBlocks);
  };

  const addGlobalRule = () => {
    setRules([...rules, { topic: "", status: "" }]);
  };

  const updateRule = (index: number, field: keyof Rule, value: string) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: value };
    setRules(updated);
  };

  const getAvailableTopics = (currentIndex: number) => {
    const usedTopics = rules
      .map((r, i) => (i === currentIndex ? null : r.topic))
      .filter((t): t is string => !!t);
    return topics.filter((t) => !usedTopics.includes(t.name));
  };

  const clearProject = () => {
    setRules([]);
    setConditionalBlocks([]);
  };

  const allTopicsUsed = rules.length >= topics.length;

  const downloadProject = async (projectData: { rules: Rule[]; conditionalBlocks: ConditionalBlock[] }) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate DSL file");
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "project.dsl"; 
      document.body.appendChild(a);
      a.click();
      a.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the DSL file.");
    }
  };
  


  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

      <View style={styles.row}>
        <View style={styles.group}>
          <View style={styles.buttonWrapper}>
            <Button title="Add Global Default Rule" onPress={addGlobalRule} disabled={allTopicsUsed} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Add Conditional Block Rule" onPress={addConditionalBlock} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Clear all" onPress={clearProject} />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.group}>
          <View style={styles.buttonWrapper}>
          <Button
            title="Download Project"
            onPress={() => downloadProject({ rules, conditionalBlocks })}
          />
          </View>
        </View>
      </View>

      <View style={styles.projectBox}>
        <Text style={styles.projectText}>Rule File</Text>
        {rules.map((rule, index) => (
          <RuleBlock
            key={index}
            topic={rule.topic}
            status={rule.status}
            topics={getAvailableTopics(index)}
            tierLabels={tierLabels}
            onUpdateTopic={(val) => updateRule(index, "topic", val)}
            onUpdateStatus={(val) => updateRule(index, "status", val)}
            onRemove={() => {
              const newRules = rules.filter((_, i) => i !== index);
              setRules(newRules);
            }}
          />
        ))}

        {conditionalBlocks.map((block, i) => (
          <ConditionalBlock
            key={i}
            topics={topics}
            tierLabels={tierLabels}
            topicProperties={topicProperties}
            conditions={block.conditions}
            frequencies={block.frequencies}
            onRemove={() => removeConditionalBlock(i)}
            updateCondition={(condIndex, field, value) => updateCondition(i, condIndex, field, value)}
            updateFrequency={(freqIndex, field, value) => updateFrequency(i, freqIndex, field, value)}
            addCondition={() => addConditionToBlock(i)}
            removeCondition={(condIndex) => removeConditionFromBlock(i, condIndex)}
            addFrequency={() => addFrequencyToBlock(i)}
            removeFrequency={(freqIndex) => removeFrequencyFromBlock(i, freqIndex)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
  },
  content: {
    paddingVertical: 20,
    alignItems: "center",
  },
  projectBox: {
    width: "100%",
    minHeight: 400,
    borderWidth: 1,           
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "transparent", 
  },
  projectText: {
    color: "black",
    fontSize: 16,
    marginBottom: 10,
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
