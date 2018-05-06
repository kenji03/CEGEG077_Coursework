# CEGEG077_Coursework
This is to create location-based quiz and consists of two Apps and one NodeJS server

Location-based Quiz App This app serves a quiz of multiple-choice questions when users are colse to a given point (a building around UCL). Once the users answer the quiz, the system will then let them know if they are correct or not, and will show them the correct answer. When the users move to a different location, a different question will be asked.

Question Setting App This app creates a new question by clicking on a point on a Leaflet map and adding the question and four possible answer. The question should be stored in a database on the web server.

NodeJS Server This server plays an role in linking between Question App and Database, Quiz App and Database. What the server does is the following:

Allows an administerator to store a list of question points and questions to a database, for use with the Question App
Generates the list of questions to send to the quiz App when the App is launced
Stores the answers that are sent from the Quiz App
