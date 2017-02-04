from flask import Flask, render_template, jsonify, request
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('anki.html')

if __name__ == '__main__':
    app.run(debug=True, port=80)