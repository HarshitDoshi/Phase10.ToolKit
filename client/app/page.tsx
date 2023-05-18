"use client"

import HomeIllustration from '@/components/HomeIllustration';
import PlayerCard from '@/components/PlayerCard';
import { PlayerType } from '@/types';
import { Button, Center, Container, Paper, Image, TextInput, SimpleGrid } from '@mantine/core';
import { IconLock, IconLockOpen, IconMeeple, IconRefresh, IconSquareRoundedPlus } from '@tabler/icons-react';
import { ChangeEvent, useEffect, useState } from 'react';

export const SESSION_STORE = "Phase10.ToolKit.Game.State";

export default function Home() {
  const initialPhase = 1;
  const firstPhase = 1;
  const lastPhase = 10;
  const initialPoints = 0;
  const [isGameLocked, setIsGameLocked] = useState<boolean>(false);
  const [newPlayerInput, setNewPlayerInput] = useState<string>("");
  const [isCreatingNewPlayer, setIsCreatingNewPlayer] = useState<boolean>(false);
  const [gameState, setGameState] = useState<{
    players: PlayerType[],
  }>({
    players: [],
  });
  useEffect(() => {
    const gameStateFromSessionStorage = sessionStorage.getItem(SESSION_STORE);
    if (gameStateFromSessionStorage !== null) {
      setGameState(JSON.parse(gameStateFromSessionStorage));
    } else {
      setGameState({
        players: [],
      });
    }
  }, [])
  return (
    <Container>
      <Center sx={(theme) => ({
        marginBottom: theme.spacing.xs,
      })}>
        <Button onClick={async () => {
          setIsGameLocked(!isGameLocked);
        }}
          loading={isCreatingNewPlayer} loaderPosition="center"
        >
          {isGameLocked ? <IconLockOpen size="1rem" /> : <IconLock size="1rem" />}
        </Button>
        <Paper shadow="xs" sx={(theme) => ({ width: "100%" })} mx={"xs"}>
          <TextInput
            disabled={isGameLocked}
            placeholder="Player's name"
            value={newPlayerInput}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setNewPlayerInput(event.currentTarget.value);
            }}
            icon={<IconMeeple size="1rem" />}
          />
        </Paper>
        <Button leftIcon={<IconSquareRoundedPlus size={"1rem"} />} disabled={isGameLocked} onClick={async () => {
          setIsCreatingNewPlayer(true);
          setGameState((previousState) => {
            const newPlayer: PlayerType[] = [{
              name: newPlayerInput,
              currentPhase: initialPhase,
              points: initialPoints,
            }];
            const nextState = {
              ...previousState,
              players: previousState.players.concat(newPlayer),
            };
            sessionStorage.setItem(SESSION_STORE, JSON.stringify(nextState));
            return nextState;
          });
          setNewPlayerInput("");
          setIsCreatingNewPlayer(false);
        }}
          loading={isCreatingNewPlayer} loaderPosition="center"
        >
          {isCreatingNewPlayer ? "Creating" : "Create"}
        </Button>
        <Button ml={"xs"} color="red" leftIcon={<IconRefresh size={"1rem"} />} disabled={isGameLocked} onClick={async () => {
          setIsCreatingNewPlayer(true);
          setGameState((previousState) => {
            sessionStorage.removeItem(SESSION_STORE);
            return {
              players: [],
            };
          });
          setNewPlayerInput("");
          setIsCreatingNewPlayer(false);
        }}
          loading={isCreatingNewPlayer} loaderPosition="center"
        >
          {"Reset"}
        </Button>
      </Center>
      <Center>
        <Paper withBorder px={"lg"} py={"lg"} shadow="xs" sx={(theme) => ({ width: "100%" })}>
          {gameState.players.length === 0 && <HomeIllustration />}
          <SimpleGrid cols={3} spacing="xs"
            breakpoints={[
              { maxWidth: '62rem', cols: 3, spacing: 'xs' },
              { maxWidth: '48rem', cols: 2, spacing: 'xs' },
              { maxWidth: '36rem', cols: 1, spacing: 'xs' },
            ]}>
            {
              gameState.players.sort((a, b) => a.name.localeCompare(b.name)).map((player) => {
                return (
                  <PlayerCard key={player.name} player={player} gameState={gameState} setGameState={setGameState} />
                );
              })
            }
          </SimpleGrid>
        </Paper>
      </Center>
    </Container>
  )
}