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

        # Prepare the data as a JSON string
        data = json.dumps({
            "temperature": temperature,
            "humidity": humidity,
            "timestamp": datetime.now().isoformat()
        })

        # Send the data to the connected client
        await websocket.send(data)

        # Wait for 1 second before sending the next set of data
        await asyncio.sleep(1)

# Start the WebSocket server
start_server = websockets.serve(send_test_data, "localhost", 6789)

# Run the server
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
