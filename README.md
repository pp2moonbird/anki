# Simple tool for anki

## Intro

Simple tool to generate [anki](https://apps.ankiweb.net/) cards. You can exports cards to csv file and then import to anki.

### Simple Mode

Type Question and Answer seperated by semicolon.

### Advanced Mode(Markdown Mode)

You can use Markdown in Advanced Mode

## Installation

Clone this repo

    git clone https://github.com/pp2moonbird/anki

Install Python 3 and related packages

    pip install flask
    pip install pandas

Run `anki.py` or `anki.bat`

Result csv file will be stored at `\data` folder by default. You can config path by editing `\config\config.txt`