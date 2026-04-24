//Contibution by Hiya:
//game logic

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";
import styled from "styled-components";
import Cell from "@/components/Cell";

//table may go out of scope due to size
//prof said this is okay as long as the other elements do not
const GameContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f0f0;
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: #333;
  letter-spacing: -2px;
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

//hourglass icon
const ClockIcon = styled.span`
  font-size: 1.2rem;
  &::before {
    content: "\u231B"; 
    margin-right: 4px;
  }
`;

const TimerText = styled.span`
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  min-width: 40px;
`;

//to choose easy med or hard
const DifficultyBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const NavButton = styled.button<{ $active?: boolean }>`
  padding: 10px 20px;
  font-weight: bold;
  border: 2px solid #333;
  cursor: pointer;
  background-color: ${props => props.$active ? '#333' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  &:hover { background-color: #555; color: white; }
`;

const BoardWrapper = styled.div`
  background-color: #bdbdbd;
  padding: 15px;
  border: 6px inset #eeeeee;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const BoardGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$cols}, 40px);
  gap: 1px;
  background-color: #7b7b7b;
  border: 2px solid #7b7b7b;
`;

const StatusMessage = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

// typical dimensions/num of mines
const CONFIG: { [key: string]: { rows: number; cols: number; mines: number } } = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

//randomization based on seed
const seededRandom = (seed: number) => { //seed is date
  return function() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
};

export default function DailyGamePage() {
  const { data: session } = useSession();
  const [difficulty, setDifficulty] = useState('easy');
  const [grid, setGrid] = useState<any[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  //timer stops when game ends(win or loss)
  useEffect(() => {
    let interval: any;
    if (timerActive && !gameOver && !hasWon) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, hasWon]);

  const submitGameResult = async (won: boolean) => {
    if (!session?.user?.email) return;

    //send info to stats page
    const payload = {
      userId: session.user.email, //must be unique because of auth, so it works as a unique id
      username: session.user.name, 
      avatar: session.user.image, //if we implement pfp
      difficulty: difficulty, //must send difficulty to correctly record games played, etc. 
      time: seconds,
      won: won
    };

    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    console.log("Result:", text);
  };

  // recursive reveal
  const revealCell = (currentGrid: any[][], r: number, c: number) => {
    const { rows, cols } = CONFIG[difficulty];
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (currentGrid[r][c].isRevealed || currentGrid[r][c].isFlagged) return;

    currentGrid[r][c].isRevealed = true;

    if (currentGrid[r][c].adjacent === 0 && !currentGrid[r][c].isBomb) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealCell(currentGrid, r + i, c + j);
        }
      }
    }
  };

  // board generation
  const generateBoard = useCallback(() => {
    const { rows, cols, mines } = CONFIG[difficulty];
    let newGrid = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => ({
        isBomb: false, isRevealed: false, isFlagged: false, adjacent: 0, row: r, col: c,
      }))
    );

    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const rng = seededRandom(parseInt(dateStr));
    
    //mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const r = Math.floor(rng() * rows), c = Math.floor(rng() * cols);
      if (!newGrid[r][c].isBomb) { newGrid[r][c].isBomb = true; minesPlaced++; }
    }

    //indicator numbers
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isBomb) continue;
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const nr = r + i, nc = c + j;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newGrid[nr][nc].isBomb) count++;
          }
        }
        newGrid[r][c].adjacent = count;
      }
    }

    // auto-reveal starter area
    let found = false;
    for (let r = 0; r < rows && !found; r++) {
      for (let c = 0; c < cols && !found; c++) {
        if (newGrid[r][c].adjacent === 0 && !newGrid[r][c].isBomb) {
          revealCell(newGrid, r, c);
          found = true;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setHasWon(false);
    setSeconds(0);
    setTimerActive(true);
  }, [difficulty]);

  useEffect(() => { generateBoard(); }, [generateBoard]);

  const handleReveal = (r: number, c: number) => {
    if (gameOver || hasWon || grid[r][c].isFlagged) return;

    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    
    if (newGrid[r][c].isBomb) {
      newGrid.forEach(row => row.forEach(cell => { if (cell.isBomb) cell.isRevealed = true; }));
      setGrid(newGrid);
      setGameOver(true);
      setTimerActive(false);
      submitGameResult(false); //send loss
      return;
    }

    revealCell(newGrid, r, c);
    setGrid(newGrid);
    
    const { rows, cols, mines } = CONFIG[difficulty];
    const revealedCount = newGrid.flat().filter(cell => cell.isRevealed).length;
    if (revealedCount === (rows * cols) - mines) {
      setHasWon(true);
      setTimerActive(false);
      submitGameResult(true); //send win
    }
  };

  const handleFlag = (r: number, c: number) => {
    if (gameOver || hasWon || grid[r][c].isRevealed) return;
    const newGrid = grid.map(row => row.map(cell => ({...cell})));
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
  };

  return (
    <GameContainer>
      <Title>DAILY MINES</Title>
      
      <TimerContainer>
        <ClockIcon aria-label="clock" />
        <TimerText>{seconds}s</TimerText>
    </TimerContainer>

      <DifficultyBar>
        {Object.keys(CONFIG).map((level) => (
          <NavButton 
            key={level} 
            $active={difficulty === level}
            onClick={() => setDifficulty(level)}
          >
            {level.toUpperCase()}
          </NavButton>
        ))}
      </DifficultyBar>

      <BoardWrapper>
        <BoardGrid $cols={CONFIG[difficulty].cols}>
          {grid.map((row, r) => 
            row.map((cell, c) => (
              <Cell 
                key={`${r}-${c}`}
                {...cell}
                onReveal={() => handleReveal(r, c)}
                onFlag={() => handleFlag(r, c)}
              />
            ))
          )}
        </BoardGrid>
      </BoardWrapper>

      <StatusMessage>
        {gameOver && <h2 style={{color: 'red'}}>KABOOM!</h2>}
        {hasWon && <h2 style={{color: 'green'}}>VICTORY!</h2>}
        <p>Logged in as: {session?.user?.name || "Guest"}</p>
      </StatusMessage>
    </GameContainer>
  );
}