import base64
import re

import numpy as np
from flask import Flask, render_template, request
from scipy.misc import imread, imresize

from model.load import *

app = Flask(__name__)
global model, graph
model, graph = init()


@app.route('/')
@app.route('/home', methods=['POST'])
def hello_world():
    return render_template('index.html')


def convertImage(imgdata1):
    imgstr = re.search(b'base64,(.*)', imgdata1).group(1)
    with open('output.png', 'wb') as output:
        output.write(base64.decodebytes(imgstr))


@app.route('/process/', methods=['GET', 'POST'])
def process():
    img_data = request.get_data()
    convertImage(img_data)
    x = imread('output.png', mode='L')
    x = np.invert(x)
    x = imresize(x, (28, 28))
    x = x.reshape(1, 28, 28, 1)
    with graph.as_default():
        out = model.predict(x)
        print(out)
        print(np.argmax(out, axis=1))
        response = np.argmax(out, axis=1)
        return str(response[0])


if __name__ == '__main__':
    app.run()
