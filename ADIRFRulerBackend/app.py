from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tempfile
import os
import json

app = Flask(__name__)
CORS(app)
@app.route('/generate', methods=['POST'])
def generate_dsl():
    data = request.json

    dsl_content = f"# DSL Generated File\nRules:\n"
    for rule in data.get("rules", []):
        dsl_content += f"- Topic: {rule['topic']}, Status: {rule['status']}\n"

    dsl_content += "\nConditional Blocks:\n"
    for block in data.get("conditionalBlocks", []):
        dsl_content += " IF:\n"
        for cond in block.get("conditions", []):
            dsl_content += f"   - {cond['topic']} {cond['operator']} {cond['value']}\n"
        dsl_content += " THEN:\n"
        for freq in block.get("frequencies", []):
            dsl_content += f"   - {freq['topic']} set to {freq['tier']}\n"

    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".dsl", mode="w", encoding="utf-8")
    tmp_file.write(dsl_content)
    tmp_file.close()

    return send_file(tmp_file.name, as_attachment=True, download_name="project.dsl", mimetype="text/plain")


@app.route('/', methods=['GET', 'POST', 'OPTIONS'])
def index():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        # process the data and return response
        return jsonify({"status": "ok"})
    return jsonify({'message': 'Hello from Flask backend!'})

if __name__ == '__main__':
    app.run(debug=True)