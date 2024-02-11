# ARIA - AI Route Information Assistant

ARIA (Artificial Intelligence Route Information Assistant) is a web-based application designed to assist users in finding the most optimal flight options using natural language inputs. With a special feature of speech recognition, ARIA streamlines the flight search process, making it easier and more intuitive for users to find suitable flights based on their preferences.

## Key Features

- **Natural Language Processing**: Utilizes natural language processing to interpret user inputs and understand their flight preferences.
- **Speech Recognition**: Incorporates speech recognition capabilities, allowing users to interact with the application using voice commands.
- **Optimal Flight Selection**: Calculates weighted sentiment scores based on user inputs and filters out the optimal flight options from data obtained through Amadeus and Google Gemini APIs.
- **Interactive Web Interface**: Provides an interactive web interface built with React, allowing users to input their flight preferences and view the recommended options.
- **Integration with Amadeus and Google Gemini**: Scrapes travel-related data using the Amadeus API and utilizes Google Gemini for enhanced flight recommendations.
- **AI-Powered Response Generation**: Generates natural language responses to present the optimal flight options to the user in an easy-to-understand format.

## Technologies Used

- **Node.js**: Backend development and server-side scripting.
- **React**: Frontend development for building the interactive user interface.
- **Python**: Backend scripting for natural language processing and data processing.
- **Amadeus API**: Integration with the Amadeus API for retrieving travel-related data and flight information.
- **Google Gemini**: Utilization of Google Gemini for enhanced flight recommendations and data analysis.

## How It Works

1. **User Input**: Users input their flight preferences using natural language inputs or voice commands.
2. **Natural Language Processing**: The input data is processed using Python scripts to calculate weighted sentiment scores based on user preferences.
3. **Optimal Flight Selection**: Based on the calculated scores, the application filters out the most optimal flight options from the data obtained through Amadeus and Google Gemini APIs.
4. **Data Presentation**: The optimal flight options are presented to the user in a natural language response, generated using AI-powered techniques.
5. **User Interaction**: Users can interact with the presented options through the web interface, adjusting preferences as needed.

## Python File Description
### pyscript.py
This Python script implements a flight recommendation system based on user preferences. It loads flight data from a JSON file, processes user preferences from another JSON file, calculates weights based on sentiment analysis of user preferences, and then finds the best flight options based on these weights.

#### Dependencies

- **json**: Used for reading and writing JSON files.
- **isodate**: Utilized for parsing ISO-formatted durations.
- **nltk**: Natural Language Toolkit library for sentiment analysis.

#### FlightSearch Usage

1. **Setup:**
   - Ensure Python and dependencies (json, isodate, nltk) are installed.

2. **Data Preparation:**
   - Prepare `user_preferences.json` and `flights.json` files with relevant data.

3. **Execution:**
   - Run the script using Python.

### Classes and Functions

1. **Flight Class:**
   - Represents a single flight with attributes like flight ID, airline, departure, arrival, departure time, arrival time, price, duration, number of stops, and flight type.
   - Method: `parse_iso_duration_to_hours`

2. **analyze_sentiment Function:**
   - Utilizes the NLTK SentimentIntensityAnalyzer to analyze the sentiment of text.
   - Returns a sentiment score.

3. **load_flights_from_json Function:**
   - Loads flight data from a JSON file.
   - Creates `Flight` objects from the data and returns a list of flights.

4. **load_user_preferences Function:**
   - Loads user preferences from a JSON file.
   - Returns preferences as a dictionary.

5. **calculate_weights Function:**
   - Calculates weights for user preferences based on sentiment analysis.
   - Returns a dictionary of weights.

6. **find_best_flights Function:**
   - Finds the best flights based on calculated weights.
   - Returns a list of flights sorted by score in descending order.

7. **save_flight_info_to_json Function:**
   - Saves information about top-flight options to a JSON file.
   - Includes flight ID, airline, price, departure time, duration, stops, and score for each flight.

### Example Output

The script saves the best flight options to `results.json`.

## Getting Started

To get started with ARIA, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `npm install`.
3. Set up your Amadeus API and Google Gemini credentials.
4. Run the application using `npm start`.
5. Access ARIA through your web browser and start searching for optimal flight options!






