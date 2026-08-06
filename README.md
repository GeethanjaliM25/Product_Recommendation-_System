# IntelliRecommend Pro

Build a complete, production-ready, AI-powered full-stack web application called **"AI Product Recommendation System"**. The application should recommend products to customers based on their purchase history using my trained Deep Learning model and provide a modern, premium user experience.

## Tech Stack

Frontend:

- React + TypeScript

- Tailwind CSS

- Shadcn UI

- Framer Motion

- Recharts

- Lucide React Icons

Backend:

- Python Flask REST API

Database:

- SQLite (for user authentication and prediction history)

AI Models (I will upload later):

- recommendation_ann.keras

- customer_encoder.pkl

- product_encoder.pkl

The backend should automatically load these files and use them for prediction.

====================================================

THEME

====================================================

Design the application like a premium SaaS AI platform inspired by Stripe, Vercel, Microsoft Copilot and Notion AI.

Use

- Glassmorphism

- Purple + Blue gradient

- White glass cards

- Rounded corners

- Soft shadows

- Smooth hover animations

- Fully responsive

- Modern typography

- Professional icons

- Dark/Light mode

====================================================

AUTHENTICATION

====================================================

Create a secure authentication system.

Pages:

• Login

- Email

- Password

- Remember Me

- Forgot Password

- Login Button

- Google Login (UI only)

• Register

- Full Name

- Email

- Phone Number

- Password

- Confirm Password

- Password Strength Indicator

- Register Button

Store users in SQLite.

====================================================

LANDING PAGE

====================================================

Hero Section

Title

AI Product Recommendation System

Subtitle

Recommend products intelligently using customer purchase history and Artificial Neural Networks.

Buttons

- Get Started

- Login

- Explore Dashboard

Feature Cards

- AI Product Recommendation

- Customer Purchase Analysis

- Deep Learning Prediction

- Real-Time Analytics

- Interactive Dashboard

- Smart Recommendation Engine

Include an About Project section explaining the workflow.

====================================================

SIDEBAR

====================================================

Professional collapsible sidebar.

Dashboard

Recommend Products

Customer History

Analytics

Popular Products

Reports

Model Information

Profile

Settings

Logout

====================================================

DASHBOARD

====================================================

Top Summary Cards

Total Customers

Total Products

Total Recommendations

Average Purchase Amount

Most Popular Product

Model Accuracy

Latest Recommendation

Recent Activity

Charts

Monthly Recommendations

Popular Products

Customer Purchase Frequency

Customer Segments

Recommendation Distribution

Recent Recommendation Timeline

====================================================

RECOMMEND PRODUCT PAGE

====================================================

This is the main page.

User enters:

Customer ID

Click:

Recommend Products

Backend should

Load customer_encoder.pkl

Encode customer

Load recommendation_ann.keras

Predict top products

Decode products using product_encoder.pkl

Display:

Customer Information

Customer ID

Purchase Summary

Purchase History

Previously Purchased Products

Recommended Products

Show recommendations as beautiful cards.

Each card contains

Product Image Placeholder

Product Name

Product Code

Recommendation Score

Confidence Percentage

Reason

"Recommended because customers with similar purchase history also bought this product."

Buttons

View Product

Save Recommendation

Download Recommendation

====================================================

CUSTOMER HISTORY

====================================================

Display

Customer Details

Purchase Timeline

Invoice History

Previously Purchased Products

Search

Filter

Pagination

====================================================

POPULAR PRODUCTS

====================================================

Display

Trending Products

Most Purchased Products

Frequently Bought Together

Top Rated Products

New Arrivals

Each product card should contain

Product Image

Product Name

Popularity Score

Recommendation Count

====================================================

ANALYTICS

====================================================

Professional Analytics Dashboard.

Include

Bar Chart

Top Recommended Products

Line Chart

Recommendation Trend

Pie Chart

Customer Categories

Area Chart

Purchase Behaviour

Scatter Plot

Customer vs Purchase Amount

Radar Chart

Product Performance

Heatmap

Customer Activity

====================================================

MODEL INFORMATION

====================================================

Display

Model Name

Artificial Neural Network

Problem Type

Recommendation System

Architecture

Neural Collaborative Filtering

Optimizer

Adam

Loss Function

Binary Crossentropy

Activation

ReLU

Output Activation

Sigmoid

Hyperparameter Tuning

Early Stopping

Epochs

Batch Size

Training Accuracy

Model Summary

====================================================

REPORTS

====================================================

Generate downloadable reports.

Include

Customer Details

Recommended Products

Confidence Scores

Graphs

Date

Export PDF

Export CSV

Print Report

====================================================

PROFILE

====================================================

Profile Photo

Full Name

Email

Phone Number

Change Password

Account Settings

====================================================

SETTINGS

====================================================

Dark Mode

Light Mode

Theme Selection

Notification Toggle

====================================================

BACKEND API

====================================================

Create Flask APIs.

POST /login

POST /register

POST /recommend

GET /history

GET /analytics

GET /popular-products

POST /download-report

Recommendation Flow

Receive Customer ID

Encode Customer

Load recommendation_ann.keras

Predict Top Products

Decode Product IDs

Return JSON Response

====================================================

LOADING SCREEN

====================================================

Professional AI loading animation.

Messages

Loading Customer Profile...

Analyzing Purchase History...

Running Deep Learning Model...

Finding Similar Products...

Generating Recommendations...

====================================================

SUCCESS PAGE

====================================================

Recommendation Generated Successfully

Show

Top Recommended Products

Confidence Score

Recommendation Time

====================================================

ERROR HANDLING

====================================================

Handle

Invalid Customer ID

Unknown Customer

Model Not Loaded

Prediction Failed

Display modern error pages.

====================================================

FOOTER

====================================================

Developed by Geethanjali

Artificial Intelligence & Machine Learning

GitHub

LinkedIn

Contact

====================================================

PROJECT STRUCTURE

====================================================

Generate the complete project with

Frontend

Backend

Flask APIs

React Components

Pages

Authentication

Protected Routes

SQLite Database

Folder Structure

app.py

requirements.txt

package.json

tailwind.config.js

README.md

====================================================

FINAL REQUIREMENT

====================================================

The application should look like a real AI SaaS product, not a college project. It must be clean, premium, modern, fully responsive, production-ready, easy to navigate, and directly runnable after I upload my trained ANN model and encoder files. Use realistic sample data, smooth animations, professional charts, and a polished UI throughout the application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://intelligent-recommendations.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4863fe7f-153c-42a5-9f19-6d0f4f9d399d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
