import React from "react";
import {
  Card,
  Dropdown,
  Grid,
  Input,
  Loading,
  Modal,
  Row,
  Text,
  Image,
  Button as NextButton
} from "@nextui-org/react";
import { ButtonBase, IconButton } from "@mui/material";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import { GlobalStoreContext } from "@/store/GlobalStore";
import HtmlIcon from "@mui/icons-material/Html";
import FileOpenIcon from "@mui/icons-material/FileOpen";
type Props = {
  index: number;
  editing: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  draggable?: boolean;
  onClick?: () => void;
  onClickDelete?: () => void;
  groupItem: any;
};
export default function ControlPanelItem(props: Props) {
  const { globalStore, dispatch } = React.useContext(GlobalStoreContext);
  const [imageError, setImageError] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const host = globalStore.host;
  const renderIcon = (groupItem: any) => {
    let iconSrc = "";
    let ErrorImage = null;
    if (groupItem.type === "keybind") {
      if (groupItem.icon) {
        iconSrc = host + "/icons/" + groupItem.icon;
      } else {
        return (
          <KeyboardIcon
            style={{ marginBottom: 10, color: "white", width: 50, height: 50 }}
          />
        );
      }
    }
    if (groupItem.type === "file") {
      if (imageError) {
        ErrorImage = (
          <FileOpenIcon
            style={{ marginBottom: 10, color: "white", width: 50, height: 50 }}
          />
        );
      }
      iconSrc = host + "/icons/" + groupItem.icon;
    } else if (groupItem.type === "link") {
      if (imageError) {
        ErrorImage = (
          <HtmlIcon
            style={{ marginBottom: 10, color: "white", width: 50, height: 50 }}
          />
        );
      }
      if (groupItem.icon.startsWith("http")) {
        iconSrc = groupItem.icon;
      } else {
        iconSrc = host + "/icons/" + groupItem.icon;
      }
    }

    return imageError ? (
      ErrorImage
    ) : (
      <Image
        src={iconSrc}
        onError={() => {
          setImageError(true);
        }}
        style={{
          marginBottom: 10,
          height: 50,
          width: 50,
          objectFit: "fill"
        }}
      />
    );
  };
  return (
    <Grid
      draggable={props.draggable}
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        if (props.onDragStart) {
          props.onDragStart(e);
        }
        setDragging(true);
      }}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (props.onDragOver) {
          props.onDragOver(e);
        }
      }}
      onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
        if (props.onDragEnd) {
          props.onDragEnd(e);
        }
        setDragging(false);
      }}
      xs={4}
      sm={2}
      md={1}
      style={{
        aspectRatio: "1/1",
        display: "flex",
        overflow: "hidden",
        opacity: dragging ? 0.5 : 1
      }}
    >
      <ButtonBase
        onClick={() => {
          if (props.onClick) {
            props.onClick();
          }
        }}
        style={{
          borderWidth: 3,
          borderStyle: "solid",
          borderRadius: 10,
          borderColor: "gray",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden"
        }}
      >
        {props.editing && (
          <IconButton
            onClick={(e) => {
              // Prevent the button from triggering the parent button
              e.stopPropagation();
              if (props.onClickDelete) {
                props.onClickDelete();
              }
            }}
            color="error"
            style={{
              position: "absolute",
              top: 0,
              right: 0
            }}
          >
            <RemoveCircleIcon fontSize="small" />
          </IconButton>
        )}
        {renderIcon(props.groupItem)}
        <Text
          css={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            wordWrap: "normal",
            width: "calc(100% - 20px)"
          }}
        >
          {props.groupItem.name}
        </Text>
      </ButtonBase>
    </Grid>
  );
}
