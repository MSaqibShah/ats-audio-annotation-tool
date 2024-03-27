# ATS Audio Annotation Tool

The ATS Audio Annotation Tool is designed to facilitate the annotation of audio data with features such as transcription, gender recognition of the voice, intent, emotion, and response categorization. This project is built using the MERN stack, leveraging MongoDB, Express.js, React, and Node.js to deliver a comprehensive and user-friendly audio annotation platform.

## Features

- **Audio Transcription:** Convert spoken language into text.
- **Gender Recognition:** Identify the gender of the speaker.
- **Intent Analysis:** Determine the intent behind spoken words.
- **Emotion Detection:** Identify emotions conveyed in the audio.
- **Response Categorization:** Categorize the type of response or action needed.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18.x)
- MongoDB (Local installation or cloud-based solution like MongoDB Atlas)
- Yarn or npm (Package manager)

### Installation

1. Clone the repository to your local machine:

```bash
git clone https://github.com/MSaqibShah/ats-audio-annotation-tool.git
cd ats-audio-annotation-tool
```

2. Install the dependencies for the backend:

```bash
cd backend
npm install
```

3. Install the dependencies for the frontend:

```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory and fill in your MongoDB URI and any other environment variables you need.

Example `.env` file:

```plaintext
NODE_ENV=dev

MONGO_DB_URI_DEV=mongodb://localhost/ats_tool
BACKEND_PORT_DEV=5000
BACKEND_URL_DEV=http://localhost
FRONTEND_PORT_DEV=3000
FRONTEND_URL_DEV=http://localhost


MONGO_DB_URI_PROD=mongodb://localhost/ats_tool
BACKEND_PORT_PROD=5000
BACKEND_URL_PROD=http://localhost
FRONTEND_PORT_PROD=3000
FRONTEND_URL_PROD=http://localhost
```

5. Start the backend server:

```bash
npm start
```

6. In a new terminal, start the frontend application:

```bash
cd ../frontend
npm start
```

The React application should now be running on `http://localhost:3000`, and your backend should be on `http://localhost:5000`.

## Usage

To begin annotating audio files, navigate to `http://localhost:3000` in your web browser. Here, you can fetch audios, view transcriptions, and annotate each file with the gender of the voice, intent, emotion, and response.
