import json
from datetime import datetime

#!: This file contains reusable utilities code
 
def loadJSON(filepath):
    with open(filepath, 'r') as file:
        data = json.load(file)

def getTime():
    now = datetime.now()
    now.strftime("%d/%M/&Y (%H:%M:%S)")
    print("")