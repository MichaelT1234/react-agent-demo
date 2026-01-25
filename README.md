# ReAct Agent Demo

A Flask-based demonstration of a ReAct agent using LangChain's `create_pandas_dataframe_agent`. 

## Features
- **Modern Chat Interface**: Ask natural language questions about your CSV data.
- **Explainable AI**: View the agent's intermediate "thinking" steps (Action/Observation) in a collapsible sidebar.
- **Data Viewer**: Explore the raw dataset.
- **Architecture View**: See the agent's design.

## Setup

1.  **Install Dependencies**
    It's recommended to use a virtual environment.
    ```bash
    pip install flask pandas tabulate langchain langchain_experimental langchain_openai python-dotenv
    ```

2.  **Configure API Key**
    - Rename `.env.example` to `.env` (if not already done).
    - Add your OpenAI API Key to `.env`:
      ```
      OPENAI_API_KEY=sk-your-key-here
      ```
      *Note: This demo uses GPT-4o by default for best reasoning.*

3.  **Run the Application**
    ```bash
    python app.py
    ```

4.  **Access**
    Open your browser to `http://127.0.0.1:5001`

## Files
- `app.py`: Flask backend and Agent initialization.
- `static/`: Frontend assets (CSS, JS).
- `templates/`: HTML templates.
- `ecommerce_customer_churn_dataset.csv`: Sample data.
