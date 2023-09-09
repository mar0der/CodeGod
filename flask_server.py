import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path  # Don't forget to import Path

# Initialize logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def hello_world():
    logging.info("Flask: Hello, World!")
    return "Hello, World!"

# Enhanced create_file function to handle accidental path formats
@app.route('/create_file', methods=['POST'])
def create_file():
    data = request.json
    file_path = data.get('filePath')
    code = data.get('code')
    
    # Always ensure the path starts with "./" for relative paths
    if not file_path.startswith("./"):
        file_path = "./" + file_path.lstrip("/")
    
    # Normalize the path and resolve relative paths like "./"
    normalized_path = Path(file_path).resolve()
    
    # Create any missing directories
    normalized_path.parent.mkdir(parents=True, exist_ok=True)

    # Create or overwrite the file
    with open(normalized_path, "w") as f:
        f.write(code)

    logging.info(f"Flask: File created successfully at {normalized_path}")
    return jsonify({'status': 'success'})

# Enhanced read_file function to handle accidental path formats
@app.route('/read_file', methods=['POST'])
def read_file():
    request_data = request.get_json()
    file_path = request_data['filePath']
    
    # Always ensure the path starts with "./" for relative paths
    if not file_path.startswith("./"):
        file_path = "./" + file_path.lstrip("/")
    
    # Normalize the path and resolve relative paths like "./"
    normalized_path = Path(file_path).resolve()
    
    try:
        with open(normalized_path, 'r') as f:
            content = f.read()
        logging.info(f"Flask: File read successfully from {normalized_path}.")
        return jsonify({'status': 'success', 'content': content})
    except FileNotFoundError:
        logging.info(f"Flask: File read failed, file not found at {normalized_path}.")
        return jsonify({'status': 'error', 'message': 'File not found'})
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