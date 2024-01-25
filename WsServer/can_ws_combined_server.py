import threading
import time

from websocket_server import WebsocketServer

import can

# CAN bus parameters
can_interface = 'socketcan'
can_bitrate = 500000
can_channel = 'can1'
buffer = []

# Create CAN bus connection
bus = can.Bus(interface=can_interface, channel='can1', bitrate=can_bitrate)


# Called for every client connecting (after handshake)
def new_client(client, server):
    print("New client connected and was given id %d" % client['id'])
    server.send_message_to_all("Hey all, a new client has joined us")

    time.sleep(1)


def send_msg():
    while True:
        if buffer.count() > 0:
            h, t = buffer.pop(0)
            server.send_message_to_all(str(h) + "#" + str(t))


# Called for every client disconnecting
def client_left(client, server):
    print("Client(%d) disconnected" % client['id'])


# Called when a client sends a message
def message_received(client, server, message):
    if len(message) > 200:
        message = message[:200] + '..'
    print("Client(%d) said: %s" % (client['id'], message))


def parse_can_data():
    while True:

        # Extract humidity data
        try:
            # Read next CAN message
            can_message = bus.recv()

            # Parse CAN data into physical values
            can_data = can_message.data
        except Exception as e:
            print(e)

        humidity_integral = can_data[2]
        humidity_fractional = can_data[3] / 100

        # Extract temperature data
        temperature_integral = can_data[0]
        temperature_fractional = can_data[1] / 100

        # Calculate checksum
        calculated_checksum = (humidity_integral + humidity_fractional + temperature_integral + temperature_fractional) & 0xFF

        # Verify checksum
        if calculated_checksum != can_data[4]:
            raise ValueError("Invalid CAN data: Incorrect checksum")

        # Convert humidity and temperature data to physical values
        humidity = humidity_integral + humidity_fractional
        temperature = temperature_integral + temperature_fractional

        dt = [humidity, temperature]
        buffer.append(dt)


if __name__ == '__main__':
    PORT = 6060
    HOST = '192.168.150.1'
    server = WebsocketServer(port=PORT, host=HOST)
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    server.set_fn_message_received(message_received)

    threading.Thread(parse_can_data()).start()
    threading.Thread(send_msg()).start()

    server.run_forever()
