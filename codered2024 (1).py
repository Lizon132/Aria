import json
import isodate
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
nltk.download('vader_lexicon')

class Flight:
    def __init__(self, flight_id, airline, departure, destination, departure_time, arrival_time, price, duration_iso,
                 segments):
        self.flight_id = flight_id
        self.airline = airline
        self.departure = departure
        self.destination = destination
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.price = price
        self.duration_hours = self.parse_iso_duration_to_hours(duration_iso)
        self.stops = len(segments) - 1  # Number of stops is segments minus one

    def parse_iso_duration_to_hours(self, iso_duration):
        duration = isodate.parse_duration(iso_duration)
        return duration.total_seconds() / 3600

    def convert_to_hours_minutes(self):
        total_minutes = int(self.duration_hours * 60)
        hours = total_minutes // 60
        minutes = total_minutes % 60
        return f"{hours} hours {minutes} minutes"


def load_flights_from_json(filename):
    with open(filename, 'r') as file:
        data = json.load(file)

    flights = []
    for flight_data in data['data']:
        # all types are str
        flight_id = flight_data['id']
        airline = flight_data['validatingAirlineCodes'][0]  # Assuming only one airline
        departure = flight_data['itineraries'][0]['segments'][0]['departure']['iataCode']
        destination = flight_data['itineraries'][0]['segments'][-1]['arrival']['iataCode']
        departure_time = flight_data['itineraries'][0]['segments'][0]['departure']['at']
        arrival_time = flight_data['itineraries'][0]['segments'][-1]['arrival']['at']
        price = float(flight_data['price']['total'])
        duration_iso = flight_data['itineraries'][0]['duration']
        segments = flight_data['itineraries'][0]['segments']
        flights.append(
            Flight(flight_id, airline, departure, destination, departure_time, arrival_time, price, duration_iso,
                   segments))

    return flights


def calculate_score(flight, preferences, flight_time_preference):
    price_weight = 0
    duration_weight = 0
    stops_weight = 0
    time_weight = 0

    if 'price' in preferences:
        price_weight = 0.8
        duration_weight = 0.1
        stops_weight = 0.1
    elif 'duration' in preferences:
        price_weight = 0.1
        duration_weight = 0.8
        stops_weight = 0.1
    elif 'stops' in preferences:
        price_weight = 0.1
        duration_weight = 0.1
        stops_weight = 0.8
    else:
        price_weight = 0.4
        duration_weight = 0.3
        stops_weight = 0.3

    if flight_time_preference and flight_time_preference.lower() not in ['all day', '']:
        if flight_time_preference == 'early':
            time_weight = 0.8
        elif flight_time_preference == 'mid-day':
            time_weight = 0.7
        elif flight_time_preference == 'night':
            time_weight = 0.6
        else:
            time_weight = 0.0

    total_weight = price_weight + duration_weight + stops_weight + time_weight

    score = (flight.price * price_weight +
             flight.duration_hours * duration_weight +
             flight.stops * stops_weight) / total_weight
    flight.duration_hours_minutes = flight.convert_to_hours_minutes()
    return score


def find_top_flights(flights, num_flights, preferences, flight_time_preference):
    sorted_flights = sorted(flights, key=lambda x: calculate_score(x, preferences, flight_time_preference))
    if num_flights < len(sorted_flights):
        return sorted_flights[:num_flights]
    else:
        return sorted_flights


def display_flight_info(flights):
    print("Flight Information:")
    print("---------------------------------")
    idx = 1
    for flight in flights:
        print(f"Flight ID: {flight.flight_id}")
        print(f"Airline: {flight.airline}")
        print(f"Departure: {flight.departure}")
        print(f"Destination: {flight.destination}")
        print(f"Departure Time: {flight.departure_time}")
        print(f"Arrival Time: {flight.arrival_time}")
        print(f"Price: ${flight.price}")
        print(f"Duration: {flight.duration_hours_minutes}")
        print(f"Number of Stops: {flight.stops}")
        print("")
        idx += 1


def get_num_results_from_user():
    while True:
        try:
            num_results = int(input("How many results would you like to see? "))
            if num_results <= 0:
                print("Please enter a number greater than 0.")
            else:
                return num_results
        except ValueError:
            print("Please enter a valid integer.")


def get_user_preferences():
    # Define your predefined keywords for sentiment analysis
    keywords = ["price", "duration", "stops"]

    # Initialize responses dictionary
    responses = {keyword: "" for keyword in keywords}

    # Prompt the user for input based on predefined keywords
    for keyword in keywords:
        response = input(f"How important is {keyword} to you in determining your travel option? (very important, important, not important): ")
        responses[keyword] = response

    # Prompt for flight time preference
    flight_time_preference = input("Do you have any preference for flight time? (early, mid-day, night, all day): ")
    responses["flight_time_preference"] = flight_time_preference

    # Use sentiment analysis to determine user preference
    return responses


# this function will return what category that the user wants to focus on the most
# return a string
def get_scores_each_cate(responses):
    max_score = 0
    category = ""
    for key in responses:
        score = generate_sentiment_score(responses[key])
        if score > max_score:
            category = key
            max_score = score
    # print(category)
    return category


def generate_sentiment_score(text):
    analyzer = SentimentIntensityAnalyzer()
    sentiment_scores = analyzer.polarity_scores(text)
    return sentiment_scores['compound']


# Example usage
if __name__ == "__main__":
    # Load flights from a JSON file
    flights = load_flights_from_json('test.json')

    # Get number of results from the user
    num_results = get_num_results_from_user()

    # Get user preferences
    preferences = get_user_preferences()

    # Display top flights based on user's choice
    top_flights = find_top_flights(flights, num_results, preferences, preferences["flight_time_preference"])
    display_flight_info(top_flights)
