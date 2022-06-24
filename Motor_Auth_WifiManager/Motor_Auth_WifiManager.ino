#include <Arduino.h>
#include <WiFiManager.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <Stepper.h>
#include <FS.h>
#include <SPIFFS.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h>

// Stepper Motor Settings
const int stepsPerRevolution = 2048;  // change this to fit the number of steps per revolution
#define IN1 19
#define IN2 18
#define IN3 5
#define IN4 17
Stepper myStepper(stepsPerRevolution, IN1, IN3, IN2, IN4);

// Variables to save values from HTML form
String direction;
String steps;

int timeout = 120; // seconds to run for

// Create AsyncWebServer object on port 80
AsyncWebServer server(80);

// Search for parameters in HTTP POST request
const char* PARAM_INPUT_1 = "direction";
const char* PARAM_INPUT_2 = "steps";
String deviceOptionsReadings;
String deviceOptionsReadingsArr[4];
bool acknowledged;

// Variable to detect whether a new request occurred
bool newRequest = false;

// HTML to build the web page
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <title>Stepper Motor</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <h1>Stepper Motor Control</h1>
    <form action="/" method="POST">
      <input type="radio" name="direction" value="CW" checked>
      <label for="CW">Clockwise</label>
      <input type="radio" name="direction" value="CCW">
      <label for="CW">Counterclockwise</label><br><br><br>
      <label for="steps">Number of steps:</label>
      <input type="number" name="steps">
      <input type="submit" value="GO!">
    </form>
</body>
</html>
)rawliteral";

// JSON configuration file
#define JSON_CONFIG_FILE "/pass_email_config.json"

// Flag for saving data
bool shouldSaveConfig = false;

// Variables to hold data from custom textboxes
char passwordString[50] = "";
char emailString[80]="";

// Define WiFiManager Object
WiFiManager wm;

// THE DEFAULT TIMER IS SET TO 10 SECONDS FOR TESTING PURPOSES
// For a final application, check the API call limits per hour/minute to avoid getting blocked/banned
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 10 seconds (10000)
unsigned long timerDelay = 10000;

// Domain Name with full URL Path for HTTP POST Request
const char* getLastCommandEndPoint = "http://192.168.100.12:4009/Command/get-last-command";
//const char* getLastCommandEndPoint = "http://localhost:4000/Command/get-last-command";


void saveConfigFile()
// Save Config in JSON format
{
    Serial.println(F("Saving configuration..."));

    // Create a JSON document
    StaticJsonDocument<512> json;
    json["password"] = passwordString;
    json["email"] = emailString;

    // Open config file
    File configFile = SPIFFS.open(JSON_CONFIG_FILE, "w");
    if (!configFile)
    {
        // Error, file did not open
        Serial.println("failed to open config file for writing");
    }

    // Serialize JSON data to write to file
    serializeJsonPretty(json, Serial);
    if (serializeJson(json, configFile) == 0)
    {
        // Error writing file
        Serial.println(F("Failed to write to file"));
    }
    // Close file
    configFile.close();
}

bool loadConfigFile()
// Load existing configuration file
{
    // Uncomment if we need to format filesystem
    // SPIFFS.format();

    // Read configuration from FS json
    Serial.println("Mounting File System...");

    // May need to make it begin(true) first time you are using SPIFFS
    if (SPIFFS.begin(false) || SPIFFS.begin(true))
    {
        Serial.println("mounted file system");
        if (SPIFFS.exists(JSON_CONFIG_FILE))
        {
            // The file exists, reading and loading
            Serial.println("reading config file");
            File configFile = SPIFFS.open(JSON_CONFIG_FILE, "r");
            if (configFile)
            {
                Serial.println("Opened configuration file");
                StaticJsonDocument<512> json;
                DeserializationError error = deserializeJson(json, configFile);
                serializeJsonPretty(json, Serial);
                if (!error)
                {
                    Serial.println("Parsing JSON");

                    strcpy(passwordString, json["password"]);
                    strcpy(emailString, json["email"]);

                    return true;
                }
                else
                {
                    // Error loading JSON data
                    Serial.println("Failed to load json config");
                }
            }
        }
    }
    else
    {
        // Error mounting file system
        Serial.println("Failed to mount FS");
    }

    return false;
}

void saveConfigCallback()
// Callback notifying us of the need to save configuration
{
    Serial.println("Should save config");
    shouldSaveConfig = true;
}

