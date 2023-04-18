import {
  Card,
  Text,
  Button,
  Link,
  Modal,
  Input,
  Grid
} from "@nextui-org/react";
import React from "react";
import {
  deleteGroup,
  getGroupItems,
  renameGroup,
  reorderGroups
} from "@/modules/ControlPanelModule";
import {
  IconButton,
  ButtonBase,
  Button as MuiButton,
  Box
} from "@mui/material";
import RemoveCircle from "@mui/icons-material/RemoveCircle";
import AddIcon from "@mui/icons-material/Add";
import { swapItem } from "@/utils/utils";
export default function GroupPanel(props: any) {
  const [currentGroupId, setCurrentGroupId] = React.useState(1);
  const [renameModalVisible, setRenameModalVisible] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [currentDraggingIndex, setCurrentDraggingIndex] = React.useState(-1);
  const [groups, setGroups] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (props.groups && props.groups.length > 0) {
      setCurrentGroupId(props.groups[0].id);
      setGroups(props.groups);
      props.setCurrentGroupId(props.groups[0].id);
      props.setCurrentGroup(props.groups[0]);
    }
  }, [props.groups]);

  const handleChangeGroup = async (group: any) => {
    let id = group.id;
    setCurrentGroupId(id);
    props.setCurrentGroupId(id);
    props.setCurrentGroup(group);
  };
  const renderGroups = () => {
    return groups.map((group: any, index: number) => {
      return (
        <ButtonBase
          draggable={props.editing}
          onDragStart={(e) => {
            setCurrentDraggingIndex(index);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            const { newArray, isModified } = swapItem(
              currentDraggingIndex,
              index,
              groups
            );
            if (isModified) {
              setCurrentDraggingIndex(index);
              setGroups(newArray);
            }
          }}
          onDragEnd={async (e) => {
            setCurrentDraggingIndex(-1);
            await reorderGroups(groups);
          }}
          key={"group-" + group.id}
          onClick={() => {
            if (!props.editing) {
              handleChangeGroup(group);
            } else {
              setRenameModalVisible(true);
              setEditingGroup(group);
            }
          }}
          style={{
            borderWidth: 0,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            height: "10%"
          }}
        >
          <Text color={currentGroupId === group.id ? "primary" : "none"}>
            {group.name}
          </Text>
          {props.editing && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModalVisible(true);
                setEditingGroup(group);
              }}
              color="error"
              style={{
                position: "absolute",
                top: -10,
                right: -10
              }}
            >
              <RemoveCircle fontSize="small" />
            </IconButton>
          )}
        </ButtonBase>
      );
    });
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
            Rename Group
          </Text>
        </Modal.Header>
        <Modal.Body style={{ alignItems: "center" }}>
          <Input
            placeholder="Group name"
            bordered
            initialValue={editingGroup ? editingGroup.name : ""}
            onChange={(e) => {
              setEditingGroup({
                ...editingGroup,
                name: e.target.value
              });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="secondary" onPress={renameModalOnClose}>
            Cancel
          </Button>
          <Button
            auto
            color="success"
            onPress={async () => {
              const result = await renameGroup(
                editingGroup.id,
                editingGroup.name
              );
              if (result.error === 0) {
                props.getGroups();
              }
              setRenameModalVisible(false);
            }}
          >
            Save
          </Button>
        </Modal.Footer>
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
            Delete Group
          </Text>
        </Modal.Header>
        <Modal.Body style={{ alignItems: "center" }}>
          <Text>Are you sure you want to delete this group?</Text>
          <Text color="warning">
            This will delete all items in the group as well
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="secondary" onPress={deleteModalOnClose}>
            Cancel
          </Button>
          <Button
            auto
            color="error"
            onPress={async () => {
              let result = await deleteGroup(editingGroup.id);
              if (result.error === 0) {
                props.getGroups(props.currentGroupId);
              }
              setDeleteModalVisible(false);
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <>
      <Card
        variant="bordered"
        css={{
          minHeight: "500px",
          justifyContent: "center",
          width: "100%",
          height: "100%"
        }}
      >
        <Card.Body
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            overflow: "hidden"
          }}
        >
          {renderGroups()}
          <Grid>
            <MuiButton
              onClick={() => {
                props.showAddGroupModal();
              }}
              style={{
                display: "flex",
                borderWidth: 3,
                borderStyle: "dashed",
                borderRadius: 10,
                borderColor: "gray",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent"
              }}
            >
              <AddIcon style={{ color: "gray" }} />
            </MuiButton>
          </Grid>
        </Card.Body>
      </Card>
      {renameModal()}
      {renderDeleteModal()}
    </>
  );
}
