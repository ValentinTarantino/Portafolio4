import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteDoc, doc, getDoc, onSnapshot, runTransaction, serverTimestamp, setDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import './TicTacToe.css';

/* ── Pure game logic ───────────────────────────────────── */

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const checkWinner = (board) => {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
};

const isDraw = (board) => board.every((cell) => cell !== null);

const validMoves = (board) => {
  const moves = [];
  for (let i = 0; i < 9; i += 1) if (!board[i]) moves.push(i);
  return moves;
};

const other = (mark) => (mark === 'X' ? 'O' : 'X');

/* Minimax with alpha-beta pruning. Returns the best score for `player`
   assuming optimal play from both sides. */
const minimax = (board, player, target, alpha, beta) => {
  const result = checkWinner(board);
  if (result) return result.winner === target ? 10 : -10;
  if (isDraw(board)) return 0;

  const maximizing = player === target;
  let best = maximizing ? -Infinity : Infinity;

  for (const move of validMoves(board)) {
    board[move] = player;
    const score = minimax(board, other(player), target, alpha, beta);
    board[move] = null;

    if (maximizing) {
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, score);
    }
    if (beta <= alpha) break;
  }
  return best;
};

const findWinningMove = (board, mark) => {
  for (const move of validMoves(board)) {
    board[move] = mark;
    const result = checkWinner(board);
    board[move] = null;
    if (result && result.winner === mark) return move;
  }
  return -1;
};

const findBlockingMove = (board, mark) => findWinningMove(board, other(mark));

