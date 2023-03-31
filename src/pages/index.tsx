import Head from "next/head";
import { Inter } from "next/font/google";
import ProjectHubHeader from "@/components/header";
import ControlPanel from "@/components/controlPanel";
import GroupPanel from "@/components/groupPanel";
import { useEffect, useState } from "react";
import {
  addGroup,
  getGroupItems,
  getGroups
} from "@/modules/ControlPanelModule";
import { Modal, Text, Input, Button, Card } from "@nextui-org/react";
import { Grid, Collapse } from "@mui/material";
import { shutdown, restart } from "@/modules/SystemControlModule";
import { useRouter } from "next/router";
import DesktopAccessDisabledIcon from "@mui/icons-material/DesktopAccessDisabled";

export default function Home({ socketMessage, socket, serverAlive }: any) {
  const router = useRouter();
  const query = router.query;
  const [groups, setGroups] = useState([]);
  const [groupItems, setGroupItems] = useState([]);
  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [currentGroupId, setCurrentGroupId] = useState(1);
  const [editing, setEditing] = useState(false);
  const [groupPanelExpanded, setGroupPanelExpanded] = useState(true);
  const [shutdownModalVisible, setShutdownModalVisible] = useState(false);
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [disconnectedModalVisible, setDisconnectedModalVisible] =
    useState(false);

  const _getGroups = async () => {
    const result = await getGroups();
    if (result.error === 0) {
      setGroups(result.data);
    }
  };

  const _getGroupItems = async (groupId: number) => {
    const result = await getGroupItems(groupId);
    if (result.error === 0) {
      setGroupItems(result.data);
    }
  };

  useEffect(() => {
    _getGroups();
  }, []);

  useEffect(() => {
    setDisconnectedModalVisible(!serverAlive);
  }, [serverAlive]);

  useEffect(() => {
    _getGroupItems(currentGroupId);
  }, [currentGroupId]);

  const onClose = () => {
    setVisible(false);
  };

  const createGroupHandler = async () => {
    let result = await addGroup(groupName);
    if (result.error === 0) {
      _getGroups();
    }
    setVisible(false);
  };

  const renderModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={onClose}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Create a new group
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="Group Name"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={onClose}>
            Close
          </Button>
          <Button auto onPress={createGroupHandler}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const emptyGroup = () => {
    return (
      <Card
        isPressable
        isHoverable
        onClick={() => {
          setVisible(true);
        }}
        variant="bordered"
        css={{
          minHeight: "500px",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card.Body>
          <Text>Click here to add your first group</Text>
        </Card.Body>
      </Card>
    );
  };

  const renderShutdownModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={shutdownModalVisible}
        onClose={() => {
          setShutdownModalVisible(false);
        }}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Shut down your computer?
          </Text>
        </Modal.Header>
        <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => {
              setShutdownModalVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            auto
            onPress={() => {
              shutdown();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderRestartModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="restart-modal"
        open={restartModalVisible}
        onClose={() => {
          setRestartModalVisible(false);
        }}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Restart your computer?
          </Text>
        </Modal.Header>
        <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => {
              setRestartModalVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            auto
            onPress={() => {
              restart();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderDisconnectedModal = () => {
    return (
      <Modal
        aria-labelledby="modal-title"
        preventClose
        blur
        open={disconnectedModalVisible}
        onClose={() => {
          setDisconnectedModalVisible(false);
        }}
      >
        <Modal.Header>
          <DesktopAccessDisabledIcon sx={{ fontSize: 20, marginRight: 0 }} />
          <Text id="modal-title" size={18} style={{ marginLeft: 5 }}>
            Disconnected
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text>Please restart Project Hub server and refresh the page.</Text>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Head>
        <title>Project Hub</title>
        <meta name="description" content="Project Hub Frontend" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProjectHubHeader
        setEditing={setEditing}
        editing={editing}
        setShutdownModalVisible={setShutdownModalVisible}
        socketMessage={socketMessage}
        socket={socket}
        groupPanelExpanded={groupPanelExpanded}
        setGroupPanelExpanded={setGroupPanelExpanded}
        setRestartModalVisible={setRestartModalVisible}
      />
      <Grid
        container
        direction="row"
        style={{
          flex: 1,
          marginTop: 10,
          marginBottom: 24,
          paddingLeft: 24,
          paddingRight: 24
        }}
      >
        {groups.length > 0 ? (
          <>
            <Collapse
              sx={{
                justifyContent: "center"
              }}
              in={groupPanelExpanded}
              orientation="horizontal"
            >
              <GroupPanel
                editing={editing}
                groups={groups}
                setGroupItems={setGroupItems}
                getGroups={_getGroups}
                setCurrentGroupId={setCurrentGroupId}
                setGroupPanelExpanded={setGroupPanelExpanded}
                groupPanelExpanded={groupPanelExpanded}
                showAddGroupModal={() => {
                  setVisible(true);
                }}
              />
            </Collapse>
            <Grid xs item container marginLeft={groupPanelExpanded ? 1 : 0}>
              <ControlPanel
                editing={editing}
                groupItems={groupItems}
                getGroups={_getGroups}
                getGroupItems={_getGroupItems}
                currentGroupId={currentGroupId}
              />
            </Grid>
          </>
        ) : (
          emptyGroup()
        )}
      </Grid>
      {renderModal()}
      {renderShutdownModal()}
      {renderRestartModal()}
      {renderDisconnectedModal()}
    </div>
  );
}
