import { Card, Group, Text, Badge, RingProgress, Center, ActionIcon, NumberInput, Flex, Indicator } from '@mantine/core';
import { PlayerCardPropsType } from './types';
import { ChangeEvent, useState } from 'react';
import { IconCircleCheck, IconEditCircle, IconPlayerTrackNext, IconPlayerTrackPrev, IconUser } from '@tabler/icons-react';
import { PlayerType } from '@/types';

function PlayerCard(props: PlayerCardPropsType) {
  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [playerPoints, setPlayerPoints] = useState<number | "">(props.player.points);
  const progressStates = [
    { progressValue: 10, color: "red" },
    { progressValue: 20, color: "pink" },
    { progressValue: 30, color: "grape" },
    { progressValue: 40, color: "violet" },
    { progressValue: 50, color: "indigo" },
    { progressValue: 60, color: "blue" },
    { progressValue: 70, color: "cyan" },
    { progressValue: 80, color: "teal" },
    { progressValue: 90, color: "green" },
    { progressValue: 100, color: "lime" },
  ];
  return (
    <Card shadow="sm" padding="xs" radius="md" withBorder>
      <Card.Section>
        <Flex mt="xs" mb="xs" mx={"md"} direction={"row"}>
          <IconUser color={"gray"} size={"2rem"} />
          <Text mx={"sm"} weight={500} size={"xl"}>{props.player.name}</Text>
          <Badge mx={"sm"} radius={"md"} size={"xl"} color={"gray"} variant={"outline"}>{props.player.currentPhase - 1}</Badge>
          <Indicator mx={"sm"} color="gray" position="middle-start" size={16} withBorder processing>
            <Badge radius={"md"} size={"xl"} color={"gray"} variant={"outline"}>{props.player.currentPhase}</Badge>
          </Indicator>
        </Flex>
      </Card.Section>
      <Card.Section>
        <Group mx={"md"} position="apart" spacing="xs" grow>
          {
            !isInEditMode
              ? <Badge size='xl' radius={"xs"}>
                {props.player.points}
              </Badge>
              : <NumberInput
                value={playerPoints}
                onChange={setPlayerPoints}
                step={5}
                min={0}
                placeholder={`Add to ${props.player.points}`}
                hideControls
                radius={"xs"}
              />
          }
          <ActionIcon hidden={playerPoints === ""} variant="subtle" onClick={() => {
            setIsInEditMode(!isInEditMode);
            isInEditMode && props.setGameState((previousState) => {
              const playerInPreviousState = previousState.players.find((player) => {
                return (player.name === props.player.name);
              });
              if (playerInPreviousState !== undefined) {
                const playerInPreviousStatePointsAsNumber = playerInPreviousState.points as number;
                const playerPointsAsNumber = playerPoints === "" ? 0 : playerPoints as number;
                const updatedPlayer: PlayerType = {
                  points: playerInPreviousStatePointsAsNumber + playerPointsAsNumber,
                  name: playerInPreviousState.name,
                  currentPhase: playerInPreviousState.currentPhase,
                }
                let listOfPlayersWithoutThisPlayer = previousState.players.filter((player) => player.name !== props.player.name)
                listOfPlayersWithoutThisPlayer = listOfPlayersWithoutThisPlayer.concat([updatedPlayer])
                const nextState = {
                  ...previousState,
                  players: listOfPlayersWithoutThisPlayer,
                };
                sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
                setPlayerPoints("")
                return nextState
              } else {
                const nextState = {
                  ...previousState,
                }
                sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
                setPlayerPoints("");
                return nextState
              }
            })
          }} size={40}>
            {
              isInEditMode
                ? <IconCircleCheck size={"1.5rem"} />
                : <IconEditCircle size={"1.5rem"} />
            }
          </ActionIcon>
        </Group>
      </Card.Section>
      <Center>
        <ActionIcon variant="subtle" onClick={() => {
          props.setGameState((previousState) => {
            const playerInPreviousState = previousState.players.find((player) => {
              return (player.name === props.player.name);
            });
            if (playerInPreviousState !== undefined) {
              const updatedPlayer: PlayerType = {
                points: playerInPreviousState.points,
                name: playerInPreviousState.name,
                currentPhase: (playerInPreviousState.currentPhase - 1) < 0 ? playerInPreviousState.currentPhase : playerInPreviousState.currentPhase - 1,
              }
              let listOfPlayersWithoutThisPlayer = previousState.players.filter((player) => player.name !== props.player.name)
              listOfPlayersWithoutThisPlayer = listOfPlayersWithoutThisPlayer.concat([updatedPlayer])
              const nextState = {
                ...previousState,
                players: listOfPlayersWithoutThisPlayer,
              };
              sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
              return nextState
            } else {
              const nextState = {
                ...previousState,
              }
              sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
              return nextState
            }
          })
        }} size={40}>
          <IconPlayerTrackPrev size={"1.5rem"} />
        </ActionIcon>
        <RingProgress
          roundCaps
          label={
            <Text size="xl" align="center">
              {props.player.currentPhase}
            </Text>
          }
          sections={progressStates.filter((progressState) => {
            return (progressState.progressValue <= (props.player.currentPhase * 10));
          }).map((filteredProgressState) => {
            return {
              value: 10,
              color: filteredProgressState.color,
            };
          })}
        />
        <ActionIcon variant="subtle" onClick={() => {
          props.setGameState((previousState) => {
            const playerInPreviousState = previousState.players.find((player) => {
              return (player.name === props.player.name);
            });
            if (playerInPreviousState !== undefined) {
              const updatedPlayer: PlayerType = {
                points: playerInPreviousState.points,
                name: playerInPreviousState.name,
                currentPhase: (playerInPreviousState.currentPhase + 1) > 10 ? playerInPreviousState.currentPhase : playerInPreviousState.currentPhase + 1,
              }
              let listOfPlayersWithoutThisPlayer = previousState.players.filter((player) => player.name !== props.player.name)
              listOfPlayersWithoutThisPlayer = listOfPlayersWithoutThisPlayer.concat([updatedPlayer])
              const nextState = {
                ...previousState,
                players: listOfPlayersWithoutThisPlayer,
              };
              sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
              return nextState
            } else {
              const nextState = {
                ...previousState,
              }
              sessionStorage.setItem("Phase10.ToolKit.Game.State", JSON.stringify(nextState));
              return nextState
            }
          })
        }} size={40}>
          <IconPlayerTrackNext size={"1.5rem"} />
        </ActionIcon>
      </Center>
    </Card>
  );
}

export default PlayerCard;