const aiMove = (board, difficulty, aiMark) => {
  const moves = validMoves(board);
  if (moves.length === 0) return -1;

  if (difficulty === 'easy') {
    // 30 % chance of a random move even when a better one exists.
    if (Math.random() < 0.3) return moves[Math.floor(Math.random() * moves.length)];
    const win = findWinningMove(board, aiMark);
    if (win >= 0) return win;
    const block = findBlockingMove(board, aiMark);
    if (block >= 0 && Math.random() > 0.4) return block;
    return moves[Math.floor(Math.random() * moves.length)];
  }

  if (difficulty === 'normal') {
    // Empty board: pick randomly between center and a corner.
    if (moves.length === 9) {
      const openings = [4, 0, 2, 6, 8];
      return openings[Math.floor(Math.random() * openings.length)];
    }
    const win = findWinningMove(board, aiMark);
    if (win >= 0) return win;
    const block = findBlockingMove(board, aiMark);
    if (block >= 0) return block;
    if (!board[4]) return 4;
    const corners = [0, 2, 6, 8].filter((i) => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // hard — perfect minimax play, random among equally good moves
  if (moves.length === 9) {
    const openings = [4, 0, 2, 6, 8];
    return openings[Math.floor(Math.random() * openings.length)];
  }
  const work = [...board];
  let bestScore = -Infinity;
  let bestMoves = [];
  for (const move of moves) {
    work[move] = aiMark;
    const score = minimax(work, other(aiMark), aiMark, -Infinity, Infinity);
    work[move] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
};

/* ── Online helpers ────────────────────────────────────── */

const ROOM_COLLECTION = 'ttt_rooms';

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

const getPlayerId = () => {
  try {
    let id = sessionStorage.getItem('ttt-player-id');
    if (!id) {
      id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem('ttt-player-id', id);
    }
    return id;
  } catch {
    return `anon-${Date.now()}`;
  }
};

const prefersReducedMotion = () => (
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

/* ── Component ─────────────────────────────────────────── */

const TicTacToe = ({ t, onExit }) => {
  const copy = t.capabilities.ttt;
  const [view, setView] = useState('menu'); // menu | local | ai | online
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [winner, setWinner] = useState(null); // null | 'X' | 'O' | 'draw'
  const [winningLine, setWinningLine] = useState(null);

  // Local / AI
  const [mySymbol, setMySymbol] = useState(null); // 'X' | 'O'
  const [symbolPicked, setSymbolPicked] = useState(false);
  const [aiDifficulty, setAiDifficulty] = useState('normal');
  const [aiThinking, setAiThinking] = useState(false);
  const aiTimerRef = useRef(null);

  // Online
  const [onlinePhase, setOnlinePhase] = useState('lobby'); // lobby | waiting | playing
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [onlineSymbol, setOnlineSymbol] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(null); // key of t.capabilities.ttt
  const [onlineError, setOnlineError] = useState(false);
  const [opponentConnected, setOpponentConnected] = useState(true);
  const [rematchRequested, setRematchRequested] = useState([]); // ['X'] | ['O'] | ['X','O']
  const [copied, setCopied] = useState(false);
  const roomUnsubRef = useRef(null);
  const playerIdRef = useRef(null);
  const roomCodeRef = useRef('');
  const onlinePhaseRef = useRef('lobby');

  if (!playerIdRef.current) playerIdRef.current = getPlayerId();
  roomCodeRef.current = roomCode;
  onlinePhaseRef.current = onlinePhase;

  /* ── Reset helpers ─────────────────────────────────── */

  // Leaving the room always deletes it so the opponent is kicked out.
  const leaveRoom = useCallback(() => {
    const code = roomCodeRef.current;
    if (roomUnsubRef.current) {
      roomUnsubRef.current();
      roomUnsubRef.current = null;
    }
    if (code) deleteDoc(doc(db, ROOM_COLLECTION, code)).catch(() => {});
  }, []);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentTurn('X');
    setWinner(null);
    setWinningLine(null);
    setAiThinking(false);
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
  }, []);

  const goToMenu = useCallback(() => {
    leaveRoom();
    resetGame();
    setView('menu');
    setSymbolPicked(false);
    setMySymbol(null);
    setOnlinePhase('lobby');
    setOnlineStatus(null);
    setOnlineError(false);
    setRoomCode('');
    setJoinCode('');
    setOnlineSymbol(null);
    setOpponentConnected(true);
    setRematchRequested([]);
  }, [leaveRoom, resetGame]);

  /* ── Core move handler (shared by local / ai) ──────── */

  const applyMove = useCallback((index, mark) => {
    setBoard((prev) => {
      if (prev[index] || winner) return prev;
      const next = [...prev];
      next[index] = mark;
      const result = checkWinner(next);
      if (result) {
        setWinner(result.winner);
        setWinningLine(result.line);
      } else if (isDraw(next)) {
        setWinner('draw');
      } else {
        setCurrentTurn(other(mark));
      }
      return next;
    });
  }, [winner]);

  /* ── AI turn effect ────────────────────────────────── */

  useEffect(() => {
    if (view !== 'ai' || !mySymbol || winner) return undefined;
    if (currentTurn === mySymbol) return undefined; // human's turn

    setAiThinking(true);
    const delay = prefersReducedMotion() ? 0 : 420;
    aiTimerRef.current = setTimeout(() => {
      setBoard((prev) => {
        const move = aiMove(prev, aiDifficulty, other(mySymbol));
        if (move < 0) return prev;
        const next = [...prev];
        next[move] = other(mySymbol);
        const result = checkWinner(next);
        if (result) {
          setWinner(result.winner);
          setWinningLine(result.line);
        } else if (isDraw(next)) {
          setWinner('draw');
        } else {
          setCurrentTurn(mySymbol);
        }
        return next;
      });
      setAiThinking(false);
    }, delay);

    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    };
    // aiThinking is intentionally excluded: including it would re-run the
    // effect after setAiThinking(true), and the cleanup would cancel the
    // timeout before it fires, freezing the AI forever.
  }, [view, mySymbol, currentTurn, winner, aiDifficulty]);

  /* ── Online: Firestore helpers ─────────────────────── */

  const subscribeToRoom = useCallback((code) => {
    if (roomUnsubRef.current) roomUnsubRef.current();
    const ref = doc(db, ROOM_COLLECTION, code);
    roomUnsubRef.current = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        const wasInRoom = onlinePhaseRef.current !== 'lobby';
        setOnlineStatus(wasInRoom ? 'opponentLeft' : 'roomNotFound');
        setOnlineError(false);
        setOnlinePhase('lobby');
        setRoomCode('');
        setRematchRequested([]);
        if (roomUnsubRef.current) {
          roomUnsubRef.current();
          roomUnsubRef.current = null;
        }
        return;
      }
      const data = snap.data();
      setBoard(data.board || Array(9).fill(null));
      setCurrentTurn(data.currentTurn || 'X');
      if (data.status === 'finished') {
        if (data.winner === 'draw') setWinner('draw');
        else setWinner(data.winner);
        setWinningLine(data.winningLine || null);
      } else {
        setWinner(null);
        setWinningLine(null);
      }

      // Determine my symbol from room data (robust against stale closures).
      const players = data.players || {};
      const myId = playerIdRef.current;
      const myMark = players.X?.id === myId ? 'X' : players.O?.id === myId ? 'O' : null;
      const oppData = myMark === 'X' ? players.O : players.X;
      const oppId = oppData?.id;
      const oppConnected = Boolean(oppId) && oppData?.connected !== false;
      setOnlineSymbol(myMark);
      setOpponentConnected(oppConnected);
      setRematchRequested(Array.isArray(data.rematchRequested) ? data.rematchRequested : []);

      // Opponent left the room → kick me back to the lobby.
      if (myMark && oppId && !oppConnected && data.status !== 'waiting') {
        setOnlineStatus('opponentLeft');
        setOnlineError(false);
        setOnlinePhase('lobby');
        setRoomCode('');
        setRematchRequested([]);
        if (roomUnsubRef.current) {
          roomUnsubRef.current();
          roomUnsubRef.current = null;
        }
        return;
      }

      if (data.status === 'waiting') {
        setOnlinePhase('waiting');
      } else if (data.status === 'playing') {
        setOnlinePhase('playing');
        setOnlineStatus(null);
      } else if (data.status === 'finished') {
        setOnlinePhase('playing');
      }
    }, () => {
      setOnlineStatus('connectionError');
      setOnlineError(true);
    });
    return () => {
      if (roomUnsubRef.current) {
        roomUnsubRef.current();
        roomUnsubRef.current = null;
      }
    };
  }, []);

  const createRoom = useCallback(async () => {
    try {
      setOnlineError(false);
      setOnlineStatus(null);
      let code = generateRoomCode();
      // Ensure uniqueness (retry a few times).
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const snap = await getDoc(doc(db, ROOM_COLLECTION, code));
        if (!snap.exists()) break;
        code = generateRoomCode();
      }
      const myId = playerIdRef.current;
      await setDoc(doc(db, ROOM_COLLECTION, code), {
        board: Array(9).fill(null),
        currentTurn: 'X',
        hostSymbol: 'X',
        players: { X: { id: myId, connected: true } },
        status: 'waiting',
        winner: null,
        winningLine: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setRoomCode(code);
      setOnlineSymbol('X');
      resetGame();
      subscribeToRoom(code);
      setOnlinePhase('waiting');
    } catch {
      setOnlineStatus('connectionError');
      setOnlineError(true);
    }
  }, [subscribeToRoom, resetGame]);

  // Host picks ✕ or ○ while waiting; the joiner takes the other symbol.
  const switchHostSymbol = useCallback(async (sym) => {
    if (!roomCode || onlinePhase !== 'waiting' || onlineSymbol === sym) return;
    const ref = doc(db, ROOM_COLLECTION, roomCode);
    const myId = playerIdRef.current;
    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error('gone');
        const data = snap.data();
        if (data.status !== 'waiting') throw new Error('started');
        const other = sym === 'X' ? 'O' : 'X';
        const occupant = data.players?.[other];
        if (occupant && occupant.id !== myId) throw new Error('joined');
        transaction.update(ref, {
          hostSymbol: sym,
          players: { [sym]: { id: myId, connected: true } },
          updatedAt: serverTimestamp(),
        });
      });
      setOnlineSymbol(sym);
    } catch {
      // Room already started or changed — the snapshot syncs the state.
    }
  }, [roomCode, onlinePhase, onlineSymbol]);

  const joinRoom = useCallback(async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      setOnlineStatus('roomNotFound');
      setOnlineError(true);
      return;
    }
    try {
      setOnlineError(false);
      setOnlineStatus(null);
      const ref = doc(db, ROOM_COLLECTION, code);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setOnlineStatus('roomNotFound');
        setOnlineError(true);
        return;
      }
      const data = snap.data();
      const hostSym = data.hostSymbol === 'O' ? 'O' : 'X';
      const joinSlot = hostSym === 'X' ? 'O' : 'X';
      if (data.status !== 'waiting' || data.players?.[joinSlot]) {
        setOnlineStatus('roomFull');
        setOnlineError(true);
        return;
      }
      const myId = playerIdRef.current;
      let slot = joinSlot;
      await runTransaction(db, async (transaction) => {
        const live = await transaction.get(ref);
        if (!live.exists()) throw new Error('gone');
        const room = live.data();
        const host = room.hostSymbol === 'O' ? 'O' : 'X';
        const free = host === 'X' ? 'O' : 'X';
        if (room.status !== 'waiting' || room.players?.[free]) throw new Error('full');
        slot = free;
        transaction.update(ref, {
          [`players.${free}`]: { id: myId, connected: true },
          status: 'playing',
          updatedAt: serverTimestamp(),
        });
      });
      setRoomCode(code);
      setOnlineSymbol(slot);
      resetGame();
      subscribeToRoom(code);
      setOnlinePhase('playing');
    } catch (err) {
      const kind = err?.message;
      setOnlineStatus(kind === 'full' ? 'roomFull' : kind === 'gone' ? 'roomNotFound' : 'connectionError');
      setOnlineError(true);
    }
  }, [joinCode, subscribeToRoom, resetGame]);

  const makeOnlineMove = useCallback(async (index) => {
    if (!roomCode || winner || !onlineSymbol || currentTurn !== onlineSymbol) return;
    if (board[index]) return;
    try {
      const ref = doc(db, ROOM_COLLECTION, roomCode);
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error('gone');
        const data = snap.data();
        if (data.status !== 'playing') throw new Error('not-playing');
        if (data.currentTurn !== onlineSymbol) throw new Error('not-your-turn');
        if (data.board[index]) throw new Error('occupied');
        const nextBoard = [...data.board];
        nextBoard[index] = onlineSymbol;
        const result = checkWinner(nextBoard);
        const nextTurn = other(onlineSymbol);
        transaction.update(ref, {
          board: nextBoard,
          currentTurn: nextTurn,
          status: result || isDraw(nextBoard) ? 'finished' : 'playing',
          winner: result ? result.winner : isDraw(nextBoard) ? 'draw' : null,
          winningLine: result ? result.line : null,
          updatedAt: serverTimestamp(),
        });
      });
    } catch {
      // Transaction rejected (invalid move / state changed) — snapshot will sync.
    }
  }, [board, currentTurn, onlineSymbol, roomCode, winner]);

  /* ── Online cleanup on unmount ─────────────────────── */

  // Refs above keep current values so this effect never re-runs
  // (re-running would kill the Firestore subscription).
  useEffect(() => {
    const onUnload = () => leaveRoom();
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      leaveRoom();
    };
  }, [leaveRoom]);

  /* ── Keyboard: Escape returns to menu ──────────────── */

  useEffect(() => {
    if (view === 'menu') return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        goToMenu();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [view, goToMenu]);

  /* ── Copy room code ────────────────────────────────── */

  const copyRoomCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — code is selectable.
    }
  }, [roomCode]);

  /* ── Derived ───────────────────────────────────────── */

  const isOnlineTurn = view === 'online' && onlinePhase === 'playing'
    && onlineSymbol && currentTurn === onlineSymbol && !winner && opponentConnected;

  const canClickCell = (index) => {
    if (winner || board[index]) return false;
    // Local: both players share the device — any empty cell is clickable.
    if (view === 'local') return true;
    if (view === 'ai') return !aiThinking && currentTurn === mySymbol;
    if (view === 'online') return isOnlineTurn;
    return false;
  };

  const handleCellClick = (index) => {
    if (!canClickCell(index)) return;
    if (view === 'local') {
      applyMove(index, currentTurn);
    } else if (view === 'ai') {
      applyMove(index, mySymbol);
    } else if (view === 'online') {
      makeOnlineMove(index);
    }
  };

  const handleRematch = () => {
    if (view === 'online') {
      if (!roomCode || !onlineSymbol) return;
      const ref = doc(db, ROOM_COLLECTION, roomCode);
      const myMark = onlineSymbol;
      // Optimistic: show the waiting notice immediately.
      setRematchRequested((prev) => (prev.includes(myMark) ? prev : [...prev, myMark]));
      runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error('gone');
        const data = snap.data();
        if (data.status !== 'finished') return;
        const reqs = Array.isArray(data.rematchRequested) ? data.rematchRequested : [];
        if (reqs.includes(myMark)) return;
        const next = [...reqs, myMark];
        if (next.includes('X') && next.includes('O')) {
          transaction.update(ref, {
            board: Array(9).fill(null),
            currentTurn: 'X',
            status: 'playing',
            winner: null,
            winningLine: null,
            rematchRequested: [],
            updatedAt: serverTimestamp(),
          });
        } else {
          transaction.update(ref, { rematchRequested: next, updatedAt: serverTimestamp() });
        }
      }).catch(() => {});
      return;
    }
    resetGame();
    if (view === 'local') {
      // Swap starting player on rematch.
      setCurrentTurn((prev) => other(prev));
    }
  };

  const resultText = useMemo(() => {
    if (winner === 'draw') return copy.draw;
    if (winner === 'X') return copy.xWins;
    if (winner === 'O') return copy.oWins;
    return null;
  }, [winner, copy]);

  /* ── Render helpers ────────────────────────────────── */

  const renderMenu = () => (
    <div className="ttt__menu">
      <button type="button" className="ttt__mode-btn" onClick={() => { resetGame(); setView('local'); }}>
        <span className="ttt__mode-copy"><strong>{copy.local}</strong><span>{copy.localDesc}</span></span>
      </button>
      <button type="button" className="ttt__mode-btn" onClick={() => { resetGame(); setOnlinePhase('lobby'); setOnlineStatus(null); setView('online'); }}>
        <span className="ttt__mode-copy"><strong>{copy.online}</strong><span>{copy.onlineDesc}</span></span>
      </button>
      <button type="button" className="ttt__mode-btn" onClick={() => { resetGame(); setSymbolPicked(false); setView('ai'); }}>
        <span className="ttt__mode-copy"><strong>{copy.ai}</strong><span>{copy.aiDesc}</span></span>
      </button>
    </div>
  );

  const renderSymbolPicker = (onPick) => (
    <>
      <p className="ttt__symbol-label">{copy.selectX}</p>
      <div className="ttt__symbol-picker">
        <button type="button" data-sym="X" className={mySymbol === 'X' ? 'is-active' : ''} onClick={() => { setMySymbol('X'); onPick('X'); }}>{copy.playX}</button>
        <button type="button" data-sym="O" className={mySymbol === 'O' ? 'is-active' : ''} onClick={() => { setMySymbol('O'); onPick('O'); }}>{copy.playO}</button>
      </div>
    </>
  );

  const renderDifficulty = () => (
    <div className="ttt__difficulty" role="group" aria-label={copy.ai}>
      {['easy', 'normal', 'hard'].map((d) => (
        <button key={d} type="button" className={aiDifficulty === d ? 'is-active' : ''} onClick={() => setAiDifficulty(d)}>
          {copy[d]}
        </button>
      ))}
    </div>
  );

  const renderBoard = () => (
    <div className="ttt__board" role="grid" aria-label={copy.title}>
      {board.map((cell, index) => {
        const isWinCell = winningLine && winningLine.includes(index);
        return (
          <button
            key={index}
            type="button"
            role="gridcell"
            className={`ttt__cell${isWinCell ? ' is-win' : ''}`}
            data-mark={cell || undefined}
            disabled={!canClickCell(index)}
            onClick={() => handleCellClick(index)}
            aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ''}`}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );

  const renderHeader = () => {
    if (winner) {
      return (
        <div className="ttt__header">
          <span />
          <span className="ttt__result" data-result={winner === 'draw' ? 'draw' : winner}>{resultText}</span>
        </div>
      );
    }
    const activeMark = currentTurn;
    let label;
    if (view === 'ai' && aiThinking) {
      label = copy.thinking;
    } else if (view === 'local') {
      label = copy.playerTurn.replace('{player}', currentTurn);
    } else if (view === 'online' && onlineSymbol && currentTurn !== onlineSymbol) {
      label = copy.playerTurn.replace('{player}', currentTurn);
    } else {
      label = copy.yourTurn;
    }
    return (
      <div className="ttt__header">
        <span className="ttt__turn">
          <span className="ttt__turn-mark" data-mark={activeMark}>{activeMark}</span>
          {label}
        </span>
      </div>
    );
  };

  const renderFooter = (showRematch = true) => {
    const isOnlineGame = view === 'online';
    const iAsked = isOnlineGame && rematchRequested.includes(onlineSymbol);
    const oppAsked = Boolean(
      isOnlineGame && onlineSymbol && rematchRequested.includes(other(onlineSymbol)),
    );
    return (
      <div className="ttt__footer">
        {winner && showRematch && isOnlineGame && (
          <div className="ttt__rematch">
            <button
              type="button"
              className={`is-primary${oppAsked && !iAsked ? ' is-accept' : ''}`}
              onClick={handleRematch}
              disabled={iAsked}
            >
              {oppAsked && !iAsked ? copy.rematchAccept : copy.rematch}
            </button>
            {iAsked && <span className="ttt__status-message is-waiting">{copy.rematchWaiting}</span>}
            {oppAsked && !iAsked && <span className="ttt__status-message is-waiting">{copy.rematchOpponentWants}</span>}
          </div>
        )}
        {winner && showRematch && !isOnlineGame && (
          <button type="button" className="is-primary" onClick={handleRematch}>{copy.rematch}</button>
        )}
        <button type="button" onClick={goToMenu}>{copy.backToMenu}</button>
      </div>
    );
  };

  const renderLocal = () => (
    <>
      {renderHeader()}
      {renderBoard()}
      {renderFooter()}
    </>
  );

  const renderAi = () => {
    if (!symbolPicked) {
      return (
        <div className="ttt__menu">
          {renderDifficulty()}
          {renderSymbolPicker(() => { setSymbolPicked(true); setCurrentTurn('X'); })}
          <div className="ttt__footer">
            <button type="button" onClick={goToMenu}>{copy.backToMenu}</button>
          </div>
        </div>
      );
    }
    return (
      <>
        {renderHeader()}
        {renderBoard()}
        {renderFooter()}
      </>
    );
  };

  const renderOnline = () => {
    if (onlinePhase === 'lobby') {
      return (
        <div className="ttt__online">
          <div className="ttt__online-actions">
            <button type="button" className="is-primary" onClick={createRoom}>{copy.createRoom}</button>
          </div>
          <div className="ttt__join-row">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder={copy.enterCode}
              maxLength={6}
              aria-label={copy.roomCode}
            />
            <button type="button" onClick={joinRoom} disabled={joinCode.length < 4}>{copy.joinRoom}</button>
          </div>
          {onlineStatus && <p className={`ttt__status-message${onlineError ? ' is-error' : ''}`}>{copy[onlineStatus]}</p>}
          <p className="ttt__status-message">{copy.onlineHint}</p>
          <div className="ttt__footer">
            <button type="button" onClick={goToMenu}>{copy.backToMenu}</button>
          </div>
        </div>
      );
    }

    if (onlinePhase === 'waiting') {
      return (
        <div className="ttt__online">
          <div className="ttt__room-code">
            <span className="ttt__room-code-value">{roomCode}</span>
            <button type="button" onClick={copyRoomCode}>{copied ? copy.copied : copy.copyCode}</button>
          </div>
          <p className="ttt__symbol-label">{copy.selectX}</p>
          <div className="ttt__symbol-picker" role="group" aria-label={copy.selectX}>
            <button
              type="button"
              data-sym="X"
              className={onlineSymbol === 'X' ? 'is-active' : ''}
              aria-pressed={onlineSymbol === 'X'}
              onClick={() => switchHostSymbol('X')}
            >
              {copy.playX}
            </button>
            <button
              type="button"
              data-sym="O"
              className={onlineSymbol === 'O' ? 'is-active' : ''}
              aria-pressed={onlineSymbol === 'O'}
              onClick={() => switchHostSymbol('O')}
            >
              {copy.playO}
            </button>
          </div>
          <p className="ttt__status-message is-waiting">{copy.waitingPlayer}</p>
          <div className="ttt__footer">
            <button type="button" onClick={goToMenu}>{copy.backToMenu}</button>
          </div>
        </div>
      );
    }

    // playing
    return (
      <>
        <div className="ttt__players">
          <span className={`ttt__player-badge${onlineSymbol === 'X' ? ' is-you' : ''}${opponentConnected ? '' : ' is-offline'}`}>
            <span className="dot" />✕
          </span>
          <span className={`ttt__player-badge${onlineSymbol === 'O' ? ' is-you' : ''}${opponentConnected ? '' : ' is-offline'}`}>
            <span className="dot" />○
          </span>
        </div>
        {!opponentConnected && !winner && (
          <p className="ttt__status-message is-error">{copy.opponentLeft}</p>
        )}
        {renderHeader()}
        {renderBoard()}
        {renderFooter()}
      </>
    );
  };

  /* ── Main render ───────────────────────────────────── */

  return (
    <div className="ttt">
      {view === 'menu' && renderMenu()}
      {view === 'local' && renderLocal()}
      {view === 'ai' && renderAi()}
      {view === 'online' && renderOnline()}
    </div>
  );
};

export default TicTacToe;
