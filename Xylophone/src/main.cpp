#include <Arduino.h>

// MUX A control pins
const int MUX_S0 = 5;  // Connected to S0
const int MUX_S1 = 4;  // Connected to S1
const int MUX_S2 = 3;  // Connected to S2
const int MUX_S3 = 2;  // Connected to S3
const int MUX_A_SIG = 24; // Multiplexer A signal pin

// Pin to letter mapping
struct PinMapping {
  int pin;          // Pin number (or mux channel if isMux is true)
  char letter;      // Corresponding letter
  bool isMux;       // Whether this is a mux input
  bool triggered;   // Track if currently triggered
  int lowCount;     // Count of consecutive low readings
};

PinMapping pins[] = {
  {39, 'a', false, false, 0},
  {38, 's', false, false, 0},
  {40, 'd', false, false, 0},
  {41, 'f', false, false, 0},
  {25, 'g', false, false, 0},
  {26, 'z', false, false, 0},
  {27, 'x', false, false, 0},
  {14, 'c', true,  false, 0},  // Mux input 14
  {3,  'v', true,  false, 0}   // Mux input 3
};

const int NUM_PINS = sizeof(pins) / sizeof(pins[0]);
const int TRIGGER_THRESHOLD = 50;
const int RESET_THRESHOLD = 30;
const int LOW_COUNT_REQUIRED = 2;

void setup() {
  // Set up MUX control pins as outputs
  pinMode(MUX_S0, OUTPUT);
  pinMode(MUX_S1, OUTPUT);
  pinMode(MUX_S2, OUTPUT);
  pinMode(MUX_S3, OUTPUT);
  
  // Set up MUX signal pin as input
  pinMode(MUX_A_SIG, INPUT);
  
  // Set up direct pins as inputs
  for (int i = 0; i < NUM_PINS; i++) {
    if (!pins[i].isMux) {
      pinMode(pins[i].pin, INPUT);
    }
  }
}

void setMuxChannel(byte channel) {
  digitalWrite(MUX_S0, channel & 0x01);
  digitalWrite(MUX_S1, (channel >> 1) & 0x01);
  digitalWrite(MUX_S2, (channel >> 2) & 0x01);
  digitalWrite(MUX_S3, (channel >> 3) & 0x01);
}

void loop() {
  // Read and process each pin
  for (int i = 0; i < NUM_PINS; i++) {
    int sensorValue;
    
    // Read the value
    if (pins[i].isMux) {
      setMuxChannel(pins[i].pin);  // For mux inputs, pin holds the channel number
      delayMicroseconds(100);
      sensorValue = analogRead(MUX_A_SIG);
    } else {
      sensorValue = analogRead(pins[i].pin);
    }
    
    // Process the reading
    if (sensorValue > TRIGGER_THRESHOLD && !pins[i].triggered && pins[i].lowCount >= LOW_COUNT_REQUIRED) {
      Keyboard.print(pins[i].letter);
      
      pins[i].triggered = true;
      pins[i].lowCount = 0;
    } 
    else if (sensorValue <= RESET_THRESHOLD) {
      if (pins[i].triggered) {
        pins[i].lowCount++;
        if (pins[i].lowCount >= LOW_COUNT_REQUIRED) {
          pins[i].triggered = false;
        }
      } else {
        pins[i].lowCount = min(pins[i].lowCount + 1, LOW_COUNT_REQUIRED);
      }
    } else {
      pins[i].lowCount = 0;
    }
  }
  
  delay(40);
}
