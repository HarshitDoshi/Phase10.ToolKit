"use client"

import HomeIllustration from '@/components/HomeIllustration';
import PlayerCard from '@/components/PlayerCard';
import { PlayerType } from '@/types';
import { Button, Text, Center, Container, Paper, TextInput, SimpleGrid, Group, useMantineColorScheme, Flex, Modal, Radio, useMantineTheme } from '@mantine/core';
import { IconClipboard, IconClipboardCheck, IconHourglass, IconLock, IconLockOpen, IconMeeple, IconRefresh, IconSquareRoundedPlus, IconTrash } from '@tabler/icons-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { customAlphabet } from 'nanoid/async';
import {
  RealtimeChannel,
  SupabaseClient,
  createClient
} from '@supabase/supabase-js';
import { useForm } from '@mantine/form';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const router = useRouter();
  const searchParameters = useSearchParams();
  const clipboard = useClipboard({ timeout: 500 });
  const [opened, { open, close }] = useDisclosure(true);
  const form = useForm({
    initialValues: {
      gameID: searchParameters.get("game") || '',
    },
    validate: {
      gameID: (value) => (value.length === 20 ? null : 'Invalid Game ID'),
    },
  });
  const initialPhase = 1;
  const initialPoints = 0;
  const [isGameLocked, setIsGameLocked] = useState<boolean>(false);
  const [newPlayerInput, setNewPlayerInput] = useState<string>("");
  const [isCreatingNewPlayer, setIsCreatingNewPlayer] = useState<boolean>(false);
  const [isSynchronizing, setIsSynchronizing] = useState<boolean>(false);
  const [userType, setUserType] = useState<"host" | "spectator">("spectator");
  const [gameState, setGameState] = useState<{
    id: string;
    players: PlayerType[],
  }>({
    id: "",
    players: [],
  });
  const [gameClient, setGameClient] = useState<SupabaseClient<any, "public", any>>();
  const [gameChannel, setGameChannel] = useState<RealtimeChannel>();
  useEffect(() => {
    const client = createClient(
      `https://${process.env.NEXT_PUBLIC_SUPABASE_PHASE10_TOOLKIT_PROJECT_REFERENCE_ID}.supabase.co`,
      `${process.env.NEXT_PUBLIC_SUPABASE_PHASE10_TOOLKIT_ANONYMOUS_KEY}`
    );
    setGameClient(client);
    const gameStateFromSessionStorage = sessionStorage.getItem("Phase10.ToolKit.Game.State");
    const userTypeFromSessionStorage = sessionStorage.getItem("Phase10.ToolKit.User.Type");
    if (userTypeFromSessionStorage !== null) {
      setUserType(JSON.parse(userTypeFromSessionStorage) as "host" | "spectator");
    } else {
      setUserType("spectator");
    }
    if (gameStateFromSessionStorage !== null) {
      const parsedGameStateFromSessionStorage: {
        id: string;
        players: PlayerType[],
      } = JSON.parse(gameStateFromSessionStorage);
      const channel = client.channel(parsedGameStateFromSessionStorage.id);
      channel
        .on(
          'broadcast',
          { event: 'synchronize' },
          (payload) => {
            // console.log({ payload });
          }
        )
        .subscribe()
      setGameState(parsedGameStateFromSessionStorage);
      setGameChannel(channel);
      close();
    } else {
      setGameState({
        id: "",
        players: [],
      });
      open();
    }
  }, [close, open])
  return (
    <Container px={0}>
      <Modal
        opened={opened || gameState.id === ""}
        onClose={close}
        closeOnEscape={false}
        closeOnClickOutside={false}
        withCloseButton={false}
        trapFocus
        returnFocus
        centered
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2],
          opacity: 0.5,
          blur: 4,
        }}
      >
        <Flex mt={"sm"} w={"100%"} gap={"sm"} direction={"row"} justify={"flex-start"} align={"center"}>
          <Radio.Group
            value={userType}
            onChange={(value) => {
              setUserType(value as "host" | "spectator");
            }}
            name="screenTypeSelector"
          >
            <Group>
              <Radio disabled={gameState.id.length === 20} value="spectator" label="Spectate" />
              <Radio value="host" label="Host" />
            </Group>
          </Radio.Group>
        </Flex>
        {
          userType === "spectator" && <Flex w={"100%"} direction={"column"} justify={"center"} align={"flex-end"}>
            <form style={{ width: "100%" }} onSubmit={form.onSubmit((values) => {
              sessionStorage.removeItem("Phase10.ToolKit.Game.State");
              setGameState((previousGameState) => {
                const newState = {
                  ...previousGameState,
                  id: values.gameID,
                  players: [],
                };
                sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(newState));
                sessionStorage.setItem("Phase10.ToolKit.User.Type", JSON.stringify(userType));
                return newState;
              })
              if (gameClient) {
                const channel = gameClient.channel(values.gameID);
                channel
                  .on(
                    'broadcast',
                    { event: 'synchronize' },
                    (payload) => {
                      setGameState((previousGameState) => {
                        const newState = {
                          ...previousGameState,
                          ...payload["payload"]["game"],
                        };
                        sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(newState));
                        sessionStorage.setItem("Phase10.ToolKit.User.Type", JSON.stringify(userType));
                        return newState;
                      });
                    }
                  )
                  .subscribe((status) => {
                    if (
                      status === "SUBSCRIBED"
                      // payload.event === "synchronize"
                      // && payload.type === "broadcast"
                      // && payload["payload"]["message"] === "SYNCHRONIZE"
                    ) {
                      console.log("at spectator...");
                      channel.send({
                        type: "broadcast",
                        event: "synchronize",
                        payload: {
                          message: `${gameState.id}`,
                          game: gameState,
                        },
                      });
                    }
                  });
                setGameChannel(channel);
                channel.send({
                  type: "broadcast",
                  event: "synchronize",
                  payload: {
                    message: `SYNCHRONIZE`,
                  },
                });
                close();
              }
              form.setValues({
                gameID: '',
              });
            })}>
              <TextInput
                my={"sm"}
                w={"100%"}
                radius={"sm"}
                withAsterisk
                placeholder="Enter Game ID"
                {...form.getInputProps('gameID')}
              />
              <Group position="right" mt="md">
                <Button type="submit">Enter</Button>
              </Group>
            </form>
          </Flex>
        }
        {
          userType === "host" && <Flex w={"100%"} direction={"column"} justify={"center"} align={"flex-end"}>
            {
              gameState.id.length === 20
                ? <Button
                  variant={"light"}
                  my={"sm"} w={"100%"}
                  ff={"monospace"} fw={"bold"} size={"md"} radius={"sm"}
                  color={clipboard.copied ? "green" : "red"}
                  onClick={() => clipboard.copy(`Game ID: ${gameState.id}\nGame Link: ${process.env.NODE_ENV === "development" ? "http://localhost:3333/?game=" : "https://phase10.shunyaek.se?game="}${gameState.id}`)}
                  leftIcon={
                    clipboard.copied
                      ? <IconClipboardCheck size={"1.5rem"} />
                      : <IconClipboard size={"1.5rem"} />
                  }
                >
                  {
                    clipboard.copied
                      ? `${gameState.id}`
                      : `${gameState.id}`
                  }
                </Button>
                : <Button variant={"outline"} color={colorScheme === "dark" ? "gray" : "dark"} mt={"sm"} w={"100%"} radius={"sm"} onClick={async () => {
                  const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20)
                  const id = await nanoid();
                  setGameState((previousGameState) => {
                    return {
                      ...previousGameState,
                      id: id,
                      players: [],
                    }
                  })
                }}>Generate Game ID</Button>
            }
            <Group position="right" mt="md">
              <Button disabled={gameState.id.length !== 20 || gameClient === undefined} type="submit" onClick={() => {
                if (gameClient) {
                  const channel = gameClient.channel(gameState.id);
                  channel
                    .on(
                      'broadcast',
                      { event: 'synchronize' },
                      (payload) => {
                        // console.log({ payload });
                      }
                    )
                    .subscribe((status) => {
                      if (
                        status === "SUBSCRIBED"
                        // payload.event === "synchronize"
                        // && payload.type === "broadcast"
                        // && payload["payload"]["message"] === "SYNCHRONIZE"
                      ) {
                        console.log("at host...");
                        channel.send({
                          type: "broadcast",
                          event: "synchronize",
                          payload: {
                            message: `${gameState.id}`,
                            game: gameState,
                          },
                        });
                      }
                    });
                  setGameChannel(channel);
                  sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(gameState));
                  sessionStorage.setItem("Phase10.ToolKit.User.Type", JSON.stringify(userType));
                  close();
                }
              }}>Create</Button>
            </Group>
          </Flex>
        }
      </Modal>
      <Flex direction={"column"} justify={"center"} align={"center"} mb={"sm"}>
        <Button
          variant={"light"}
          my={"sm"} w={"100%"}
          ff={"monospace"} fw={"bold"} size={"md"} radius={"sm"}
          color={clipboard.copied ? "green" : "red"}
          onClick={() => clipboard.copy(`Game ID: ${gameState.id}\nGame Link: ${process.env.NODE_ENV === "development" ? "http://localhost:3333/?game=" : "https://phase10.shunyaek.se?game="}${gameState.id}`)}
          leftIcon={
            clipboard.copied
              ? <IconClipboardCheck size={"1.5rem"} />
              : <IconClipboard size={"1.5rem"} />
          }
        >
          {
            clipboard.copied
              ? `${gameState.id}`
              : `${gameState.id}`
          }
        </Button>
      </Flex>
      {
        userType === "host"
        && gameState.id.length === 20
        && !opened
        && <Center sx={(theme) => ({
          marginBottom: theme.spacing.xs,
        })}>
          <Paper mr={"xs"} shadow="xs" sx={(theme) => ({ width: "100%" })}>
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
          <Button leftIcon={<IconSquareRoundedPlus size={"1rem"} />} disabled={isGameLocked || (newPlayerInput.length <= 0)} onClick={async () => {
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
              if (gameChannel) {
                gameChannel.send({
                  type: "broadcast",
                  event: "synchronize",
                  payload: {
                    message: `${gameState.id}`,
                    game: nextState,
                  },
                });
              }
              sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
              sessionStorage.setItem("Phase10.ToolKit.User.Type", JSON.stringify(userType));
              return nextState;
            });
            setNewPlayerInput("");
            setIsCreatingNewPlayer(false);
          }}
            loading={isCreatingNewPlayer} loaderPosition="center"
          >
            {isCreatingNewPlayer ? "Creating" : "Create"}
          </Button>
        </Center>
      }
      <Center sx={(theme) => ({
        marginBottom: theme.spacing.xs,
      })}>
        <Paper withBorder shadow="xs" sx={(theme) => ({ width: "100%" })}>
          <Group position="apart" mt="xs" mb="xs" mx={"xs"} grow>
            {
              userType === "host"
              && <Button leftIcon={isGameLocked ? <IconLockOpen size="1rem" /> : <IconLock size="1rem" />} onClick={async () => {
                setIsGameLocked(!isGameLocked);
              }}
                loading={isCreatingNewPlayer} loaderPosition="center"
              >
                {"Lock"}
              </Button>
            }
            {
              userType === "spectator"
              && <Button leftIcon={isSynchronizing ? <IconHourglass size="1rem" /> : <IconRefresh size="1rem" />} onClick={async () => {
                if (gameChannel) {
                  setIsSynchronizing(true);
                  gameChannel.send({
                    type: "broadcast",
                    event: "synchronize",
                    payload: {
                      message: `SYNCHRONIZE`,
                    },
                  });
                  setIsSynchronizing(false);
                }
              }}
                loading={isSynchronizing} loaderPosition="center"
              >
                {"Refresh"}
              </Button>
            }
            <Button color="red" leftIcon={<IconTrash size={"1rem"} />} disabled={isGameLocked} onClick={async () => {
              setIsCreatingNewPlayer(true);
              setGameState((previousState) => {
                sessionStorage.removeItem("Phase10.ToolKit.Game.State");
                const nextState = {
                  ...previousState,
                  id: "",
                  players: [],
                };
                if (userType === "host" && gameChannel) {
                  gameChannel.send({
                    type: "broadcast",
                    event: "synchronize",
                    payload: {
                      message: `${gameState.id}`,
                      game: nextState,
                    },
                  });
                }
                return nextState;
              });
              setNewPlayerInput("");
              setIsCreatingNewPlayer(false);
              router.push("/");
              open();
            }}
              loading={isCreatingNewPlayer} loaderPosition="center"
            >
              {"Reset"}
            </Button>
          </Group>
        </Paper>
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
                  <PlayerCard gameChannel={gameChannel} userType={userType} key={player.name} player={player} gameState={gameState} setGameState={setGameState} />
                );
              })
            }
          </SimpleGrid>
        </Paper>
      </Center>
    </Container>
  )
}
