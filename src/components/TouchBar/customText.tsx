import { Typography, TextField } from "@mui/material";
import { Input } from "@nextui-org/react";
import React from "react";
export const CUSTOM_TEXT_WIDTH = 110;
export const TYPE = "customText";
type Props = {
  text: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
};
export default function customText({ text, onChangeText, editable }: Props) {
  const [editing, setEditing] = React.useState(false);

  return (
    <div
      onClick={() => {
        if (editable) {
          setEditing(true);
        }
      }}
      style={{
        width: CUSTOM_TEXT_WIDTH,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        display: "flex"
      }}
    >
      {!editing ? (
        <Typography textOverflow={"ellipsis"} overflow={"hidden"}>
          {text}
        </Typography>
      ) : (
        <Input
          style={{
            width: CUSTOM_TEXT_WIDTH,
            textAlign: "center",
            fontSize: 16
          }}
          shadow={false}
          initialValue={text}
          onChange={(e) => {
            if (onChangeText) {
              onChangeText(e.target.value);
            }
          }}
          onBlur={() => {
            setEditing(false);
          }}
        />
      )}
    </div>
  );
}
