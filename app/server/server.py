from flask import Flask, request, jsonify, send_from_directory, render_template
from submission import save_submission, get_submissions, delete_submission
import os
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder="../", template_folder="../")
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")

@app.route("/")
def index():
    return app.send_static_file("home/index.html")

@app.route("/admin")
def admin():
    return app.send_static_file("admin/admin.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    nickname = request.form.get("nickname", "").strip()
    if not file or not nickname:
        return jsonify({"status": "fail"}), 400
    filename = secure_filename(file.filename)
    file.save(os.path.join(UPLOAD_DIR, filename))
    save_submission(filename, nickname)
    return jsonify({"status": "success"})

@app.route("/submissions", methods=["GET"])
def submissions():
    return jsonify(get_submissions())

@app.route("/delete/<filename>", methods=["DELETE"])
def delete_file(filename):
    success = delete_submission(filename)
    return jsonify({"status": "success" if success else "fail"})

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5501)

#!: Main server file