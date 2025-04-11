#include <Arduino.h>

// MUX control pins
const int MUX_S0 = 5;  // Connected to S0
const int MUX_S1 = 4;  // Connected to S1
const int MUX_S2 = 3;  // Connected to S2
const int MUX_S3 = 2;  // Connected to S3
const int MUX_SIG = 24; // Multiplexer signal pin

// Piezo channels on the multiplexer
const int PIEZO_C0 = 0;  // First piezo on channel 0
const int PIEZO_C1 = 1;  // Second piezo on channel 1
const int PIEZO_C2 = 2;  // Third piezo on channel 2

bool printedLastLoop[3] = {false, false, false};  // Track if we printed in the previous loop for each piezo

void setup() {
  Serial.begin(9600);
  
  // Set up MUX control pins as outputs
  pinMode(MUX_S0, OUTPUT);
  pinMode(MUX_S1, OUTPUT);
  pinMode(MUX_S2, OUTPUT);
  pinMode(MUX_S3, OUTPUT);
  
  // Set up MUX signal pin as input
  pinMode(MUX_SIG, INPUT);
}

void setMuxChannel(byte channel) {
  digitalWrite(MUX_S0, channel & 0x01);
  digitalWrite(MUX_S1, (channel >> 1) & 0x01);
  digitalWrite(MUX_S2, (channel >> 2) & 0x01);
  digitalWrite(MUX_S3, (channel >> 3) & 0x01);
}

void loop() {
  // Loop through all 16 channels
  for (byte channel = 0; channel < 16; channel++) {
    setMuxChannel(channel);
    
    // Small delay to allow the mux to settle
    delayMicroseconds(5);
    
    // Read the current channel
    int sensorValue = analogRead(MUX_SIG);
    
    // Only process values from C0, C1, and C2 channels
    if (channel == PIEZO_C0 || channel == PIEZO_C1 || channel == PIEZO_C2) {
      if (sensorValue > 8 && !printedLastLoop[channel]) {
        Serial.print("Piezo ");
        Serial.print(channel);
        Serial.print(" value: ");
        Serial.println(sensorValue);
        printedLastLoop[channel] = true;
      } else {
        printedLastLoop[channel] = false;  // Reset the flag when value drops below threshold
      }
    }
  }
  delay(64);
}
