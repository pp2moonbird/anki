from flask import Flask, render_template, jsonify, request
import json
import pandas as pd

app = Flask(__name__)

with open('./config/config.txt', 'r') as configfile:
    datafolder = configfile.readline()

@app.route('/')
def index():
    return render_template('anki.html')

@app.route('/deck', methods=['POST'])
def writeDeck():
    deck = request.json
    deckName = deck['deck']
    cards = deck['cards']

    df = pd.DataFrame(cards)
    df['questionHTML'] = df['questionHTML'].str.replace(r'\n', '')
    df['answerHTML'] = df['answerHTML'].str.replace(r'\n', '')
    df['finalQuestion'] = df.apply(lambda x: x['question'] if x['isSimpleMode'] else x['questionHTML'], axis=1)
    df['finalAnswer'] = df.apply(lambda x: x['answer'] if x['isSimpleMode'] else x['answerHTML'], axis=1)
    df = df[['finalQuestion', 'finalAnswer']]
    df.to_csv(datafolder + '/' + deckName + '.csv', index=False, header=False, encoding='utf-8')
    return 'ok'

if __name__ == '__main__':
    app.run(debug=True, port=80)