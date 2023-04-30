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
  getGroups,
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
import { GlobalStoreContext } from "@/store/GlobalStore";
export default function GroupPanel(props: any) {
  const { globalStore, dispatch } = React.useContext(GlobalStoreContext);
  const [renameModalVisible, setRenameModalVisible] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [currentDraggingIndex, setCurrentDraggingIndex] = React.useState(-1);
  React.useEffect(() => {
    if (globalStore.groups && globalStore.groups.length > 0) {
      dispatch({ currentGroupID: globalStore.groups[0].id });
      dispatch({ currentGroup: globalStore.groups[0] });
    }
  }, [globalStore.groups]);

  const handleChangeGroup = async (group: any) => {
    let id = group.id;
    dispatch({ currentGroupID: id, currentGroup: group });
  };

  const renderGroups = () => {
    return globalStore.groups.map((group: any, index: number) => {
      return (
        <ButtonBase
          draggable={globalStore.editing}
          onDragStart={(e) => {
            setCurrentDraggingIndex(index);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            const { newArray, isModified } = swapItem(
              currentDraggingIndex,
              index,
              globalStore.groups
            );
            if (isModified) {
              setCurrentDraggingIndex(index);
              dispatch({ groups: newArray });
            }
          }}
          onDragEnd={async (e) => {
            setCurrentDraggingIndex(-1);
            await reorderGroups(globalStore.groups);
          }}
          key={"group-" + group.id}
          onClick={() => {
            if (!globalStore.editing) {
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
          <Text
            color={globalStore.currentGroupID === group.id ? "primary" : "none"}
          >
            {group.name}
          </Text>
          {globalStore.editing && (
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
                let getGroupsResult = await getGroups();
                if (getGroupsResult.error === 0) {
                  dispatch({ groups: getGroupsResult.data });
                }
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
                let getGroupsResult = await getGroups();
                if (getGroupsResult.error === 0) {
                  dispatch({ groups: getGroupsResult.data });
                }
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