void configModeCallback(WiFiManager* myWiFiManager)
// Called when config mode launched
{
    Serial.println("Entered Configuration Mode");

    Serial.print("Config SSID: ");
    Serial.println(myWiFiManager->getConfigPortalSSID());

    Serial.print("Config IP Address: ");
    Serial.println(WiFi.softAPIP());
}

//Test for connection with hosted API
String httpGETRequest(const char* serverName) {
  WiFiClient client;
  HTTPClient http;
    
  // Your Domain name with URL path or IP address with path
  http.begin(client, serverName);
  
  // Send HTTP POST request
  int httpResponseCode = http.GET();
  
  String payload = "{}"; 
  
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    payload = http.getString();
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();

  return payload;
}

void setup() {
 // Change to true when testing to force configuration every time we run
  bool forceConfig = false;

  bool spiffsSetup = loadConfigFile();
  if (!spiffsSetup)
  {
      Serial.println(F("Forcing config mode as there is no saved config"));
      forceConfig = true;
  }

  // Explicitly set WiFi mode
  WiFi.mode(WIFI_STA);

  // Setup Serial monitor
  Serial.begin(115200);
  delay(10);

  // Reset settings (only for development)
  wm.resetSettings();

  // Set config save notify callback
  wm.setSaveConfigCallback(saveConfigCallback);

  // Set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wm.setAPCallback(configModeCallback);

  // Custom elements

  // Text box (String) - 50 characters maximum
  WiFiManagerParameter password_text_box("key_password", "Enter your account password here", passwordString, 50);

  // Text box (Number) - 7 characters maximum
  WiFiManagerParameter email_text_box("key_email", "Enter your email here", emailString, 80);

  // Add all defined parameters
  wm.addParameter(&password_text_box);
  wm.addParameter(&email_text_box);

  if (forceConfig)
      // Run if we need a configuration
  {
      if (!wm.startConfigPortal("AutoConnectAP", "password"))
      {
          Serial.println("failed to connect and hit timeout");
          delay(3000);
          //reset and try again, or maybe put it to deep sleep
          ESP.restart();
          delay(5000);
      }
  }
  else
  {
      if (!wm.autoConnect("AutoConnectAP", "password"))
      {
          Serial.println("failed to connect and hit timeout");
          delay(3000);
          // if we still have not connected restart and try all over again
          ESP.restart();
          delay(5000);
      }
  }

  // If we get here, we are connected to the WiFi

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Lets deal with the user config values

  // Copy the string value
  strncpy(passwordString, password_text_box.getValue(), sizeof(passwordString));
  Serial.print("password: ");
  Serial.println(passwordString);

  // Copy the string value
  strncpy(emailString, email_text_box.getValue(), sizeof(emailString));
  Serial.print("password: ");
  Serial.println(emailString);


  // Save the custom parameters to FS
  if (shouldSaveConfig)
  {
      saveConfigFile();
  }

  myStepper.setSpeed(5);

  // Web Server Root URL
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    request->send(200, "text/html", index_html);
  });
  
  // Handle request (form)
  server.on("/", HTTP_POST, [](AsyncWebServerRequest *request) {
    AsyncWebServerResponse *response = request->beginResponse(200, "text/plain", "Ok");
    response->addHeader("Access-Control-Allow-Origin", "*");
    int params = request->params();
    for(int i=0;i<params;i++){
      AsyncWebParameter* p = request->getParam(i);
      if(p->isPost()){
        // HTTP POST input1 value (direction)
        if (p->name() == PARAM_INPUT_1) {
          direction = p->value().c_str();
          Serial.print("Direction set to: ");
          Serial.println(direction);
        }
        // HTTP POST input2 value (steps)
        if (p->name() == PARAM_INPUT_2) {
          steps = p->value().c_str();
          Serial.print("Number of steps set to: ");
          Serial.println(steps);
        }
      }
    }
    request->send(200, "text/plain", "Ok");
    newRequest = true;
  });

  server.begin();
}

String jsonBuffer;

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;

