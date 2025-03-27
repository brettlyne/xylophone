#include <Arduino.h>

const int PIEZO_PIN = A0;  // Piezo sensor connected to analog pin A0
bool printedLastLoop = false;  // Track if we printed in the previous loop

void setup() {
  Serial.begin(9600);  // Initialize serial communication at 9600 baud
  pinMode(PIEZO_PIN, INPUT);
}

void loop() {
  int sensorValue = analogRead(PIEZO_PIN);  // Read the piezo sensor value (0-1023)
  
  if (sensorValue > 5 && !printedLastLoop) {
    Serial.print("Piezo value: ");
    Serial.println(sensorValue);
    printedLastLoop = true;
  } else if (sensorValue <= 3) {
    printedLastLoop = false;  // Reset the flag when value drops below threshold
  }

  delay(16);
}
