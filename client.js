document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  const colorInput = document.getElementById('color-input');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeDisplay = document.getElementById('brush-size-display');
  const clearButton = document.getElementById('clear-button');
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');

  function resizeCanvas() {
    // set canvas size to match its parent container
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    // redraw everything after resize so we don't lose the board
    redrawCanvas(currentBoardState);
  }

  // keep track of board state so we can redraw on resize
  let currentBoardState = [];

  // initialize canvas size
  resizeCanvas();

  // handle window resize
  window.addEventListener('resize', resizeCanvas);

  // drawing variables
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // connect to the socket.io server
  const socket = io('http://localhost:3000');

  // socket.io event handlers
  socket.on('connect', () => {
    connectionStatus.textContent = 'Connected';
  });

  socket.on('disconnect', () => {
    connectionStatus.textContent = 'Disconnected';
  });

  // server sends current board state when we first connect
  socket.on('boardState', (boardState) => {
    currentBoardState = boardState;
    redrawCanvas(currentBoardState);
  });

  // when another client draws, we draw it on our canvas too
  socket.on('draw', (drawData) => {
    currentBoardState.push(drawData);
    drawLine(drawData.x0, drawData.y0, drawData.x1, drawData.y1, drawData.color, drawData.size);
  });

  // when the board is cleared
  socket.on('clear', () => {
    currentBoardState = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  // update the user count display
  socket.on('currentUsers', (count) => {
    userCount.textContent = count;
  });

  // mouse event listeners
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // touch event listeners (optional)
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', stopDrawing);
  canvas.addEventListener('touchcancel', stopDrawing);

  // clear button
  clearButton.addEventListener('click', clearCanvas);

  // update brush size display when slider changes
  brushSizeInput.addEventListener('input', () => {
    brushSizeDisplay.textContent = brushSizeInput.value;
  });

  function startDrawing(e) {
    isDrawing = true;
    const coords = getCoordinates(e);
    lastX = coords.x;
    lastY = coords.y;
  }

  function draw(e) {
    if (!isDrawing) return;

    const coords = getCoordinates(e);

    // send the draw event to the server instead of drawing directly
    // the server will broadcast it back to all clients including us
    socket.emit('draw', {
      x0: lastX,
      y0: lastY,
      x1: coords.x,
      y1: coords.y,
      color: colorInput.value,
      size: brushSizeInput.value
    });

    lastX = coords.x;
    lastY = coords.y;
  }

  function drawLine(x0, y0, x1, y1, color, size) {
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = 'round';
    context.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
  }

  function clearCanvas() {
    // tell the server to clear, it will broadcast to everyone
    socket.emit('clear');
  }

  function redrawCanvas(boardState = []) {
    // clear the canvas first
    context.clearRect(0, 0, canvas.width, canvas.height);

    // redraw each line from the board state
    boardState.forEach(drawData => {
      drawLine(drawData.x0, drawData.y0, drawData.x1, drawData.y1, drawData.color, drawData.size);
    });
  }

  function getCoordinates(e) {
    // handle both touch and mouse events
    if (e.type.includes('touch')) {
      const touch = e.touches[0] || e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  function handleTouchStart(e) {
    e.preventDefault();
    startDrawing(e);
  }

  function handleTouchMove(e) {
    e.preventDefault();
    draw(e);
  }

});