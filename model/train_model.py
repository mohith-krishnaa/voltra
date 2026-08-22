"""
Smart Electricity Bill Predictor - Model Training Script (v2.0)
Trains regression pipeline for 22+ appliances.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# Ensure project root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from data.generate_dataset import APPLIANCE_SPECS, generate_dataset

CATEGORICAL_FEATURES = ["house_type", "season", "tariff_zone"]
NUMERICAL_FEATURES = ["area_sqft", "occupants"]
for app_key in APPLIANCE_SPECS.keys():
    NUMERICAL_FEATURES.append(f"{app_key}_count")
    NUMERICAL_FEATURES.append(f"{app_key}_hours")

TARGET = "monthly_kwh"

def build_pipeline():
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES),
            ("num", StandardScaler(), NUMERICAL_FEATURES)
        ]
    )
    
    regressor = RandomForestRegressor(
        n_estimators=100,
        max_depth=16,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    
    pipeline = Pipeline(steps=[
        ("preprocessor", preprocessor),
        ("regressor", regressor)
    ])
    return pipeline

def train_and_evaluate(data_path: str, model_save_path: str):
    print(f"[Training] Loading dataset from '{data_path}'...")
    df = pd.read_csv(data_path)
    
    X = df[CATEGORICAL_FEATURES + NUMERICAL_FEATURES]
    y = df[TARGET]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    print(f"[Training] Training samples: {len(X_train)}, Testing samples: {len(X_test)}")
    
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_test)
    
    r2 = r2_score(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    
    print("\n--- Model Evaluation Results ---")
    print(f"R² Score:             {r2:.4f}  (Target: >= 0.98)")
    print(f"Root Mean Sq Error:   {rmse:.2f} kWh")
    print(f"Mean Absolute Error:  {mae:.2f} kWh")
    print("--------------------------------\n")
    
    os.makedirs(os.path.dirname(os.path.abspath(model_save_path)), exist_ok=True)
    joblib.dump(pipeline, model_save_path)
    print(f"[Training] Saved trained model to '{model_save_path}'.")
    return pipeline, {"r2": r2, "rmse": rmse, "mae": mae}

if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(current_dir)
    data_file = os.path.join(project_root, "data", "electricity_data.csv")
    model_file = os.path.join(current_dir, "bill_model.joblib")
    
    from data.generate_dataset import generate_dataset
    generate_dataset(num_samples=12000, output_path=data_file)
    train_and_evaluate(data_file, model_file)
