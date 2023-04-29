import React from "react";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { executeHeaderComponent } from "@/modules/HeaderModule";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import MonitorIcon from "@mui/icons-material/Monitor";
export const SCREEN_SHOT_CONTROL_WIDTH = 100;
export const TYPE = "screenShotControl";
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
export default function ScreenShotControl(props: Props) {
  return (
    <Container
      style={{
        width: SCREEN_SHOT_CONTROL_WIDTH,
        justifyContent: "center"
      }}
    >
      <ButtonContainer>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "screenShot",
                region: "custom"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <ScreenshotMonitorIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "screenShot",
                region: "fullScreen"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <MonitorIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
    </Container>
  );
}
