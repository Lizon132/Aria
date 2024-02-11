import sys
import json
import requests
import pyscripts as pyimp

def main(jsonObj, answers):
    json.dumps(answers, indent=4)
    # Load the search parameters from your JSON file
    # with open('your_json_file.json', 'r') as file:
    #     search_parameters = json.load(file)
    ACCESS_TOKEN = "BY6S3GGmOMRNXpdTBDapgMLR9X8Z"

    # The endpoint URL for flight offers search; adjust as necessary for the specific API call
    url = "https://test.api.amadeus.com/v2/shopping/flight-offers"

    # Headers including Authorization (Replace YOUR_ACCESS_TOKEN with your actual token)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ACCESS_TOKEN
    }

    # Make the POST request with your search parameters
    response = requests.post(url, headers=headers, json=jsonObj)

    # Check if the request was successful
    if response.status_code == 200:
        # Process the successful response
        data = response.json()
        print(json.dumps(data, indent=4))
    else:
        # Handle request error
        print("Failed to fetch data:", response.status_code, response.text)

    pyimp.main(data, answers)
    




if __name__ == "__main__":
    # Check if a JSON string argument is provided
    if len(sys.argv) < 2:
        print("Error: JSON string argument is missing.")
    else:
        # Extract the JSON string from command-line arguments
        json_str = sys.argv[1]
        json_answers = sys.argv[2]

        # Parse the JSON string into a Python dictionary
        try:
            json_data = json.loads(json_str)
            answers = json.loads(json_answers)
        except json.JSONDecodeError as e:
            print("Error decoding JSON:", e)
        else:
            # Call the main function with the parsed JSON data
            main(json_data, answers)
