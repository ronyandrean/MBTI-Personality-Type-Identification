import pandas as pd
import numpy as np
import string
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report, confusion_matrix
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk
import re

# Download NLTK Data that needed
# nltk.download('punkt')
# nltk.download('stopwords')

# Load dataset
data_set = pd.read_csv("D:/BINUS/AI/AI_Project/website/mbti_1.csv")

# Preprocessing functions
stop_words = set(stopwords.words("english")).union(set(string.punctuation))

def preprocess_text(text):
    # Clean URLs, emojis, and special characters
    text = re.sub(r"http\S+|www\S+|@\S+|#[^\s]+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    
    # Tokenize and remove stopwords
    words = word_tokenize(text.lower())
    return " ".join([word for word in words if word not in stop_words])

# Preprocess posts
data_set['posts'] = data_set['posts'].apply(lambda x: " ".join([preprocess_text(post) for post in x.split("|||")]))

# Check class balance
print(data_set['type'].value_counts())

# Balance classes (Optional: Oversample rare classes)
min_samples = data_set['type'].value_counts().min()
balanced_data = pd.concat([data_set[data_set['type'] == label].sample(min_samples, replace=True)
                           for label in data_set['type'].unique()])

# Prepare features and labels
features = balanced_data['posts']
labels = balanced_data['type']

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42, stratify=labels)

# Vectorize text data
vectorizer = TfidfVectorizer(max_features=3000, stop_words="english", ngram_range=(1, 2))
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Train RandomForestClassifier with hyperparameter tuning
rf = RandomForestClassifier(random_state=42, n_jobs=-1)

# Hyperparameter grid
param_grid = {
    "n_estimators": [50, 100, 200],
    "max_depth": [10, 50, None],
    "min_samples_split": [2, 5, 10]
}

grid_search = GridSearchCV(rf, param_grid, cv=3, scoring="accuracy", verbose=2, n_jobs=-1)
grid_search.fit(X_train_tfidf, y_train)

best_model = grid_search.best_estimator_

# Evaluate model
y_pred = best_model.predict(X_test_tfidf)
print("Classification Report:")
print(classification_report(y_test, y_pred))
print("Confusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Save the trained vectorizer and model
with open("vectorizer.pkl", "wb") as vec_file:
    pickle.dump(vectorizer, vec_file)

with open("mbti_model.pkl", "wb") as model_file:
    pickle.dump(best_model, model_file)

print("Model and vectorizer saved successfully.")
