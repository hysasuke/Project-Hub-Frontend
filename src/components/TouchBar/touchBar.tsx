import styles from "@/styles/TouchBar.module.css";
import React from "react";
import { Button, Grid, Slider } from "@mui/material";
import ScreenSwitcher from "./screenSwitcher";
import Clock from "./clock";
import CustomText from "./customText";
import VolumeControl from "./volumeControl";
import { GlobalStoreContext } from "@/store/GlobalStore";
import {
  generateTouchBarComponents,
  handleOnDragEnd,
  handleOnDragOverFromSettingToTouchBar,
  handleOnDragStartFromTouchBarToSetting,
  handleTouchBarComponentsOnDragOver
} from "@/utils/utils";
import { styled } from "@mui/material/styles";
import { getHeaderComponents } from "@/modules/HeaderModule";
import MediaControl from "./mediaControl";
import Timer from "./timer";
import ScreenShotControl from "./screenShotControl";
import QuickNotes from "./quickNotes";
const ComponentContainer = styled("div")({
  borderRadius: 5,
  height: "100%",
  display: "flex",
  alignItems: "center"
});

type Props = {
  editing?: boolean;
};
function TouchBar(props: Props) {
  const { globalStore, dispatch } = React.useContext(GlobalStoreContext);
  const touchBarRef = React.useRef<HTMLDivElement>(null);

  const [animation, setAnimation] = React.useState("");

  // React.useEffect(() => {
  //   const _getHeaderComponents = async () => {
  //     const result = await getHeaderComponents();
  //     if (result.error === 0) {
  //       let { touchBarComponents, touchBarSettingComponents } =
  //         generateTouchBarComponents(
  //           result.data,
  //           globalStore.touchBarSettingComponents
  //         );
  //       dispatch({
  //         touchBarComponents: touchBarComponents,
  //         touchBarSettingComponents: touchBarSettingComponents
  //       });
  //     }
  //   };
  //   _getHeaderComponents();
  // }, []);

  React.useEffect(() => {
    if (touchBarRef.current) {
      dispatch({
        touchBarWidth: touchBarRef.current.offsetWidth
      });
    }
  }, [touchBarRef]);

  React.useEffect(() => {
    if (globalStore.touchBarFull) {
      setAnimation(styles.shake);
    } else {
      if (animation === styles.shake) {
        setAnimation("");
      }
    }
  }, [globalStore.touchBarFull]);

  const getTouchBarComponent = (
    id: number,
    type: string,
    isDummy: boolean,
    text?: string
  ) => {
    if (isDummy) {
      return (
        <ComponentContainer
          style={{
            width: globalStore.currentDraggingComponent.width,
            backgroundColor: "#2b2b2b",
            height: 30
          }}
        />
      );
    } else {
      switch (type) {
        case "clock":
          return <Clock />;
        case "customText":
          return <CustomText text={text ? text : ""} editable={false} />;
        case "screenSwitcher":
          return <ScreenSwitcher disabled={false} />;
        case "mediaControl":
          return <MediaControl disabled={false} />;
        case "volumeControl":
          return <VolumeControl disabled={false} />;
        case "timer":
          return <Timer disabled={false} setAnimation={setAnimation} />;
        case "screenShotControl":
          return <ScreenShotControl disabled={false} />;
        case "quickNotes":
          return <QuickNotes id={id} disabled={false} text={text} />;
        default:
          return null;
      }
    }
  };

  const renderTouchBarComponents = () => {
    return globalStore.touchBarComponents.map(
      (component: any, index: number) => {
        console.log(component);
        return (
          <ComponentContainer
            key={"touchBarComponent:" + index}
            draggable={props.editing}
            onDragStart={(e) => {
              handleOnDragStartFromTouchBarToSetting(dispatch, {
                id: component.id,
                index: index,
                type: component.type,
                width: component.width,
                from: "touchBar"
              });
            }}
            onDragOver={(e) => {
              handleTouchBarComponentsOnDragOver(
                e,
                dispatch,
                globalStore,
                index
              );
            }}
            onDragEnd={(e) => {
              handleOnDragEnd(e, dispatch, globalStore);
            }}
          >
            {getTouchBarComponent(
              component.id,
              component.type,
              component.isDummy,
              component.text
            )}
          </ComponentContainer>
        );
      }
    );
  };

  return (
    <Grid
      ref={touchBarRef}
      container
      flexDirection="row"
      alignItems={"center"}
      height={50}
      paddingLeft={1}
      paddingRight={1}
      style={{
        backgroundColor: props.editing ? "#303030" : "transparent",
        borderRadius: 10
      }}
      onDragOver={(e) =>
        handleOnDragOverFromSettingToTouchBar(e, dispatch, globalStore)
      }
      className={animation}
    >
      {renderTouchBarComponents()}
    </Grid>
  );
}

export default TouchBar;
