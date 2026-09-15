import React, { createContext, useContext, useMemo, useState } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [latestResult, setLatestResult] = useState(null);

  const value = useMemo(
    () => ({
      selectedProfile,
      setSelectedProfile,
      selectedLevel,
      setSelectedLevel,
      currentSession,
      setCurrentSession,
      statistics,
      setStatistics,
      latestResult,
      setLatestResult,
    }),
    [selectedProfile, selectedLevel, currentSession, statistics, latestResult]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used inside GameProvider');
  }
  return context;
}
