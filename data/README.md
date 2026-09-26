# Data Cleaning & Translation Process

This directory contains the datasets and documentation for our market data cleaning and translation workflow. 

## Data Sourcing & Dynamics
Our application is built to be **dynamic, not hardcoded**. We receive new market data every week by downloading PDFs from UzExpo. The data pipeline is designed to continually ingest, clean, and process this incoming data so that our app always reflects the latest market information.

## Translation Workflow
A crucial part of the data cleaning process involves translating product names and descriptions. Our workflow is split into historical and ongoing processes:

### 1. Historical Data
*   The initial baseline dataset of **16,000 products** was translated **manually**. This ensures a high level of accuracy and provides a strong foundation for our application.

### 2. Ongoing Weekly Data
Because new data arrives weekly, relying solely on manual translation is not scalable. For all future incoming products:
*   **Automated Translation:** We use Google Translate to automatically translate new product entries as soon as the PDFs are downloaded and parsed.
*   **Human Review:** To maintain high data quality, a dedicated data analyst (a paid role) reviews and corrects the automated translations on a weekly basis. 

This hybrid approach allows us to scale dynamically while ensuring our data remains accurate and reliable over time.
