#include <Arduino.h>

// MUX A control pins
const int MUX_S0 = 5;  // Connected to S0
const int MUX_S1 = 4;  // Connected to S1
const int MUX_S2 = 3;  // Connected to S2
const int MUX_S3 = 2;  // Connected to S3
const int MUX_A_SIG = 24; // Multiplexer A signal pin

// Direct analog pins for remaining inputs
const int DIRECT_PINS[] = {25, 26, 27, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 38, 39, 40, 41};
const int NUM_DIRECT_PINS = sizeof(DIRECT_PINS) / sizeof(DIRECT_PINS[0]);

// Arrays to store peak values
int peakValues_D[NUM_DIRECT_PINS] = {0};
int peakValues_A[16] = {0};

// Timer for peak reset
unsigned long lastPeakReset = 0;
const unsigned long PEAK_RESET_INTERVAL = 1000; // Reset peaks every 1000ms (1 second)

void setup() {
  Serial.begin(9600);
  
  // Set up MUX control pins as outputs
  pinMode(MUX_S0, OUTPUT);
  pinMode(MUX_S1, OUTPUT);
  pinMode(MUX_S2, OUTPUT);
  pinMode(MUX_S3, OUTPUT);
  
  // Set up MUX signal pin as input
  pinMode(MUX_A_SIG, INPUT);
  
  // Set up direct pins as inputs
  for (int i = 0; i < NUM_DIRECT_PINS; i++) {
    pinMode(DIRECT_PINS[i], INPUT);
  }
}

void setMuxChannel(byte channel) {
  digitalWrite(MUX_S0, channel & 0x01);
  digitalWrite(MUX_S1, (channel >> 1) & 0x01);
  digitalWrite(MUX_S2, (channel >> 2) & 0x01);
  digitalWrite(MUX_S3, (channel >> 3) & 0x01);
}

void loop() {
  // Check if it's time to reset peak values
  unsigned long currentTime = millis();
  if (currentTime - lastPeakReset >= PEAK_RESET_INTERVAL) {
    memset(peakValues_D, 0, sizeof(peakValues_D));
    memset(peakValues_A, 0, sizeof(peakValues_A));
    lastPeakReset = currentTime;
    Serial.println("---"); // Print separator when resetting peaks
  }
  
  // Read direct pins and update peaks
  for (int i = 0; i < NUM_DIRECT_PINS; i++) {
    int sensorValue = analogRead(DIRECT_PINS[i]);
    peakValues_D[i] = max(peakValues_D[i], sensorValue);
    
    Serial.print("D");
    Serial.print(DIRECT_PINS[i]);
    Serial.print(":\t");
    Serial.print(peakValues_D[i]);
    Serial.print("\t\t");
    
    if ((i + 1) % 3 == 0) {  // Print newline every 3 readings for readability
      Serial.println();
    }
  }
  Serial.println();
  
  // Read multiplexer A and update peaks
  for (byte channel = 0; channel < 16; channel++) {
    setMuxChannel(channel);
    delayMicroseconds(100);
    
    int sensorValue_A = analogRead(MUX_A_SIG);
    peakValues_A[channel] = max(peakValues_A[channel], sensorValue_A);
    
    Serial.print("A");
    Serial.print(channel);
    Serial.print(":\t");
    Serial.println(peakValues_A[channel]);
  }
  
  delay(40);
}
