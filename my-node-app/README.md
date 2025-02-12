# My Node.js Application

This is a simple Node.js application that features a navbar and a blank content area. It is built using Express.js and serves static files.

## Project Structure

```
my-node-app
├── src
│   ├── app.js          # Entry point of the application
│   ├── views
│   │   ├── index.html  # Main HTML page with navbar
│   └── public
│       ├── css
│       │   └── styles.css # CSS styles for the application
├── package.json        # npm configuration file
├── .gitignore          # Files and directories to ignore by Git
└── README.md           # Documentation for the project
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-node-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

### Running the Application

To start the application, run the following command:
```
node src/app.js
```

The application will be running on `http://localhost:3000`.

### License

This project is licensed under the MIT License.