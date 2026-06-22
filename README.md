# Epiphyse: Bone Age Estimation

Welcome to the Epiphyse project. This repository contains the source code for a machine learning-powered web application that estimates bone age from X-ray images.

## Purpose

The primary goal of this project is to assist medical professionals and researchers in evaluating child growth. By analyzing bone development from X-ray scans, we can gain insights into a child's biological age compared to their chronological age. This is crucial for identifying potential growth disorders, endocrine abnormalities, or genetic conditions early on. The model automates this otherwise manual and time-consuming process, making it faster and more accessible.

## Technologies Used

This project is built using a modern technology stack to ensure performance, maintainability, and ease of use.

- **Machine Learning**: We developed the underlying model using PyTorch and OpenCV. The training process was conducted entirely within a Kaggle Notebook (please note, this was not done using a standard local Jupyter Notebook, leveraging Kaggle's environment and accelerators).
- **Backend API**: The server serving the predictions is built with FastAPI, providing a fast and robust endpoint for our frontend.
- **Frontend**: The user interface is crafted with React, Vite, and Tailwind CSS. We also use Framer Motion for smooth animations and Recharts for data visualization, delivering a clean and interactive experience.

## Configuration Steps

Follow these steps to set up the project on your local machine.

### 1. Download the Pre-trained Model

Before running the application, you must download the trained model weights. 
- Go to the Kaggle model repository: https://www.kaggle.com/models/naishagajkandh/bone-age-estimation-model
- Download the file named `final_model12.pth`.
- Place this downloaded file inside the `model` folder of this project.

### 2. Backend Setup

You need Python installed on your system. We recommend creating a virtual environment.

1. Navigate to the project root directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   pip install fastapi uvicorn python-multipart
   ```
4. Start the FastAPI server:
   ```bash
   cd src
   uvicorn app:app --reload
   ```

### 3. Frontend Setup

You need Node.js installed on your system.

1. Open a new terminal and navigate to the `Frontend` directory.
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

Now, open your browser and navigate to the local URL provided by Vite to interact with the application.
