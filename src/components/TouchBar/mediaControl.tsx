import React from "react";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { executeHeaderComponent } from "@/modules/HeaderModule";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
export const MEDIA_CONTROL_WIDTH = 150;
export const TYPE = "mediaControl";
const ButtonContainer = styled("div")({
  backgroundColor: "#4B4A54",
  borderRadius: 5
});

const Container = styled("div")({
  flexDirection: "row",
  display: "flex"
});

type Props = {
  disabled?: boolean;
};
export default function MediaControl(props: Props) {
  return (
    <Container
      style={{
        width: MEDIA_CONTROL_WIDTH,
        justifyContent: "center"
      }}
    >
      <ButtonContainer>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "mediaControl",
                action: "previous"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <SkipPreviousIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "mediaControl",
                action: "play"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <PlayArrowIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "mediaControl",
                action: "pause"
              });
            }
          }}
          style={{ color: "white" }}
          size="small"
        >
          <PauseIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "mediaControl",
                action: "next"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <SkipNextIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
    </Container>
  );
}
