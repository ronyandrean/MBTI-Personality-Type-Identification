from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app, origins=["https://mbti-personality-type-identification.vercel.app"])

# Load the vectorizer and model
try:
    with open("vectorizer.pkl", "rb") as vec_file:
        loaded_vectorizer = pickle.load(vec_file)
    with open("mbti_model.pkl", "rb") as model_file:
        loaded_model = pickle.load(model_file)
except Exception as e:
    print(f"Error loading model or vectorizer: {e}")

@app.route('/')
def home():
    return "MBTI Classifier API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get user input from the request
        data = request.json
        user_text = data.get("text", "")

        if not user_text or not isinstance(user_text, str):
            return jsonify({"error": "Invalid or empty text provided"}), 400

        # Transform input text and make a prediction
        input_vector = loaded_vectorizer.transform([user_text])
        prediction = loaded_model.predict(input_vector)

        # Get prediction probabilities
        try:
            probabilities = loaded_model.predict_proba(input_vector)
        
            # Check shape of probabilities to avoid errors
            if probabilities.shape[1] == 1:
                probabilities = np.array([probabilities[0][0], 1 - probabilities[0][0]])  # Assuming binary classification
            else:
                probabilities = probabilities[0]  # For multi-class classification

            # Map probabilities to MBTI types
            mbti_types = loaded_model.classes_ 
            probabilities_table = dict(zip(mbti_types, probabilities))
        
        except Exception as e:
            return jsonify({"error": f"Error getting probabilities: {str(e)}"}), 500
        
        # Return the MBTI type and prediction probabilities
        return jsonify({
            "mbti_type": prediction[0],
            "probabilities": probabilities_table
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# # Debugging route (optional)
# @app.route('/debug', methods=['POST'])
# def debug():
#     try:
#         # Test with a hardcoded example
#         example_text = "I prefer to stick to proven methods and focus on completing tasks efficiently and reliably."
#         input_vector = loaded_vectorizer.transform([example_text])
#         probabilities = loaded_model.predict_proba(input_vector)

#         return jsonify({
#             "example_text": example_text,
#             "input_vector": input_vector.toarray().tolist(),
#             "prediction_probabilities": probabilities.tolist()
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
