from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tempfile

app = Flask(__name__)
CORS(app)

#Global parameters map
stored_topic_map = {}

@app.route('/generate', methods=['POST'])
def generate_dsl():
    data = request.json

    dsl_lines = ["begin"]

    dsl_lines.append("    // Default frequencies")
    for rule in data.get("rules", []):
        topic = rule.get("topic", "")
        freq = rule.get("status", "FREQ_PLACEHOLDER")
        dsl_lines.append(f"    SetFrequency {topic} {freq}")

    for i, block in enumerate(data.get("conditionalBlocks", []), start=1):
        dsl_lines.append(f"\n    // Conditional block {i}")

        conditions = block.get("conditions", [])
        if conditions:
            dsl_lines.append("    If(")
            for j, cond in enumerate(conditions):
                topic = cond.get("topic", "")
                operator = cond.get("operator", "")
                value = cond.get("value", "")
                line = f"        CheckValue {topic} {operator} {value}"
                if j < len(conditions) - 1:
                    line += " AND"
                dsl_lines.append(line)
            dsl_lines.append("    ) Then")

        for freq in block.get("frequencies", []):
            topic = freq.get("topic", "")
            freq_value = freq.get("tier", "FREQ_PLACEHOLDER")
            dsl_lines.append(f"        SetFrequency {topic} {freq_value}")


    dsl_lines.append("end")

    dsl_text = "\n".join(dsl_lines)
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".dsl", mode="w", encoding="utf-8")
    tmp_file.write(dsl_text)
    tmp_file.close()

    return send_file(tmp_file.name, as_attachment=True, download_name="generated_rules.dsl", mimetype="text/plain")

@app.route('/save-parameters', methods=['POST'])
def save_rules():
    global stored_topic_map
    raw_data = request.get_json()
    
    topic_map = {}
    for topic, values in raw_data.items():
        topic_map[topic] = {
            "messageSize": float(values["messageSize"]),
            "tiers": [int(t) for t in values["tiers"]]
        }

    stored_topic_map = topic_map
    return jsonify({"status": "ok", "message": "Rules saved", "storedTopics": stored_topic_map})


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if request.method == 'OPTIONS':
        return '', 200  
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        return jsonify({"status": "ok"})
    return jsonify({'message': 'Hello from Flask backend!'})

if __name__ == '__main__':
    app.run(debug=True)