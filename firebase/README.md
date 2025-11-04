# Firebase Project

This project is a simple application that integrates Firebase for backend services. Below are the instructions for setting up and running the project.

## Prerequisites

- Node.js (version 12 or later)
- npm (Node package manager)
- A Firebase account

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd firebase-project
   ```

2. **Install dependencies:**
   Run the following command to install the required npm packages:
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Create a `.env` file in the root of the project and add your Firebase configuration details:
   ```
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id
   ```

4. **Run the application:**
   Use the following command to start the application:
   ```bash
   npm start
   ```

## Usage

Once the application is running, you can access it in your web browser. The application will initialize Firebase using the configuration provided in the `.env` file.

## License

This project is licensed under the MIT License.