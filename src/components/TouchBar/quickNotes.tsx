import { Typography, TextField, IconButton } from "@mui/material";
import { Input, Modal, Textarea } from "@nextui-org/react";
import { styled } from "@mui/material/styles";
import React from "react";
import { GlobalStoreContext } from "@/store/GlobalStore";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { updateHeaderComponent } from "@/modules/HeaderModule";
import { debounce } from "@/utils/utils";
export const QUICK_NOTES_WIDTH = 50;
export const TYPE = "quickNotes";
const ButtonContainer = styled("div")({
  backgroundColor: "#4B4A54",
  borderRadius: 5
});

const Container = styled("div")({
  flexDirection: "row",
  display: "flex"
});

type Props = {
  id?: number;
  disabled?: boolean;
  text?: string;
};

export default function QuickNotes({ id, disabled, text = "" }: Props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [quickNotes, setQuickNotes] = React.useState<string>(text);
  const { globalStore, dispatch } = React.useContext(GlobalStoreContext);
  const uploadQuickNotes = React.useCallback(
    debounce((quickNotes: string) => {
      let touchBarComponentsCopy = [...globalStore.touchBarComponents];
      const index = touchBarComponentsCopy.findIndex(
        (tsc: any) => tsc.type === TYPE
      );
      touchBarComponentsCopy[index].text = quickNotes;

      dispatch({
        touchBarComponents: touchBarComponentsCopy
      });
      if (id) {
        updateHeaderComponent(id, { customInfo: quickNotes });
      }
    }, 300),
    []
  );

  React.useEffect(() => {
    uploadQuickNotes(quickNotes);
  }, [quickNotes]);

  const renderQuickNotesModal = () => {
    return (
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width={"80%"}
        preventClose={true}
        css={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0,0,0,0.4)"
        }}
      >
        <Modal.Body
          css={{
            backgroundColor: "transparent",
            marginTop: 10
          }}
        >
          <Textarea
            initialValue={text}
            bordered={true}
            rows={30}
            size={"lg"}
            onChange={(e) => {
              setQuickNotes(e.target.value);
            }}
          />
        </Modal.Body>
      </Modal>
    );
  };
  return (
    <Container
      style={{
        width: QUICK_NOTES_WIDTH,
        justifyContent: "center"
      }}
    >
      <ButtonContainer>
        <IconButton
          disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setModalVisible(true);
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <NoteAltIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      {renderQuickNotesModal()}
    </Container>
  );
}
