import os
import pandas as pd
from flask import Flask, render_template, request, jsonify
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Optional LangSmith Tracking
if os.getenv("LANGCHAIN_API_KEY"):
    os.environ["LANGCHAIN_TRACING_V2"] = "true"
    os.environ.setdefault("LANGCHAIN_PROJECT", "react-agent-demo")
else:
    os.environ["LANGCHAIN_TRACING_V2"] = "false"

app = Flask(__name__)

# Initialize Global Components
try:
    df = pd.read_csv("ecommerce_customer_churn_dataset.csv")
    csv_loaded = True
    print(f"CSV Loaded Successfully. Shape: {df.shape}")
    print(f"Columns: {df.columns.tolist()}")
except FileNotFoundError:
    df = pd.DataFrame() # Empty fallback
    csv_loaded = False
    print("Warning: CSV file not found.")

def get_agent():
    # Helper to get agent - re-initializes if needed
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("Warning: OPENAI_API_KEY not found in environment variables.")
        return None
    
    llm = ChatOpenAI(temperature=0, model="gpt-4.1", api_key=api_key) 
    
    return create_pandas_dataframe_agent(
        llm, 
        df,
        verbose=True,
        return_intermediate_steps=True,
        allow_dangerous_code=True
    )

agent = get_agent()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    print("Received chat request")
    data = request.json
    user_input = data.get('message')
    
    # Reload agent in case API key was added late
    global agent
    if not agent:
        agent = get_agent()
        
    if not agent:
        return jsonify({"error": "Agent not initialized. Please set OPENAI_API_KEY in .env and restart."}), 500

    try:
        # Run the agent
        response = agent.invoke({"input": user_input})
        
        # Parse intermediate steps
        steps = []
        if "intermediate_steps" in response:
            for action, observation in response["intermediate_steps"]:
                steps.append({
                    "log": action.log,
                    "tool": action.tool,
                    "tool_input": action.tool_input,
                    "observation": str(observation) 
                })
                
        return jsonify({
            "response": response["output"],
            "steps": steps
        })
    except Exception as e:
        print(f"Error during agent execution: {e}")
        return jsonify({"error": str(e)}), 500

import json

@app.route('/api/data', methods=['GET'])
def get_data():
    if not csv_loaded:
        return jsonify({"error": "Data not available"}), 404
    
    # Return first 100 rows
    try:
        # Load only first 100 rows for performance
        subset = df.head(100)
        json_str = subset.to_json(orient='records')
        data_records = json.loads(json_str)
        
        return jsonify({
            "columns": df.columns.tolist(),
            "data": data_records
        })
    except Exception as e:
        print(f"Error serialization data: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to serialize data: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, port=port)