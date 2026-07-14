# Flask Web Application

A small web application built with Flask and SQLite to practice fullstack development, routing, templates, and database queries.

## Features
- User registration and authentication
- Create, edit, and delete anime entries
- Personal user libraries
- MyAnimeList/Jikan autocomplete integration
- Image and metadata storage
- AJAX-powered UI updates
- Search suggestions with keyboard navigation
- Server-side caching
- Protected API routes and ownership validation
- Deployed on [Render](https://flask-project-s5o6.onrender.com)

## Tech Stack
- Python
- Flask
- SQLite
- JavaScript (Fetch API)
- Bootstrap 5
- Jinja2
- Flask-Caching
- Jikan API

## What I learned
- Organizing a Flask project
- Connecting a web app to a SQLite database
- Handling requests and rendering dynamic content
- Emphasized importance of naming and language conventions
- Caching
- Working with external APIs

## Running the project
1. Create and activate a virtual environment
2. Install dependencies from `requirements.txt`
3. Create .env file at project directory and define:

   YOUTUBE_API_KEY

   APP_SECRET_KEY

4. Initialize db and run:

   To run:
   `
   flask --app dweb run --debug --port 8000
   `
   On /flask-project
   
   `
   nmp run dev
   `
   On /frontend

   To clear and initialize the db:
   `
   flask --app dweb clear-db
   `
   