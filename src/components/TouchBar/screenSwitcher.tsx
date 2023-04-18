import { IconButton } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { styled } from "@mui/material/styles";
import { executeHeaderComponent } from "@/modules/HeaderModule";
import Image from "next/image";
export const SCREEN_SWITCHER_WIDTH = 50;
export const TYPE = "screenSwitcher";
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

export default function ScreenSwitcher(props: Props) {
  return (
    <Container
      style={{
        width: SCREEN_SWITCHER_WIDTH,
        justifyContent: "center"
      }}
    >
      <ButtonContainer>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "missionControl"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <Image
            src={require("../../../public/missionControlSymbol.png")}
            width={20}
            height={20}
            alt={"missionControlSymbol"}
          />
        </IconButton>
      </ButtonContainer>
      {/* <ButtonContainer>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "screenSwitcher",
                direction: "left"
              });
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
      <ButtonContainer style={{ marginLeft: 3 }}>
        <IconButton
          disabled={props.disabled}
          onClick={async () => {
            if (!props.disabled) {
              await executeHeaderComponent({
                type: "screenSwitcher",
                direction: "right"
              });
            }
          }}
          style={{ color: "white" }}
          size="small"
        >
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      </ButtonContainer> */}
    </Container>
  );
}
