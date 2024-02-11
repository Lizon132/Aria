import json
import isodate
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk

# Ensure necessary NLTK resources are downloaded
nltk.download('vader_lexicon')

class Flight:
    def __init__(self, flight_id, airline, departure, destination, departure_time, arrival_time, price, duration_iso, segments):
        self.flight_id = flight_id
        self.airline = airline
        self.departure = departure
        self.destination = destination
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.price = float(price)
        self.duration_hours = self.parse_iso_duration_to_hours(duration_iso)
        self.stops = len(segments) - 1

    def parse_iso_duration_to_hours(self, iso_duration):
        duration = isodate.parse_duration(iso_duration)
        return duration.total_seconds() / 3600

def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    score = sia.polarity_scores(text)
    return score['compound']

def load_flights_from_json(filename):
    with open(filename, 'r') as file:
        data = json.load(file)["data"]
    flights = []
    for flight_data in data:
        flights.append(Flight(**flight_data))
    return flights

def load_user_preferences(filename):
    with open(filename, 'r') as file:
        return json.load(file)

def calculate_weights(preferences):
    sentiment_scores = {key: analyze_sentiment(value) for key, value in preferences.items()}
    total = sum(sentiment_scores.values())
    # Normalize scores to get weights
    weights = {key: value / total for key, value in sentiment_scores.items()}
    return weights

def find_best_flights(flights, weights):
    for flight in flights:
        flight.score = (
            weights.get("price_sensitivity", 0) * flight.price +
            weights.get("travel_duration", 0) * (1 / flight.duration_hours) +  # Higher score for shorter duration
            weights.get("date_and_time", 0) * (1 if "weekend" in preferences["date_and_time"].lower() else 0)  # Example scoring for date_and_time preference
        )
    flights.sort(key=lambda x: x.score, reverse=True)
    return flights

def save_flight_info_to_json(flights, filename='results.json'):
    flights_data = [{
        "Flight ID": flight.flight_id,
        "Airline": flight.airline,
        "Price": flight.price,
        "Duration Hours": flight.duration_hours,
        "Stops": flight.stops,
        "Score": getattr(flight, 'score', 0)
    } for flight in flights[:5]]  # Save top 5 flights based on score

    with open(filename, 'w') as file:
        json.dump(flights_data, file, indent=4)

    print(f"Top flight options have been saved to {filename}.")

if __name__ == "__main__":
    preferences = load_user_preferences('user_preferences.json')
    weights = calculate_weights(preferences)
    flights = load_flights_from_json('flights.json')
    best_flights = find_best_flights(flights, weights)
    save_flight_info_to_json(best_flights)