#include <WiFi.h>
#include <HTTPClient.h>


const char* ssid = "Suranan";
const char* password =  "075214299";

void setup() {

  Serial.begin(115200);
  delay(4000);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("Connected to the WiFi network");

}

String TagID;
String Passcode;
int Amount;
int MenuID;

String UserID;
String Name;
String DateofBirth;
String Sex;
String Tel;
String Address;


HTTPClient http;

void loop() {


  Serial.println("*************************");
  Serial.println("Enter Menu, Press ENTER : ");
  Serial.println("1 - Create User Info");
  Serial.println("2 - Update User Info");
  Serial.println("3 - Create New Tag");
  Serial.println("4 - Register and Add Money");
  Serial.println("5 - Clear Money");
  Serial.println("*************************");
  while (Serial.available() == 0);
  {
    MenuID = Serial.parseInt();
    Serial.print("MenuID : "); Serial.println(MenuID);
    Serial.println("*************************");
  }

switch (var) {
    case 1:
     Serial.print("UserID : ");
  while (Serial.available() == 0);
  {
    UserID = Serial.readString(); Serial.println(UserID);
  }

//  http.begin("http://10.0.2.4:3000/CheckDup_UserID?UserID=" + UserID);
//  http.addHeader("Content-Type", "text/plain");
//  int httpResponseCode = http.POST("test");
//  String response = http.getString();
//  if (response == "success") goto Menu1Next;
//  else goto End;
//  http.end();
    break;
  default:
    // statements
}

Menu1:
 
  //goto CheckDup_UserID;
Menu1Next:
  Serial.print("Name : ");
  while (Serial.available() == 0);
  {
    Name = Serial.readString(); Serial.println(Name);
  }
  Serial.print("DateofBirth : ");
  while (Serial.available() == 0);
  {
    DateofBirth = Serial.readString(); Serial.println(DateofBirth);
  }
  Serial.print("Sex : ");
  while (Serial.available() == 0);
  {
    Sex = Serial.readString(); Serial.println(Sex);
  }
  Serial.print("Tel : ");
  while (Serial.available() == 0);
  {
    Tel = Serial.readString(); Serial.println(Tel);
  }
  Serial.print("Address : ");
  while (Serial.available() == 0);
  {
    Address = Serial.readString(); Serial.println(Address);
  }
  http.begin("http://10.0.2.4:3000/registerUser?UserID=" + UserID + "&Name=" + Name + "&DateofBirth=" + DateofBirth + "&Sex=" + Sex + "&Tel=" + Tel + "&Address=" + Address); //Specify destination for HTTP request
  http.addHeader("Content-Type", "text/plain");
  int httpResponseCode = http.POST("test");
  String response = http.getString();
  if (response == "success") Serial.println("*************************\n*   ดำเนินการเรียบร้อย !!!   *\n*************************");
  else Serial.println("*************************\n*   ดำเนินการไม่สำเร็จ !!!   *\n*************************");
  http.end();
  goto End;
  


//    Menu2:
//      Serial.println("Menu2");
//    goto End;
//  
//    Menu3:
//      Serial.println("Menu3");
//    goto End;











  /*

    Serial.println("Enter TagID, Press ENTER : ");
    while (Serial.available() == 0);
    {
      TagID = Serial.readString();
      Serial.print("TagID : "); Serial.println(TagID);
      Serial.println("*************************");
    }
    if (MenuID == 1) {
      http.begin("http://10.0.2.4:3000/DupCheck?TagID=" + TagID); //Specify destination for HTTP request
      http.addHeader("Content-Type", "text/plain");             //Specify content-type header

      int httpResponseCode = http.POST("test");   //Send the actual POST request
      String response = http.getString();                       //Get the response to the request

      if (response == "success") {
        Serial.println("Enter Passcode, Press ENTER : ");
        while (Serial.available() == 0);
        {
          Passcode = Serial.readString();
          Serial.print("Passcode : "); Serial.println(Passcode);
          Serial.println("*************************");
        }

        Serial.println("Enter Amount, Press ENTER : ");
        while (Serial.available() == 0);
        {
          Amount = Serial.parseInt();
          Serial.print("Amount : "); Serial.println(Amount);
          Serial.println("*************************");
        }
        http.end();  //Free resources
        http.begin("http://10.0.2.4:3000/register?TagID=" + TagID + "&Passcode=" + Passcode + "&Amount=" + Amount); //Specify destination for HTTP request
      }
    }
    else if (MenuID == 2) {
      Serial.println("*************************");
      Serial.println("Enter Passcode, Press ENTER : ");
      while (Serial.available() == 0);
      {
        Passcode = Serial.readString();
        Serial.print("Passcode : "); Serial.println(Passcode);
        Serial.println("*************************");
      }

      Serial.println("Enter Amount, Press ENTER : ");
      while (Serial.available() == 0);
      {
        Amount = Serial.parseInt();
        Serial.print("Amount : "); Serial.println(Amount);
        Serial.println("*************************");
      }
      http.begin("http://10.0.2.4:3000/update?TagID=" + TagID + "&Passcode=" + Passcode + "&Amount=" + Amount); //Specify destination for HTTP request
    }
    else if (MenuID == 3) {
      http.begin("http://10.0.2.4:3000/Return?TagID=" + TagID); //Specify destination for HTTP request
    }
    else {
      Serial.println("*************************");
      Serial.println("ใส่ตัวเลขเมนูไม่ถูกต้อง");
      Serial.println("*************************");
    }



    http.addHeader("Content-Type", "text/plain");             //Specify content-type header

    int httpResponseCode = http.POST("test");   //Send the actual POST request
    String response = http.getString();                       //Get the response to the request

    if (httpResponseCode > 0) {

      Serial.println(httpResponseCode);   //Print return code
      Serial.println(response);           //Print request answer

    } else {

      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
      Serial.println(response);
    }

    http.end();  //Free resources
  */
//CheckDup_UserID:
//  http.begin("http://10.0.2.4:3000/CheckDup_UserID?UserID=" + UserID);
//  http.addHeader("Content-Type", "text/plain");
//  int httpResponseCode = http.POST("test");
//  String response = http.getString();
//  if (response == "success") goto Menu1Next;
//  else goto End;
//  http.end();


End:
  Serial.println("\n\n\n\n");
}
