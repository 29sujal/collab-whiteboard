import React, { useRef, useEffect, useState } from 'react';
import socket from './socket';

const Whiteboard = ({ user }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);

  const [users, setUsers] = useState([]);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [paths, setPaths] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', user);

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 60;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctxRef.current = ctx;

    socket.on('draw', (line) => {
      drawLine(line.px, line.py, line.x, line.y, line.color, line.size);
    });

    socket.on('clear', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    socket.on('userList', (list) => {
      setUsers(list);
    });
  }, [user]);

  const startDrawing = ({ nativeEvent }) => {
    isDrawing.current = true;
    const { offsetX, offsetY } = nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    ctxRef.current.prevX = offsetX;
    ctxRef.current.prevY = offsetY;
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = nativeEvent;
    const line = {
      px: ctxRef.current.prevX,
      py: ctxRef.current.prevY,
      x: offsetX,
      y: offsetY,
      color,
      size,
    };

    drawLine(line.px, line.py, line.x, line.y, line.color, line.size);
    setPaths(prev => [...prev, line]);
    setRedoStack([]);
    socket.emit('draw', line);

    ctxRef.current.prevX = offsetX;
    ctxRef.current.prevY = offsetY;
  };

  const endDrawing = () => {
    isDrawing.current = false;
  };

  const drawLine = (x1, y1, x2, y2, strokeColor, strokeSize) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeSize;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  const clearCanvas = () => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPaths([]);
    setRedoStack([]);
    socket.emit('clear');
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.fillStyle = '#ffffff';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `whiteboard-${user.room}.png`;
    link.href = exportCanvas.toDataURL();
    link.click();
  };

  const redraw = (lines) => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    lines.forEach(line => {
      drawLine(line.px, line.py, line.x, line.y, line.color, line.size);
    });
  };

  const undo = () => {
    if (paths.length === 0) return;
    const newPaths = [...paths];
    const popped = newPaths.pop();
    setPaths(newPaths);
    setRedoStack(prev => [...prev, popped]);
    redraw(newPaths);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const last = redoStack[redoStack.length - 1];
    const newRedo = [...redoStack];
    newRedo.pop();
    const newPaths = [...paths, last];
    setPaths(newPaths);
    setRedoStack(newRedo);
    redraw(newPaths);
  };

  return (
    <div className="w-full h-full">
      {/* Toolbar */}
      <div className="p-2 flex flex-wrap gap-2 justify-between items-center bg-white shadow-md">
        <div className="flex gap-3 items-center">
          <span className="font-semibold">Room: {user.room}</span>
          <span className="font-medium">You: {user.username}</span>
          <span className="font-medium">Connected: {users.length}</span>
        </div>

        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="w-8 h-8 border"
            title="Pick Color"
          />

          <select
            value={size}
            onChange={e => setSize(Number(e.target.value))}
            className="border px-2 py-1"
            title="Brush Size"
          >
            {[2, 4, 6, 8, 10, 12].map(s => (
              <option key={s} value={s}>{s}px</option>
            ))}
          </select>

          <button onClick={undo} className="bg-yellow-500 text-white px-3 py-1 rounded">Undo</button>
          <button onClick={redo} className="bg-indigo-500 text-white px-3 py-1 rounded">Redo</button>
          <button onClick={clearCanvas} className="bg-red-500 text-white px-3 py-1 rounded">Clear</button>
          <button onClick={exportCanvas} className="bg-green-500 text-white px-3 py-1 rounded">Export</button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        className="border-t w-full h-[calc(100vh-60px)] bg-white"
      />
    </div>
  );
};

export default Whiteboard;
