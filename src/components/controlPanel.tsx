import React, { useCallback, useEffect } from "react";
import styles from "@/styles/ControlPanel.module.css";
import {
  Card,
  Dropdown,
  Grid,
  Input,
  Loading,
  Modal,
  Row,
  Text,
  Image,
  Button as NextButton
} from "@nextui-org/react";
import {
  createGroupItem,
  deleteGroupItem,
  executeGroupItem,
  renameGroupItem,
  requestFileSelection
} from "@/modules/ControlPanelModule";
import AddIcon from "@mui/icons-material/Add";
import { Button, ButtonBase, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { useRouter } from "next/router";

let host = process.env.NEXT_PUBLIC_HOST;
if (typeof window !== "undefined") {
  host = process.env.NEXT_PUBLIC_HOST || window.location.origin;
}
export default function ControlPanel(props: any) {
  const isMobile = window.matchMedia("(any-hover: none)").matches;
  const router = useRouter();
  const query = router.query;
  const [createModalVisible, setCreateModalVisible] = React.useState(false);
  const [groupItemType, setGroupItemType] = React.useState(new Set(["file"]));
  const [groupItemName, setGroupItemName] = React.useState("");
  const [groupItemUrl, setGroupItemUrl] = React.useState("");
  const [selectedFile, setSelectedFile]: any = React.useState(null);
  const [waitingForFile, setWaitingForFile] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [renameModalVisible, setRenameModalVisible] = React.useState(false);
  const [editingGroupItem, setEditingGroupItem] = React.useState<any>(null);
  const [modifiers, setModifiers] = React.useState<Array<String>>([]);
  const [pressedKey, setPressedKey] = React.useState<String>("");
  const [recordingKeyboard, setRecordingKeyboard] = React.useState(false);
  const selectedGroupItemType = React.useMemo(
    () => Array.from(groupItemType).join(", ").replaceAll("_", " "),
    [groupItemType]
  );

  const handleQuery = () => {
    if (query.action) {
      switch (query.action) {
        case "add":
          setCreateModalVisible(true);
          if (query.type) {
            let type: string = query.type as string;
            setGroupItemType(new Set([type]));
          }
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    handleQuery();
  }, [query]);

  const selectFileHandler = async () => {
    setWaitingForFile(true);
    let result = await requestFileSelection();
    if (result.error === 1) {
      setWaitingForFile(false);
    } else if (result.error === 0) {
      setSelectedFile(result.data);
      setWaitingForFile(false);
    }
  };
  const keydownEventHandler = useCallback((event: any) => {
    event.preventDefault();
    if (event.key === "Shift" && !modifiers.includes("Shift")) {
      let leftOrRight = event.code.includes("Left") ? "Left" : "Right";
      setModifiers([...modifiers, leftOrRight + "Shift"]);
    } else if (event.key === "Control" && !modifiers.includes("Control")) {
      let leftOrRight = event.code.includes("Left") ? "Left" : "Right";
      setModifiers([...modifiers, leftOrRight + "Control"]);
    } else if (event.key === "Alt" && !modifiers.includes("Alt")) {
      let leftOrRight = event.code.includes("Left") ? "Left" : "Right";
      setModifiers([...modifiers, leftOrRight + "Alt"]);
    } else if (
      event.key &&
      pressedKey !== event.key &&
      !["Control", "Shift", "Alt"].includes(event.key)
    ) {
      // Extract the number key from the code
      if (event.code.includes("Digit")) {
        setPressedKey(event.code.replace("Digit", "Num"));
      } else if (event.code.includes("Key")) {
        setPressedKey(event.code.replace("Key", ""));
      }
    }
  }, []);

  useEffect(() => {
    if (groupItemName === "" && selectedFile) {
      setGroupItemName(selectedFile.name);
    }
  }, [selectedFile]);

  const renderIcon = (groupItem: any) => {
    if (groupItem.type === "keybind") {
      return (
        <KeyboardIcon
          style={{ marginBottom: 10, color: "white", width: 30, height: 30 }}
        />
      );
    }
    let iconSrc = "";
    if (groupItem.type === "file") {
      iconSrc = host + "/icons/" + groupItem.icon;
    } else if (groupItem.type === "link") {
      iconSrc = groupItem.icon;
    }
    return (
      <Image
        src={iconSrc}
        style={{
          marginBottom: 10,
          height: 50,
          width: 50,
          objectFit: "fill"
        }}
      />
    );
  };

  const renderGroupItems = () => {
    return (
      <Grid.Container direction="row" wrap="wrap" gap={1}>
        {props.groupItems.map((groupItem: any, index: number) => {
          return (
            <Grid
              xs={4}
              sm={2}
              md={1}
              key={"groupItem" + index}
              style={{
                aspectRatio: "1/1",
                display: "flex",
                overflow: "hidden"
              }}
            >
              <ButtonBase
                onClick={() => {
                  if (!props.editing) {
                    executeGroupItem(groupItem.id);
                  } else {
                    setRenameModalVisible(true);
                    setEditingGroupItem(groupItem);
                  }
                }}
                style={{
                  borderWidth: 3,
                  borderStyle: "solid",
                  borderRadius: 10,
                  borderColor: "gray",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  flex: 1,
                  overflow: "hidden"
                }}
              >
                {props.editing && (
                  <IconButton
                    onClick={(e) => {
                      // Prevent the button from triggering the parent button
                      e.stopPropagation();

                      setDeleteModalVisible(true);
                      setEditingGroupItem(groupItem);
                    }}
                    color="error"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0
                    }}
                  >
                    <RemoveCircleIcon fontSize="small" />
                  </IconButton>
                )}
                {renderIcon(groupItem)}
                <Text
                  css={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    wordWrap: "normal",
                    width: "calc(100% - 20px)"
                  }}
                >
                  {groupItem.name}
                </Text>
              </ButtonBase>
            </Grid>
          );
        })}
        {props.groupItems.length < 20 && (
          <Grid
            xs={4}
            sm={2}
            md={1}
            style={{
              aspectRatio: "1/1",
              display: "flex"
            }}
          >
            <Button
              onClick={() => {
                setCreateModalVisible(true);
              }}
              style={{
                display: "flex",
                borderWidth: 3,
                borderStyle: "dashed",
                flex: 1,
                borderRadius: 10,
                borderColor: "gray",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <AddIcon style={{ color: "gray" }} />
            </Button>
          </Grid>
        )}
      </Grid.Container>
    );
  };

  const createModalOnClose = () => {
    setCreateModalVisible(false);
    setSelectedFile(null);
    setGroupItemName("");
    setGroupItemUrl("");
    setGroupItemType(new Set(["file"]));
    setModifiers([]);
    setPressedKey("");
  };

  const createGroupItemHandler = async () => {
    const result = await createGroupItem({
      groupId: props.currentGroupId,
      name: groupItemName,
      url: groupItemUrl,
      type: groupItemType.values().next().value,
      selectedFile: selectedFile,
      keybind: modifiers.join("+") + ":" + pressedKey
    });
    if (result.error === 0) {
      createModalOnClose();
      props.getGroupItems(props.currentGroupId);
    }
  };

  const renderGroupItemTypeSelection = () => {
    return (
      <Dropdown>
        <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
          {selectedGroupItemType}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Single selection actions"
          color="primary"
          disallowEmptySelection
          selectionMode="single"
          selectedKeys={groupItemType}
          onSelectionChange={(keys: any) => {
            alert(isMobile);
            // Check if the user is using mobile devices, then show the alert message to tell user to set the keybinding on desktop
            if (keys.has("keybind") && isMobile) {
              alert("Please set the keybinding on desktop");
            } else {
              setGroupItemType(keys as Set<string>);
            }
          }}
        >
          <Dropdown.Item key="file">File</Dropdown.Item>
          <Dropdown.Item key="link">Link</Dropdown.Item>
          <Dropdown.Item key="keybind">Keybind</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderSelectedFile = () => {
    if (!selectedFile) {
      return (
        <Button color="primary" onClick={selectFileHandler}>
          Browse
        </Button>
      );
    } else {
      return (
        <Row align="center" justify="center">
          <Text>{selectedFile.nameWithExtension}</Text>
          <IconButton
            style={{ color: "white" }}
            size="small"
            onClick={() => {
              setSelectedFile(null);
            }}
          >
            <RemoveCircleOutlineIcon fontSize="inherit" />
          </IconButton>
        </Row>
      );
    }
  };

  const renderCreateModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={createModalVisible}
        onClose={createModalOnClose}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Create a new group item
          </Text>
        </Modal.Header>
        <Modal.Body
          style={{
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Grid.Container alignItems="center" gap={2}>
            <Grid xs={4} justify="flex-end">
              <Text>Type</Text>
            </Grid>
            <Grid xs={8} justify="center">
              {renderGroupItemTypeSelection()}
            </Grid>
          </Grid.Container>
          <Grid.Container alignItems="center" gap={2}>
            <Grid xs={4} justify="flex-end">
              <Text>Name</Text>
            </Grid>
            <Grid xs={8} justify="center">
              <Input
                value={groupItemName}
                onChange={(e) => {
                  if (!recordingKeyboard) {
                    setGroupItemName(e.target.value);
                  }
                }}
                clearable
                bordered
                fullWidth
                color="primary"
                size="md"
              />
            </Grid>
          </Grid.Container>
          {renderFileAndUrlModal()}
          {renderKeybindModal()}
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={createModalOnClose}>
            Close
          </Button>
          <Button color="primary" onClick={createGroupItemHandler}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderFileAndUrlModal = () => {
    if (selectedGroupItemType === "file" || selectedGroupItemType === "link") {
      return (
        <>
          <Grid.Container alignItems="center" gap={2}>
            <Grid xs={4} justify="flex-end">
              <Text>
                {selectedGroupItemType === "file" ? "Select File" : "URL"}
              </Text>
            </Grid>
            <Grid xs={8} justify="center">
              {selectedGroupItemType === "file" ? (
                renderSelectedFile()
              ) : (
                <Input
                  onChange={(e) => {
                    setGroupItemUrl(e.target.value);
                  }}
                  clearable
                  bordered
                  fullWidth
                  color="primary"
                  size="md"
                />
              )}
            </Grid>
          </Grid.Container>
        </>
      );
    }
    return null;
  };

  const renderKeybindModal = () => {
    if (selectedGroupItemType !== "keybind") {
      return null;
    }
    const keybindValue = [...modifiers, pressedKey].join("+");
    const buttonText = recordingKeyboard ? "Stop Recording" : "Start Recording";
    const buttonColor = recordingKeyboard ? "error" : "primary";
    return (
      <Grid.Container alignItems="center" gap={2}>
        <Grid xs={4} justify="flex-end">
          <Text>Keybind</Text>
        </Grid>
        <Grid xs={8} justify="center">
          <Input
            readOnly
            value={keybindValue}
            bordered
            fullWidth
            contentRightStyling={false}
          />
        </Grid>
        <Grid xs={12} justify="flex-end" style={{ marginTop: -15 }}>
          <NextButton
            size="xs"
            color={buttonColor}
            onPress={() => {
              if (!recordingKeyboard) {
                setModifiers([]);
                setPressedKey("");
                window.addEventListener("keydown", keydownEventHandler);
              } else {
                window.removeEventListener("keydown", keydownEventHandler);
              }
              setRecordingKeyboard(!recordingKeyboard);
            }}
          >
            {buttonText}
          </NextButton>
        </Grid>
      </Grid.Container>
    );
  };

  const renderWaitingForFileModal = () => {
    return (
      <Modal
        aria-labelledby="waiting-for-file"
        open={waitingForFile}
        preventClose
        onClose={() => {
          setWaitingForFile(false);
        }}
      >
        <Modal.Body>
          <Row align="center" justify="center">
            <Loading />
            <Text style={{ marginLeft: 10 }}>
              Please select file on your PC...
            </Text>
          </Row>
        </Modal.Body>
      </Modal>
    );
  };

  const deleteModalOnClose = () => {
    setDeleteModalVisible(false);
  };

  const renderDeleteModal = () => {
    return (
      <Modal
        closeButton
        blur
        aria-labelledby="confirm-delete"
        open={deleteModalVisible}
        onClose={deleteModalOnClose}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Delete Group Item
          </Text>
        </Modal.Header>
        <Modal.Body style={{ alignItems: "center" }}>
          <Text>Are you sure you want to delete this group item?</Text>
        </Modal.Body>
        <Modal.Footer>
          <NextButton auto flat color="secondary" onPress={deleteModalOnClose}>
            Cancel
          </NextButton>
          <NextButton
            auto
            color="error"
            onPress={async () => {
              let result = await deleteGroupItem(editingGroupItem.id);
              if (result.error === 0) {
                props.getGroupItems(props.currentGroupId);
              }
              setDeleteModalVisible(false);
            }}
          >
            Delete
          </NextButton>
        </Modal.Footer>
      </Modal>
    );
  };

  const renameModalOnClose = () => {
    setRenameModalVisible(false);
  };

  const renameModal = () => {
    return (
      <Modal
        closeButton
        blur
        aria-labelledby="rename-modal"
        open={renameModalVisible}
        onClose={renameModalOnClose}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Rename Item
          </Text>
        </Modal.Header>
        <Modal.Body style={{ alignItems: "center" }}>
          <Input
            placeholder="Item name"
            bordered
            initialValue={editingGroupItem ? editingGroupItem.name : ""}
            onChange={(e) => {
              setEditingGroupItem({
                ...editingGroupItem,
                name: e.target.value
              });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <NextButton auto flat color="secondary" onPress={renameModalOnClose}>
            Cancel
          </NextButton>
          <NextButton
            auto
            color="success"
            onPress={async () => {
              const result = await renameGroupItem(
                editingGroupItem.id,
                editingGroupItem.name
              );
              if (result.error === 0) {
                props.getGroupItems(props.currentGroupId);
              }
              setRenameModalVisible(false);
            }}
          >
            Save
          </NextButton>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <>
      <Card
        variant="bordered"
        css={{
          minHeight: "500px"
        }}
      >
        {renderGroupItems()}
      </Card>
      {renderCreateModal()}
      {renderWaitingForFileModal()}
      {renderDeleteModal()}
      {renameModal()}
    </>
  );
}