from websocket_server import WebsocketServer
import threading
import can
import json


buffer = []


def new_client(client, server):
    print("Client(%d) disconnected" % client['id'])


def client_left(client, server):
    print("Client(%d) disconnected" % client['id'])


def send(server):
    if len(buffer) > 0:
        msg = json.dumps(buffer.pop(0))
        server.send_message_to_all(msg)


def broadcast_messages(server, bus):
    while True:
        readCanBus(bus)
        send(server)


def readCanBus(bus):
    print("Reading CAN bus")
    can_data = bus.recv().data

    humidity_integral = can_data[2]
    humidity_fractional = can_data[3] / 100

    # Extract temperature data
    temperature_integral = can_data[0]
    temperature_fractional = can_data[1] / 100

    # Convert humidity and temperature data to physical values
    humidity = humidity_integral + humidity_fractional
    temperature = temperature_integral + temperature_fractional

    dict = {}
    dict['humidity'] = humidity
    dict['temperature'] = temperature

    res = json.dumps(dict)
    buffer.append(res)


def main():
    bus = can.Bus(channel='', interface='socketcan')

    host = '192.168.150.1'
    server = WebsocketServer(host=host, port=6060)
    print(f"We are running on server: {host}")

    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    threading.Thread(target=broadcast_messages, args=(server, bus)).start()
    server.run_forever()


if __name__ == "__main__":
    main()
