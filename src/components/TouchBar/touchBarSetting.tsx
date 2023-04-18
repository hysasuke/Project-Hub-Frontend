import { Grid, Typography } from "@mui/material";
import React, { Component } from "react";
import {
  Clock,
  CustomText,
  MediaControl,
  ScreenSwitcher,
  CLOCK_WIDTH,
  SCREEN_SWITCHER_WIDTH,
  CUSTOM_TEXT_WIDTH,
  CLOCK_TYPE,
  CUSTOM_TEXT_TYPE,
  SCREEN_SWITCHER_TYPE,
  MEDIA_CONTROL_TYPE,
  MEDIA_CONTROL_WIDTH,
  VolumeControl,
  VOLUME_CONTROL_TYPE,
  VOLUME_CONTROL_WIDTH
} from "./index";
import { styled } from "@mui/material/styles";

import { GlobalStoreContext } from "@/store/GlobalStore";
import {
  handleOnDragOverFromTouchBarToSetting,
  handleOnDragStartFromSettingToTouchBar,
  handleOnDragEnd
} from "@/utils/utils";

type touchBarSettingProps = {};

const ComponentContainer = styled("div")({
  backgroundColor: "#303030",
  borderRadius: 5,
  paddingTop: 10,
  paddingBottom: 10
});

export default function TouchBarSetting(props: touchBarSettingProps) {
  const { globalStore, dispatch } = React.useContext(GlobalStoreContext);

  const renderComponent = (
    index: number,
    component: React.ReactNode,
    id: string,
    width: number,
    name: string,
    isDummy: boolean,
    text?: string
  ) => {
    return (
      <Grid
        item
        alignItems={"center"}
        container
        direction="column"
        xs={3}
        key={"touchBarSettingComponent" + index}
      >
        <ComponentContainer
          style={{
            width: width,
            opacity: isDummy ? 0 : 1
          }}
          draggable={!isDummy}
          onDragStart={(e) => {
            handleOnDragStartFromSettingToTouchBar(dispatch, {
              index: index,
              type: id,
              width: width,
              from: "touchBarSetting",
              text: text
            });
          }}
          onDragEnd={(e) => {
            handleOnDragEnd(e, dispatch, globalStore);
          }}
        >
          {component}
        </ComponentContainer>
        <Typography>{name}</Typography>
      </Grid>
    );
  };

  const renderTouchBarComponents = () => {
    return globalStore.touchBarSettingComponents.map((tsc: any, index: any) => {
      let component = null;
      let width = 0;
      switch (tsc.type) {
        case CLOCK_TYPE:
          component = <Clock />;
          width = CLOCK_WIDTH;
          break;
        case CUSTOM_TEXT_TYPE:
          component = (
            <CustomText
              text={tsc.text}
              editable={true}
              onChangeText={(text) => {
                let touchBarSettingComponentsCopy = [
                  ...globalStore.touchBarSettingComponents
                ];
                const customTextIndex = touchBarSettingComponentsCopy.findIndex(
                  (tsc: any) => tsc.type === CUSTOM_TEXT_TYPE
                );
                touchBarSettingComponentsCopy[customTextIndex].text = text;
                dispatch({
                  touchBarSettingComponents: touchBarSettingComponentsCopy
                });
              }}
            />
          );
          width = CUSTOM_TEXT_WIDTH;
          break;
        case SCREEN_SWITCHER_TYPE:
          component = <ScreenSwitcher disabled={true} />;
          width = SCREEN_SWITCHER_WIDTH;
          break;
        case MEDIA_CONTROL_TYPE:
          component = <MediaControl disabled={true} />;
          width = MEDIA_CONTROL_WIDTH;
          break;
        case VOLUME_CONTROL_TYPE:
          component = <VolumeControl disabled={true} />;
          width = VOLUME_CONTROL_WIDTH;
          break;
        default:
          component = null;
          break;
      }
      return renderComponent(
        index,
        component,
        tsc.type,
        width,
        tsc.name,
        tsc.isDummy,
        tsc.text
      );
    });
  };

  return (
    <Grid
      container
      columnSpacing={2}
      alignItems={"center"}
      flexWrap={"wrap"}
      rowSpacing={3}
      justifyContent={"space-between"}
      onDragOver={(e) =>
        handleOnDragOverFromTouchBarToSetting(e, dispatch, globalStore)
      }
    >
      {renderTouchBarComponents()}
    </Grid>
  );
}
