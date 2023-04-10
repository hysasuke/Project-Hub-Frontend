import React, { useEffect } from "react";
import styles from "@/styles/Header.module.css";
import {
  Dropdown,
  Navbar,
  Row,
  Text,
  Tooltip,
  Popover,
  Button,
  useTheme,
  Container,
  Grid
} from "@nextui-org/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { useAnimationFrame } from "@/utils/useAnimationFrame";
import EditIcon from "@mui/icons-material/Edit";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import WebSocket from "ws";

import AddIcon from "@mui/icons-material/Add";
export default function Header({
  setEditing,
  editing,
  setShutdownModalVisible,
  socketMessage,
  socket,
  groupPanelExpanded,
  setGroupPanelExpanded,
  setRestartModalVisible,
  groups,
  currentGroupId,
  setCurrentGroup,
  setCurrentGroupId,
  setVisible
}: {
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  setShutdownModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  socketMessage: any;
  socket: WebSocket;
  groupPanelExpanded: boolean;
  setGroupPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setRestartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  groups: any[];
  currentGroupId: number;
  setCurrentGroup: React.Dispatch<React.SetStateAction<any>>;
  setCurrentGroupId: React.Dispatch<React.SetStateAction<number>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const theme = useTheme();
  const [displayTime, setDisplayTime] = React.useState<string>("");
  const [currentVolume, setCurrentVolume] = React.useState<number>(0);
  const [toVolume, setToVolume] = React.useState<number>(0);
  const [muted, setMuted] = React.useState<boolean>(false);

  const toggleRef = React.useRef<any>(null);
  useAnimationFrame(() => {
    setDisplayTime(clock());
  });

  const clock = () => {
    const date = new Date();
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const time = `${hours}:${minutes}:${seconds}`;
    return time;
  };

  const currentDate = () => {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const year =
      date.getFullYear() < 10 ? `0${date.getFullYear()}` : date.getFullYear();
    const week = daysOfWeek[date.getDay()];
    const fullDate = `${year}-${month}-${day} ${week}`;
    return fullDate;
  };

  return (
    <Navbar isBordered variant={"floating"} maxWidth="fluid">
      <Navbar.Toggle ref={toggleRef} showIn="xs" />
      <Navbar.Brand
        css={{
          "@xs": {
            w: "12%"
          }
        }}
      >
        <Container
          css={{
            display: "none",
            "@xs": {
              display: "inline"
            }
          }}
        >
          <IconButton
            onClick={() => {
              setGroupPanelExpanded(!groupPanelExpanded);
            }}
          >
            <MenuOpenIcon
              style={{
                color: "white",
                transform: `rotate(${groupPanelExpanded ? "0deg" : "180deg"})`
              }}
            />
          </IconButton>
        </Container>
        <Text b color="inherit" hideIn="xs">
          Project Hub
        </Text>
      </Navbar.Brand>
      <Navbar.Content style={{ flex: 1, justifyContent: "center" }}>
        <Tooltip content={currentDate()} rounded placement="bottom">
          <Text b color="inherit" hideIn="xs">
            {displayTime}
          </Text>
        </Tooltip>
      </Navbar.Content>
      <Navbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end"
          }
        }}
      >
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <IconButton style={{ color: "white" }}>
                <MoreVertIcon />
              </IconButton>
            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="Actions"
            color="secondary"
            onAction={(actionKey) => {
              switch (actionKey) {
                case "edit":
                  setEditing(!editing);
                  break;
                default:
                  break;
              }
            }}
          >
            <Dropdown.Item key="edit" color={editing ? "success" : "primary"}>
              <Row align="center">
                <EditIcon />
                <Text style={{ textTransform: "uppercase", marginLeft: 5 }}>
                  {editing ? "DONE" : "EDIT"}
                </Text>
              </Row>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
      <Navbar.Collapse disableAnimation={true}>
        {groups?.map((item, index) => (
          <Navbar.CollapseItem key={"headerGroupItem:" + item.id}>
            <Button
              color={currentGroupId === item.id ? "primary" : "secondary"}
              onPress={() => {
                if (toggleRef.current) {
                  toggleRef.current?.click();
                }
                setCurrentGroupId(item.id);
                setCurrentGroup(item);
              }}
              ghost
              css={{
                minWidth: "100%"
              }}
              href="#"
            >
              {item.name}
            </Button>
          </Navbar.CollapseItem>
        ))}
        <Navbar.CollapseItem>
          <Button
            onPress={() => {
              if (toggleRef.current) {
                toggleRef.current?.click();
              }
              setVisible(true);
            }}
            css={{
              minWidth: "100%",
              borderColor: "grey",
              backgroundColor: "transparent"
            }}
            ghost
          >
            <AddIcon style={{ color: "gray" }} />
          </Button>
        </Navbar.CollapseItem>
      </Navbar.Collapse>
    </Navbar>
  );
}
