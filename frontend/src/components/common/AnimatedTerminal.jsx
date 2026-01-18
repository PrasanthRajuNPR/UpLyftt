import React, { useState, useEffect } from 'react';

const codeSnippets = [
  {
    lines: [
      '// Building with React',
      'import React from "react";',
      '',
      'function App() {',
      '  return (',
      '    <div className="app">',
      '      <h1>Hello World!</h1>',
      '    </div>',
      '  );',
      '}',
    ],
    colors: [
      'text-purple-400',
      'text-cyan-400',
      'text-gray-500',
      'text-blue-400',
      'text-yellow-400',
      'text-gray-300',
      'text-green-400',
      'text-gray-300',
      'text-gray-300',
      'text-gray-300',
    ],
  },
  {
    lines: [
      '# Python Data Science',
      'import pandas as pd',
      'import numpy as np',
      '',
      'data = pd.read_csv("data.csv")',
      'result = data.groupby("category")',
      'print(result.mean())',
    ],
    colors: [
      'text-green-400',
      'text-cyan-400',
      'text-cyan-400',
      'text-gray-500',
      'text-yellow-400',
      'text-yellow-400',
      'text-purple-400',
    ],
  },
  {
    lines: [
      '// Node.js Backend',
      'const express = require("express");',
      'const app = express();',
      '',
      'app.get("/api/data", (req, res) => {',
      '  res.json({ success: true });',
      '});',
      '',
      'app.listen(3000);',
    ],
    colors: [
      'text-purple-400',
      'text-cyan-400',
      'text-yellow-400',
      'text-gray-500',
      'text-blue-400',
      'text-green-400',
      'text-gray-300',
      'text-gray-500',
      'text-yellow-400',
    ],
  },
];

export function AnimatedTerminal() {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const currentSnippet = codeSnippets[snippetIndex];

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Typing animation
  useEffect(() => {
    // Finished all lines → switch snippet
    if (currentLineIndex >= currentSnippet.lines.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
        setSnippetIndex((prev) => (prev + 1) % codeSnippets.length);
      }, 3000);

      return () => clearTimeout(timeout);
    }

    const currentLine = currentSnippet.lines[currentLineIndex];

    // Typing characters
    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, 50);

      return () => clearTimeout(timeout);
    } 
    // Move to next line
    else {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, currentLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [
    currentLineIndex,
    currentCharIndex,
    currentSnippet,
    displayedLines,
  ]);

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-6 shadow-2xl shadow-cyan-500/20 overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-4 text-sm text-gray-500">terminal</span>
      </div>

      {/* Code area */}
      <div className="font-mono text-sm space-y-1 h-64 overflow-hidden">
        {displayedLines.map((line, index) => (
          <div key={index} className={currentSnippet.colors[index]}>
            {line || '\u00A0'}
          </div>
        ))}

        {currentLineIndex < currentSnippet.lines.length && (
          <div className={currentSnippet.colors[currentLineIndex]}>
            {currentSnippet.lines[currentLineIndex].substring(
              0,
              currentCharIndex
            )}
            <span
              className={`${
                showCursor ? 'opacity-100' : 'opacity-0'
              } transition-opacity`}
            >
              |
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
