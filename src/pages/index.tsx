import Head from "next/head";
import ProjectHubHeader from "@/components/header";
import ControlPanel from "@/components/controlPanel";
import GroupPanel from "@/components/groupPanel";
import { useEffect, useState, useMemo, useContext } from "react";
import {
  addGroup,
  getGroupItems,
  getGroups
} from "@/modules/ControlPanelModule";
import {
  Modal,
  Text,
  Input,
  Button,
  Card,
  Dropdown,
  Grid as NextGrid,
  Row,
  Loading
} from "@nextui-org/react";
import { Grid, Collapse } from "@mui/material";
import { shutdown, restart } from "@/modules/SystemControlModule";
import { useRouter } from "next/router";
import DesktopAccessDisabledIcon from "@mui/icons-material/DesktopAccessDisabled";
import { GlobalStoreContext } from "@/store/GlobalStore";
import { getHeaderComponents } from "@/modules/HeaderModule";
import { generateTouchBarComponents } from "@/utils/utils";

export default function Home({ socketMessage, socket, serverAlive }: any) {
  const { globalStore, dispatch } = useContext(GlobalStoreContext);
  const router = useRouter();
  const query = router.query;
  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupPanelExpanded, setGroupPanelExpanded] = useState(true);
  const [shutdownModalVisible, setShutdownModalVisible] = useState(false);
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [disconnectedModalVisible, setDisconnectedModalVisible] =
    useState(false);
  const [groupType, setGroupType] = useState(new Set(["group"]));
  const [error, setError] = useState<null | {
    error: boolean;
    data: any;
    message: string;
  }>(null);
  const selectedGroupType = useMemo(
    () => Array.from(groupType).join(", ").replaceAll("_", " "),
    [groupType]
  );

  const _getGroups = async () => {
    dispatch({ loading: true });
    const result = await getGroups();
    dispatch({ loading: false });
    if (result.error === 0) {
      dispatch({ groups: result.data });
    } else {
      setError(result);
    }
  };

  const _getGroupItems = async (groupId: number) => {
    dispatch({ loading: true });
    const result = await getGroupItems(groupId);
    dispatch({ loading: false });
    if (result.error === 0) {
      dispatch({
        groupItems: result.data
      });
    } else {
      setError(result);
    }
  };

  const _getHeaderComponents = async () => {
    const result = await getHeaderComponents();
    if (result.error === 0) {
      let { touchBarComponents, touchBarSettingComponents } =
        generateTouchBarComponents(
          result.data,
          globalStore.touchBarSettingComponents
        );
      dispatch({
        touchBarComponents: touchBarComponents,
        touchBarSettingComponents: touchBarSettingComponents
      });
    }
  };

  useEffect(() => {
    if (socketMessage) {
      socketMessageController(socketMessage);
    }
  }, [socketMessage]);

  const socketMessageController = (message: any) => {
    if (message.type === "updateInfo") {
      switch (message.target) {
        case "group":
          _getGroups();
          break;
        case "groupItem":
          _getGroupItems(globalStore.currentGroupID);
          break;
        case "header":
          _getHeaderComponents();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    _getGroups();
    _getHeaderComponents();
  }, []);

  useEffect(() => {
    setDisconnectedModalVisible(!serverAlive);
  }, [serverAlive]);

  useEffect(() => {
    _getGroupItems(globalStore.currentGroupID);
  }, [globalStore.currentGroupID]);

  const onClose = () => {
    setVisible(false);
    setGroupType(new Set(["group"]));
  };

  const createGroupHandler = async () => {
    let result = await addGroup(groupName, selectedGroupType);
    if (result.error === 0) {
      _getGroups();
    } else {
      setError(result);
    }
    setVisible(false);
  };

  const renderGroupTypeSelection = () => {
    return (
      <Dropdown>
        <Dropdown.Button flat color="primary" css={{ tt: "capitalize" }}>
          {selectedGroupType}
        </Dropdown.Button>
        <Dropdown.Menu
          aria-label="Single selection actions"
          color="primary"
          disallowEmptySelection
          selectionMode="single"
          onSelectionChange={(keys: any) => {
            // Check if the user is using mobile devices, then show the alert message to tell user to set the keybinding on desktop
            setGroupType(keys as Set<string>);
          }}
        >
          <Dropdown.Item key="group">Group</Dropdown.Item>
          <Dropdown.Item key="keypad">Keypad</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
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
          <Grid container alignItems={"center"}>
            <Grid item xs={6} md={6} container justifyContent={"center"}>
              <Text>Type</Text>
            </Grid>
            <Grid item xs={6} md={6}>
              {renderGroupTypeSelection()}
            </Grid>
          </Grid>
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

  const renderErrorModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="Error"
        open={error !== null}
        onClose={onClose}
      >
        <Modal.Header>
          <Text id="error-modal-title" size={18}>
            Error
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Row justify="center">
            <Text>{error?.message}</Text>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            auto
            flat
            color="error"
            onPress={() => {
              setError(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderLoadingModal = () => {
    return (
      <Modal
        preventClose={true}
        aria-labelledby="loading"
        open={globalStore.loading}
        onClose={() => dispatch({ loading: false })}
        width={"100px"}
      >
        <Modal.Body>
          <Loading />
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <>
      <Head>
        <title>Project Hub</title>
        <meta name="description" content="Project Hub Frontend" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProjectHubHeader
        setShutdownModalVisible={setShutdownModalVisible}
        socketMessage={socketMessage}
        socket={socket}
        groupPanelExpanded={groupPanelExpanded}
        setGroupPanelExpanded={setGroupPanelExpanded}
        setRestartModalVisible={setRestartModalVisible}
        setVisible={setVisible}
      />
      <Grid
        container
        style={{
          display: "flex",
          marginTop: 10,
          paddingLeft: 24,
          paddingRight: 24,
          marginBottom: 20,
          flex: 1
        }}
      >
        {globalStore.groups?.length > 0 ? (
          <>
            <NextGrid
              css={{
                height: "100%",
                display: "none",
                marginRight: groupPanelExpanded ? 10 : 0,
                "@xs": {
                  display: "inline"
                }
              }}
            >
              <Collapse
                sx={{
                  justifyContent: "center",
                  height: "100%"
                }}
                in={groupPanelExpanded}
                orientation="horizontal"
              >
                <GroupPanel
                  setGroupPanelExpanded={setGroupPanelExpanded}
                  groupPanelExpanded={groupPanelExpanded}
                  showAddGroupModal={() => {
                    setVisible(true);
                  }}
                  setError={setError}
                />
              </Collapse>
            </NextGrid>
            <Grid xs item container marginLeft={0}>
              <ControlPanel socket={socket} setError={setError} />
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
      {renderErrorModal()}
      {renderLoadingModal()}
    </>
  );
}
