import React, { useEffect } from "react";
import styles from "@/styles/Header.module.css";
import {
  Dropdown,
  Navbar,
  Row,
  Text,
  Button,
  useTheme,
  Container,
  Modal,
  Card
} from "@nextui-org/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Grid, IconButton } from "@mui/material";
import { useAnimationFrame } from "@/utils/useAnimationFrame";
import EditIcon from "@mui/icons-material/Edit";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import WebSocket from "ws";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AddIcon from "@mui/icons-material/Add";
import TouchBar from "./TouchBar";
import TouchBarSetting from "./TouchBar/touchBarSetting";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
type HeaderProps = {
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
};
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
}: HeaderProps) {
  const theme = useTheme();
  const [currentVolume, setCurrentVolume] = React.useState<number>(0);
  const [toVolume, setToVolume] = React.useState<number>(0);
  const [muted, setMuted] = React.useState<boolean>(false);

  const [touchBarSettingModalVisible, setTouchBarSettingModalVisible] =
    React.useState<boolean>(false);

  const toggleRef = React.useRef<any>(null);

  const renderDropdown = () => {
    const dropdownItems = [
      <Dropdown.Item key="edit" color={editing ? "success" : "primary"}>
        <Row align="center">
          <EditIcon />
          <Text style={{ textTransform: "none", marginLeft: 5 }}>
            {editing ? "Done" : "Edit"}
          </Text>
        </Row>
      </Dropdown.Item>,
      <Dropdown.Item withDivider key="restart" color={"warning"}>
        <Row align="center">
          <RestartAltIcon />
          <Text style={{ textTransform: "uppercase", marginLeft: 5 }}>
            Restart
          </Text>
        </Row>
      </Dropdown.Item>,
      <Dropdown.Item key="shutdown" color={"error"}>
        <Row align="center">
          <PowerSettingsNewIcon />
          <Text style={{ textTransform: "uppercase", marginLeft: 5 }}>
            Shutdown
          </Text>
        </Row>
      </Dropdown.Item>
    ];
    if (editing) {
      // Push at index 0
      dropdownItems.unshift(
        <Dropdown.Item key="touchBarSetting" color="primary">
          <Row align="center">
            <AutoFixHighIcon />
            <Text
              style={{
                textTransform: "none",
                marginLeft: 5
              }}
            >
              Edit Header
            </Text>
          </Row>
        </Dropdown.Item>
      );
    }
    return (
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
              case "touchBarSetting":
                setTouchBarSettingModalVisible(true);
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
          {dropdownItems}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const touchBarSettingModalOnClose = () => {
    setTouchBarSettingModalVisible(false);
  };

  const renderTouchBarSettingModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="TouchBar Setting"
        open={touchBarSettingModalVisible}
        onClose={touchBarSettingModalOnClose}
        blur={true}
        width="lg"
      >
        <Modal.Body>
          <TouchBarSetting />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  };
  return (
    <Navbar
      isBordered
      variant={"floating"}
      maxWidth="fluid"
      css={{ zIndex: touchBarSettingModalVisible ? 10000 : 100 }}
    >
      <Navbar.Toggle ref={toggleRef} showIn="xs" />
      <Navbar.Content
        css={{
          display: "none",
          "@xs": {
            display: "flex"
          },
          alignItems: "center",
          justifyContent: "center"
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
      </Navbar.Content>
      <Navbar.Content
        css={{
          flex: 1,
          marginLeft: 10,
          display: "none",
          "@xs": {
            display: "flex"
          }
        }}
      >
        <TouchBar editing={touchBarSettingModalVisible} />
      </Navbar.Content>
      <Navbar.Content
        css={{
          "@xs": {
            jc: "flex-end"
          }
        }}
      >
        {renderDropdown()}
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
      {renderTouchBarSettingModal()}
    </Navbar>
  );
}
