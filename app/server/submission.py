import json
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
JSON_FILE = os.path.join(BASE_DIR, "submissions.json")

def load_submissions():
    if not os.path.exists(JSON_FILE):
        return []
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except:
            return []

def save_submissions(submissions):
    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(submissions, f, indent=2, ensure_ascii=False)

def save_submission(filename, nickname):
    submissions = load_submissions()
    submissions.append({
        "url": f"/uploads/{filename}",
        "nickname": nickname,
        "filename": filename,
        "timestamp": datetime.now().strftime("%d/%m/%y (%H:%M:%S)")
    })
    save_submissions(submissions)

def get_submissions():
    return load_submissions()

def delete_submission(filename):
    submissions = load_submissions()
    updated = [s for s in submissions if s["filename"] != filename]
    if len(updated) == len(submissions):
        return False
    save_submissions(updated)
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    return True

#!: this file contains submission functions inorder to fulfill submission storage