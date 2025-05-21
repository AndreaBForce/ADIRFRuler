from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tempfile
from pulp import LpMaximize, LpProblem, LpVariable, lpSum

app = Flask(__name__)
CORS(app)

# Global topic configuration
stored_topic_map = {}

# Tier definitions
tiers = {
    "Unacceptable": 0,
    "Marginal": 1,
    "Acceptable": 2,
    "Desirable": 3,
    "Competitive": 4,
    "Excessive": 5,
}

desired_tiers = {
    "/cmd_vel": "Acceptable",
    "/odom": "Desirable",
    "/camera/camera_info": "Acceptable",
    "/camera/image_raw/compressed": "Marginal",
    "/camera/image_raw": "Acceptable",
    "/imu": "Competitive",
    "/joint_state": "Acceptable",
    "/scan": "Desirable",
    "/tf": "Acceptable",
}

bandwidth_budget_kbps = 275000  

def run_optimizer_block(
    to_optimize: dict,
    fixed_topics: dict,
    bandwidth_kbps: float
):
    model = LpProblem("BlockBandwidthOptimizer", LpMaximize)
    f = {}

    for topic, info in to_optimize.items():
        size = info["messageSize"]
        breakpoints = info["tiers"]
        tier = info.get("desiredTier")
        tier_index = tiers.get(tier, 0)

        if tier_index == 0:
            low = 0
            high = breakpoints[0]
        elif tier_index == 5:
            low = breakpoints[-1]
            high = breakpoints[-1] + 10
        else:
            low = breakpoints[tier_index - 1]
            high = breakpoints[tier_index]

        f[topic] = LpVariable(f"freq_{topic}", lowBound=low, upBound=high)

    model += lpSum(f[t] for t in f), "Total_Frequency"

    bandwidth_expr = lpSum(f[t] * to_optimize[t]["messageSize"] for t in f)
    for t, freq in fixed_topics.items():
        bandwidth_expr += freq * stored_topic_map["topics"][t]["messageSize"]

    model += bandwidth_expr <= bandwidth_kbps, "Bandwidth_Constraint"
    model.solve()

    return {t: round(f[t].value(), 2) for t in f}

@app.route('/generate', methods=['POST'])
def generate_dsl():
    data = request.json

    topic_defs = stored_topic_map.get("topics", {})
    bandwidth = stored_topic_map.get("bandwidth", 275000)

    if not topic_defs:
        return jsonify({"error": "No topic definitions saved"}), 400

    dsl_lines = ["begin"]
    dsl_lines.append("    // DSL Generated File")

    # --------------------------------------
    # GLOBAL OPTIMIZATION
    # --------------------------------------
    global_topic_info = {}
    rules = data.get("rules", [])
    for topic, info in topic_defs.items():
        tier = None
        for rule in rules:
            if rule.get("topic") == topic:
                tier = rule.get("tier")
                break
        if not tier:
            tier = "Unacceptable" 

        global_topic_info[topic] = {
            "messageSize": info["messageSize"],
            "tiers": info["tiers"],
            "desiredTier": tier,
        }

    global_freqs = run_optimizer_block(global_topic_info, {}, bandwidth)

    dsl_lines.append("\n    // Global frequencies")
    for topic, freq in global_freqs.items():
        dsl_lines.append(f"    SetFrequency {topic} {freq}")

    # --------------------------------------
    # CONDITIONAL BLOCKS
    # --------------------------------------
    conditional_blocks = data.get("conditionalBlocks", [])
    for i, block in enumerate(conditional_blocks, start=1):
        dsl_lines.append(f"\n    // Conditional block {i}")

        # 1.Render condition
        conditions = block.get("conditions", [])
        if conditions:
            dsl_lines.append("    If(")
            for j, cond in enumerate(conditions):
                property_path = cond.get("property")
                topic_str = f"{cond['topic']} {property_path}" if property_path else cond["topic"]
                line = f"        CheckValue {topic_str} {cond['operator']} {cond['value']}"
                if j < len(conditions) - 1:
                    line += " AND"
                dsl_lines.append(line)
            dsl_lines.append("    ) Then")

        # 2.Prepare optimizer input for block topics with desired tiers
        block_tiers = {}
        overridden_topics = set()
        for entry in block.get("frequencies", []):
            topic = entry["topic"]
            if topic in topic_defs:
                overridden_topics.add(topic)
                block_tiers[topic] = {
                    "messageSize": topic_defs[topic]["messageSize"],
                    "tiers": topic_defs[topic]["tiers"],
                    "desiredTier": entry.get("tier", "Unacceptable"),
                }

        # 3.Fix frequencies for all other topics from global_freqs
        fixed_freqs = {
            t: freq for t, freq in global_freqs.items() if t not in overridden_topics
        }

        # 4.Optimize frequencies for overridden topics in this block
        block_freqs = run_optimizer_block(block_tiers, fixed_freqs, bandwidth)

        # 5.Emit DSL frequencies for this block
        for topic, freq in block_freqs.items():
            dsl_lines.append(f"        SetFrequency {topic} {freq}")

    dsl_lines.append("end")

    #Save to file and return
    dsl_text = "\n".join(dsl_lines)
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".dsl", mode="w", encoding="utf-8")
    tmp_file.write(dsl_text)
    tmp_file.close()

    return send_file(tmp_file.name, as_attachment=True, download_name="generated_rules.dsl", mimetype="text/plain")


@app.route('/save-parameters', methods=['POST'])
def save_rules():
    global stored_topic_map
    raw_data = request.get_json()

    bandwidth = raw_data.get("bandwidth", 275000)  

    topic_map = {}
    for topic, values in raw_data.items():
        if topic == "bandwidth":
            continue  # Skip the bandwidth field
        topic_map[topic] = {
            "messageSize": float(values["messageSize"]),
            "tiers": [int(t) for t in values["tiers"]]
        }

    stored_topic_map = {
        "bandwidth": float(bandwidth),
        "topics": topic_map
    }

    return jsonify({
        "status": "ok",
        "message": "Rules and bandwidth saved",
        "storedTopics": stored_topic_map
    })


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
