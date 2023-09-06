import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello_world():
    logging.info("Flask: Hello, World!")
    return "Hello, World!"

@app.route('/create_file', methods=['POST'])
def create_file():
    data = request.json
    file_path = data.get('filePath')
    code = data.get('code')
    
    # Your file creation logic here.
    with open(file_path, "w") as f:
        f.write(code)

    logging.info("Flask: File created successfully."+file_path)
    return jsonify({'status': 'success'})

@app.route('/read_file', methods=['POST'])
def read_file():
    request_data = request.get_json()
    file_path = request_data['filePath']
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        logging.info("Flask: File read successfully.")
        return jsonify({'status': 'success', 'content': content})
    except Exception as e:
        logging.info(f"Flask: File read failed, error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/read_dir_structure', methods=['POST'])
def read_dir_structure():
    request_data = request.get_json()
    dir_path = request_data['dirPath']
    try:
        # List all files and directories in the given path
        dir_structure = os.listdir(dir_path)
        logging.info("Flask: Directory structure read successfully.")
        return jsonify({'status': 'success', 'dirStructure': dir_structure})
    except Exception as e:
        logging.info(f"Flask: Directory structure read failed, error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(port=5000)
