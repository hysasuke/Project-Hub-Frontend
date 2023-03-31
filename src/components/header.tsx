import React, { useEffect } from "react";
import styles from "@/styles/Header.module.css";
import {
  Dropdown,
  Navbar,
  Row,
  Text,
  Tooltip,
  Popover
} from "@nextui-org/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton } from "@mui/material";
import { useAnimationFrame } from "@/utils/useAnimationFrame";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { Stack, Slider } from "@mui/material";
import { getVolume, setVolume } from "@/modules/SystemControlModule";
import EditIcon from "@mui/icons-material/Edit";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import WebSocket from "ws";
export default function Header({
  setEditing,
  editing,
  setShutdownModalVisible,
  socketMessage,
  socket,
  groupPanelExpanded,
  setGroupPanelExpanded,
  setRestartModalVisible
}: {
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  setShutdownModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  socketMessage: any;
  socket: WebSocket;
  groupPanelExpanded: boolean;
  setGroupPanelExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setRestartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [displayTime, setDisplayTime] = React.useState<string>("");
  const [currentVolume, setCurrentVolume] = React.useState<number>(0);
  const [toVolume, setToVolume] = React.useState<number>(0);
  const [muted, setMuted] = React.useState<boolean>(false);
  useAnimationFrame(() => {
    setDisplayTime(clock());
  });

  useEffect(() => {
    const getCurrentVolume = async () => {
      const result = await getVolume();
      if (result.error === 0) {
        setCurrentVolume(result.data.volume);
        setToVolume(result.data.volume);
        setMuted(result.data.muted);
      }
    };
    getCurrentVolume();
  }, []);

  useEffect(() => {
    if (socketMessage && socketMessage.type === "system_volume") {
      if (Object.keys(socketMessage.data).includes("muted")) {
        setMuted(socketMessage.data.muted);
      } else if (Object.keys(socketMessage.data).includes("volume")) {
        setCurrentVolume(socketMessage.data.volume);
        setToVolume(socketMessage.data.volume);
      }
    }
  }, [socketMessage]);

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

  const renderVolumeIconButton = () => {
    if (!muted) {
      if (toVolume === 0) {
        return <VolumeMuteIcon />;
      } else if (toVolume < 50) {
        return <VolumeDownIcon />;
      } else if (toVolume >= 50) {
        return <VolumeUpIcon />;
      }
    } else {
      return <VolumeOffIcon />;
    }
    return null;
  };

  const renderVolumeSlider = () => {
    return (
      <Row style={{ width: 200, padding: 20 }} align="center">
        <Text>{toVolume}</Text>
        <Slider
          size="small"
          aria-label="Volume"
          value={toVolume}
          style={{ marginLeft: 10 }}
          min={0}
          max={100}
          onChangeCommitted={(event, value) => {
            if (socket) {
              socket.send(
                JSON.stringify({
                  type: "system_volume",
                  data: {
                    volume: value
                  }
                })
              );
            }
          }}
          onChange={(event) => {
            const target = event.target as HTMLButtonElement;
            if (parseInt(target.value) >= 0) {
              setToVolume(parseInt(target.value));
            }
          }}
        />
      </Row>
    );
  };

  return (
    <Navbar isBordered variant={"floating"} maxWidth="fluid">
      <Navbar.Brand
        css={{
          "@xs": {
            w: "12%"
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
        <Popover>
          <Popover.Trigger>
            <IconButton style={{ color: "white" }}>
              {renderVolumeIconButton()}
            </IconButton>
          </Popover.Trigger>
          <Popover.Content>{renderVolumeSlider()}</Popover.Content>
        </Popover>
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
                case "shutdown":
                  setShutdownModalVisible(true);
                  break;
                case "restart":
                  setRestartModalVisible(true);
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
            <Dropdown.Item withDivider key="restart" color={"warning"}>
              <Row align="center">
                <RestartAltIcon />
                <Text style={{ textTransform: "uppercase", marginLeft: 5 }}>
                  Restart
                </Text>
              </Row>
            </Dropdown.Item>
            <Dropdown.Item key="shutdown" color={"error"}>
              <Row align="center">
                <PowerSettingsNewIcon />
                <Text style={{ textTransform: "uppercase", marginLeft: 5 }}>
                  Shutdown
                </Text>
              </Row>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
    </Navbar>
  );
}
