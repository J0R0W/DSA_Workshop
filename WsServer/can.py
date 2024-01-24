import json
import socket
import can

# CAN bus parameters
can_interface = 'socketcan'
can_bitrate = 500000
can_channel='can1'

# Create CAN bus connection
bus = can.Bus(interface=can_interface, channel='can1', bitrate=can_bitrate)

# Websocket parameters
websocket_address = 'ws://localhost:8000/data'

# Define function to transform raw CAN data into physical values
def parse_can_data(can_data):
    # Extract humidity data
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

    return humidity, temperature

while True:
    try:
        # Read next CAN message
        can_message = bus.recv()

        # Parse CAN data into physical values
        data = parse_can_data(can_message.data)


    except Exception as e:
        pass