[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/WYoWnrCf)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=22914645&assignment_repo_type=AssignmentRepo)
Realtime Collaborative Whiteboard Assignment
---

**Objective**
In this assignment, you will build a realtime collaborative whiteboard application using **Socket.IO**. The application will consist of:

- A **backend Socket.IO server** to manage connections, maintain the board state, and broadcast updates.
- A **browser-based Socket.IO client** that connects to the server, listens for updates, and sends any changes made by the user.
- A **whiteboard implemented using an HTML `<canvas>` element**, where users can draw with a selected color and clear the board when needed.

The goal is for multiple users to connect and collaborate in real time. Any updates should be broadcast to all connected clients so they always see the same board state.

---

**Setup Instructions**

You are provided with the HTML, CSS, server implementation, and Vite configuration. Your task is to complete the client-side JavaScript to implement the drawing functionality.

1. Open the GitHub classroom assignment in a VS Code dev container.
2. **Install dependencies**:
   ```sh
   socket.io socket.io-client
   ```
   and dev dependencies:
   ```sh
   vite concurrently
   ```
3. **Set up the package.json scripts:**
   ```json
   "scripts": {
     "dev": "vite --host",
     "build": "vite build",
     "server": "node server.js",
     "start": "concurrently \"npm run server\" \"npm run dev\"",
     "setup": "mkdir -p public/js && cp ./node_modules/socket.io-client/dist/socket.io.js public/js/socket.io.js"
   }
   ```
4. **Set up the Socket.IO client:**
   The Socket.IO client library is required for the client-side JavaScript to communicate with the server. Run the following command to copy the library to the public directory:
   ```sh
   npm run setup
   ```
5. **To run the application:**
   ```sh
   npm start
   ```
   This will start both the Socket.IO server and the Vite dev server.

6. **To test:**
   Open the URL provided by the Vite dev server in multiple browser tabs or windows to simulate different clients.

---

**Assignment Requirements**

Your task is to implement the client-side JavaScript functionality to complete the realtime collaborative whiteboard. Specifically, you need to:

1. **Complete the `client.js` file** by filling in all the TODO sections to:
   - Initialize the canvas dimensions
   - Handle window resizing
   - Connect to the Socket.IO server
   - Implement event listeners for Socket.IO events
   - Implement mouse and touch event handlers (touch events are optional)
   - Create drawing functions
   - Implement the clear board functionality

2. **Ensure the whiteboard enables real-time collaboration** such that:
   - Drawing actions are sent to the server and broadcast to all clients
   - New clients receive the current board state when they connect
   - The board clear action affects all connected clients
   - The user count is displayed and updated when users connect or disconnect

---

**Hints**

1. **Canvas Context:** The 2D context (`getContext('2d')`) provides methods for drawing on the canvas. Use `beginPath()`, `moveTo()`, `lineTo()`, and `stroke()` for drawing lines.

2. **Socket.IO Events:** Remember that Socket.IO is event-based. When you receive an event from the server, it means another client or action has occurred, and you should update your canvas accordingly.

3. **Drawing Approach:** The assignment requires that clients only draw when receiving events from the server, not immediately on user interaction. This ensures all clients stay in sync.

4. **Touch Events:** To support touch devices, you need to handle touch events differently than mouse events. The `getCoordinates()` function helps normalize this.

5. **Synchronization:** Pay attention to how the server maintains the board state and sends it to new clients. Your client should be able to reconstruct the entire drawing from this state.

6. **Testing:** Test your implementation with multiple browser tabs/windows to ensure real-time collaboration works correctly.

---

**Submission Instructions**

1. Push your completed code to GitHub classroom.
2. Ensure that your implementation meets the assignment requirements.

---

**Assessment Criteria**
Your implementation will be assessed based on:
- Correctness: Does your whiteboard function as a real-time collaborative tool?
- Completeness: Have you implemented all the required client-side functionality?
- Code Quality: Is your code well-structured and readable?
- Functionality: Do all features work as intended, including drawing, color selection, and board clearing?
- Real-Time Behavior: Does the whiteboard update in sync for all connected clients?