#include <DHT.h>
#include <mcp_can.h>
#include <SPI.h>
/*
 * This ESP32 code is created by esp32io.com
 *
 * This ESP32 code is released in the public domain
 *
 * For more detail (instruction and wiring diagram), visit https://esp32io.com/tutorials/esp32-temperature-sensor
 */

#define DHT11_PIN 12
// Set the CS pin
const int SPI_CS_PIN = 5;


// Initialize MCP_CAN object. Set the CS pin.
MCP_CAN CAN(SPI_CS_PIN);
DHT dht11(DHT11_PIN, DHT11);

float tempC; // temperature in Celsius
float tempF; // temperature in Fahrenheit

void setup() {
    Serial.begin(9600);
    Serial.println("INIT");
    // Initialize the CAN controller at the specified speed
    while (CAN_OK != CAN.begin(CAN_500KBPS, MCP_8MHz)) {
        Serial.println("CAN BUS Shield init fail");
        Serial.println(" Init CAN BUS Shield again");
        delay(1000);
    }
    Serial.println("CAN BUS Shield init ok!");
  dht11.begin();    // initialize the DS18B20 sensor
}
void loop() {
  delay(1000);

  // read humidity
  float humi  = dht11.readHumidity();
  // read temperature as Celsius
  float tempC = dht11.readTemperature();
  // read temperature as Fahrenheit
  float tempF = dht11.readTemperature(true);

  // check if any reads failed
  if (isnan(humi) || isnan(tempC) || isnan(tempF)) {
    Serial.println("Failed to read from DHT11 sensor!");
  } else {
    Serial.print("DHT11# Humidity: ");
    Serial.print(humi);
    Serial.print("%");

    Serial.print("  |  "); 

    Serial.print("Temperature: ");
    Serial.print(tempC);
    Serial.print("°C ~ ");
    Serial.print(tempF);
    Serial.println("°F");
    int tempCx = int(tempC); // Get the integer part
    int tempCy = (tempC - tempCx) * 1000 + 0.5;

    int humix = int(humi); // Get the integer part
    int humiy = (humi - humix) * 1000 + 0.5;
    
    byte stmp[8] = {tempCx, tempCy,humix,humiy};
    CAN.sendMsgBuf(0x70, 0, 4, stmp); // Send a message to ID 0x70
    Serial.println("Message Sent");
    //CAN.sendMsgBuf(0x10, 0, 4, tempC);
  }
}
