import React from "react";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { executeHeaderComponent } from "@/modules/HeaderModule";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
export const VOLUME_CONTROL_WIDTH = 120;
export const TYPE = "volumeControl";
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
export default function VolumeControl(props: Props) {
  return (
    <Container
      style={{
        width: VOLUME_CONTROL_WIDTH,
        justifyContent: "center"
      }}
    >
      <ButtonContainer>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "volume",
                action: "mute"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <VolumeMuteIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "volume",
                action: "down"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <VolumeDownIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "volume",
                action: "up"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <VolumeUpIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
    </Container>
  );
}
