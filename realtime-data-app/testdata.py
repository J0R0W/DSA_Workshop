import asyncio
import websockets
import json
import random
from datetime import datetime

async def send_test_data(websocket, path):
    while True:
        # Generate random temperature and humidity data
        temperature = round(random.uniform(20, 30), 2)  # Random temperature between 20 and 30
        humidity = round(random.uniform(40, 60), 2)      # Random humidity between 40 and 60
        steering = round(random.uniform(-2, 2), 2)  
        gas = round(random.uniform(0, 100), 2)  
        SteeringWheelAngle = round(random.uniform(-200, 200), 2)
        AbsolutThrottlePosition = round(random.uniform(0, 100), 2)
        AcceleratorPedalPositionD = round(random.uniform(0, 100), 2)
        RelativeThrottlePosition = round(random.uniform(0, 100), 2)
        # Prepare the data as a JSON string
        data = json.dumps({
            "temperature": temperature,
            "humidity": humidity,
            "timestamp": datetime.now().isoformat(),
            "gas":gas,
            "SteeringMoment":steering,
            "SteeringWheelAngle":SteeringWheelAngle,
            "AbsolutThrottlePosition":AbsolutThrottlePosition,
            "AcceleratorPedalPositionD":AcceleratorPedalPositionD,
            "RelativeThrottlePosition":RelativeThrottlePosition
        })
        #'SteeringMoment'
        # 'SteeringWheelAngle',
        # 'AbsolutThrottlePosition',
        # 'AcceleratorPedalPositionD',
        # 'RelativeThrottlePosition'
        await websocket.send(data)

        # Wait for 1 second before sending the next set of data
        await asyncio.sleep(1)

# Start the WebSocket server
start_server = websockets.serve(send_test_data, "0.0.0.0", 6060)

# Run the server
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