//        String serverPath = "http://192.168.100.12:4009/Command/get-worked";
//      jsonBuffer = httpGETRequest(serverPath.c_str());
//      Serial.println(jsonBuffer);
//      JSONVar myObject = JSON.parse(jsonBuffer);
//  
//      // JSON.typeof(jsonVar) can be used to get the type of the var
//      if (JSON.typeof(myObject) == "undefined") {
//        Serial.println("Parsing input failed!");
//        return;
//      }
//    
//      Serial.print("JSON object = ");
//      Serial.println(myObject);

        // Your Domain name with URL path or IP address with path
        http.begin(client, getLastCommandEndPoint);
        Serial.println("You sent the post command to get the last command");
        // If you need an HTTP request with a content type: application/json, use the following:
        http.addHeader("Content-Type", "application/json");
        // JSON data to send with HTTP POST
        Serial.println(String(emailString));
        Serial.println(String(passwordString));
        String httpRequestData = "{\"email\":\"" + String(emailString) + "\",\"password\":\"" + String(passwordString) + "\"}";
        // Send HTTP POST request
        int httpResponseCode = http.POST(httpRequestData);

//        Serial.print("HTTP Response code: ");
//        Serial.println(httpResponseCode);

        if (httpResponseCode>0) {
        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);
        deviceOptionsReadings = http.getString();
        Serial.println(deviceOptionsReadings);
        }else{
          Serial.print("Error on sending POST: ");
          Serial.println(httpResponseCode);       
         }

        // Free resources
        http.end();
              
        JSONVar deviceObject = JSON.parse(deviceOptionsReadings);
        if (JSON.typeof(deviceObject) == "undefined") {
          Serial.println("Parsing input failed!");
          return;
        }
        Serial.print("JSON object = ");
        Serial.println(deviceObject);
        JSONVar keys = deviceObject.keys();
        for (int i = 0; i < keys.length() - 1; i++) {
          JSONVar value = deviceObject[keys[i]];
          Serial.print(keys[i]);
          Serial.print(" = ");
          Serial.println(value);
          deviceOptionsReadingsArr[i] = value;
        }  
        direction = deviceOptionsReadingsArr[0];
        steps = deviceOptionsReadingsArr[1];
        
        Serial.print("1 = ");
        Serial.println(direction);
        Serial.print("2 = ");
        Serial.println(steps);
        JSONVar acknowledgedValue = deviceObject[keys[3]];
        Serial.println(deviceObject[keys[3]]);
        acknowledged = acknowledgedValue;
//        if(acknowledged == "false"){
//          acknowledged = false;
//        }
//        else{
//          acknowledged = true;
//        }
        Serial.println(bool(acknowledgedValue));
        if(acknowledged == false) {
          //Send command to motor
          if (direction == "CW"){
            // Spin the stepper clockwise direction
            Serial.println("Alabalaportocala");
            Serial.println(direction);
            Serial.println(steps);
            myStepper.step(steps.toInt());
          }
          else{
            // Spin the stepper counterclockwise direction
            Serial.println(direction);
            myStepper.step(-steps.toInt());
          }
        }
    }
    else {
        Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
  // Check if there was a new request and move the stepper accordingly
  //Used for direct control from Client side, without the API
  if (newRequest){
    if (direction == "CW"){
      // Spin the stepper clockwise direction
      Serial.println(direction);
      Serial.println(steps);
      myStepper.step(steps.toInt());
    }
    else{
      // Spin the stepper counterclockwise direction
      Serial.println(direction);
      myStepper.step(-steps.toInt());
    }
    newRequest = false;
  }
}


//Test for connection with hosted API

//String jsonBuffer;
//void loop(){
//  // Send an HTTP GET request
//  if ((millis() - lastTime) > timerDelay) {
//    // Check WiFi connection status
//    if(WiFi.status()== WL_CONNECTED){
//      String serverPath = "http://192.168.100.12:4009/Command/get-worked";
//      jsonBuffer = httpGETRequest(serverPath.c_str());
//      Serial.println(jsonBuffer);
//      JSONVar myObject = JSON.parse(jsonBuffer);
//  
//      // JSON.typeof(jsonVar) can be used to get the type of the var
//      if (JSON.typeof(myObject) == "undefined") {
//        Serial.println("Parsing input failed!");
//        return;
//      }
//    
//      Serial.print("JSON object = ");
//      Serial.println(myObject);
//      Serial.print("Temperature: ");
//      Serial.println(myObject["main"]["temp"]);
//      Serial.print("Pressure: ");
//      Serial.println(myObject["main"]["pressure"]);
//      Serial.print("Humidity: ");
//      Serial.println(myObject["main"]["humidity"]);
//      Serial.print("Wind Speed: ");
//      Serial.println(myObject["wind"]["speed"]);
//    }
//    else {
//      Serial.println("WiFi Disconnected");
//    }
//    lastTime = millis();
//  }
//}
