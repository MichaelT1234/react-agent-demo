# ReAct Agent Demo

A Flask-based demonstration of a ReAct agent using LangChain's `create_pandas_dataframe_agent`. 

## About

This project serves as a practical demonstration of the ReAct (Reasoning and Acting) architecture within an agentic framework. It illustrates how to develop solutions capable of performing actionable data analytics, moving beyond a model's foundational reasoning by enabling active data interaction.

Please note the following characteristics of this simplified demo:
- **Static Dataset**: The application relies on a fixed [E-commerce Customer Behavior Dataset](https://www.kaggle.com/datasets/dhairyajeetsingh/ecommerce-customer-behavior-dataset) sourced from Kaggle.
- **Foundational Architecture**: This repository focuses on showcasing core ReAct principles. For production-grade implementations, scaling strategies such as adding a router node or introducing dynamic model switching based on task complexity are highly recommended.

The interface actively surfaces the agent's workflow, featuring a dynamic view of the step-by-step reasoning process, a dedicated tab for dataset exploration, and a visual representation of the underlying ReAct architecture.

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
      *Note: This demo uses GPT-4.1 by default.*

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
