#!/usr/bin/env python3.9
# -*- coding: utf-8 -*-
__author__ = 'ET'

import json
import time

import websocket
import _thread


def on_message(ws, message):
    print('Received: ' + message)

    recv_message = json.loads(message)
    print(recv_message['data'])


def on_open(ws):
    # run thread
    def process():
        while True:
            s = input("the msg to send：")
            if s == "q":
                break
            ws.send(s)

            time.sleep(0.2)

        ws.close()
        print("Websocket closed")

    _thread.start_new_thread(process, ())


if __name__ == "__main__":
    ws = websocket.WebSocketApp("ws://localhost:9001",
                                on_message=on_message,
                                on_open=on_open)

    ws.run_forever()