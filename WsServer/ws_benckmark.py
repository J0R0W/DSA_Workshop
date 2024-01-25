from websocket_server import WebsocketServer
import threading
import can
import json

CLIENTS = []


def new_client(client, server):
    CLIENTS.append(client)


def client_left(client, server):
    CLIENTS.remove(client)


def send(server, msg):
    for client in CLIENTS:
        server.send_message(client, msg)
    server


def broadcast_messages(server):
    while True:
        data = readCanBus()
        send(server, data)


def readCanBus():
    print("Reading CAN bus")
    bus = can.Bus(channel='', interface='socketcan')
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

    bus.shutdown()

    return res


def main():
    host = '192.168.150.1'
    print(f"We are running on server: {host}")
    server = WebsocketServer(host=host, port=6060)
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    threading.Thread(target=broadcast_messages, args=(server,)).start()
    server.run_forever()


if __name__ == "__main__":
    main()
