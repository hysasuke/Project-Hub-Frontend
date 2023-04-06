import React from "react";
import { Button as MUIButton, Grid } from "@mui/material";
export default function keypad({ socket }: { socket: any }) {
  const buttonLabels = [
    {
      label: "7",
      keyName: "NumPad7"
    },
    {
      label: "8",
      keyName: "NumPad8"
    },
    {
      label: "9",
      keyName: "NumPad9"
    },
    {
      label: "4",
      keyName: "NumPad4"
    },
    {
      label: "5",
      keyName: "NumPad5"
    },
    {
      label: "6",
      keyName: "NumPad6"
    },
    {
      label: "1",
      keyName: "NumPad1"
    },
    {
      label: "2",
      keyName: "NumPad2"
    },
    {
      label: "3",
      keyName: "NumPad3"
    },
    {
      label: "0",
      keyName: "NumPad0"
    },
    {
      label: ".",
      keyName: "Period"
    }
  ];
  const Button = (props: any) => {
    return (
      <MUIButton
        {...props}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 15,
          backgroundColor: props.backgroundColor
            ? props.backgroundColor
            : "transparent",
          border: "1px solid #BBBBBB"
        }}
      />
    );
  };

  const handleButtonOnClick = (key: {
    label: string;
    keyName: string;
    backgroundColor?: string;
  }) => {
    let sendData = {
      type: "keyPress",
      data: { key: key.keyName }
    };
    socket.send(JSON.stringify(sendData));
  };

  const buttons = buttonLabels.map((key) => (
    <Grid xs={key.label === "0" ? 8 : 4} key={key.label}>
      <Button
        variant="contained"
        onClick={() => {
          handleButtonOnClick(key);
        }}
      >
        {key.label}
      </Button>
    </Grid>
  ));

  const renderRightButtons = () => {
    const buttons = [
      {
        label: "+",
        keyName: "Add"
      },
      {
        label: "Enter",
        keyName: "Enter",
        backgroundColor: "rgb(225, 163, 91)"
      }
    ];
    return (
      <Grid container xs direction="column">
        {buttons.map((key) => {
          return (
            <Grid xs key={key.keyName}>
              <Button
                variant="contained"
                backgroundColor={
                  key.backgroundColor ? key.backgroundColor : "transparent"
                }
                onClick={() => {
                  handleButtonOnClick(key);
                }}
              >
                {key.label}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderTopButtons = () => {
    const buttons: any[] = [
      {
        label: "Backspace",
        keyName: "Backspace"
      },
      {
        label: "/",
        keyName: "Divide"
      },
      {
        label: "*",
        keyName: "Multiply"
      },
      {
        label: "-",
        keyName: "Minus"
      }
    ];
    return (
      <Grid container item xs={1}>
        {buttons.map((key) => {
          return (
            <Grid xs={3} key={key.keyName}>
              <Button
                variant="contained"
                backgroundColor={
                  key.backgroundColor ? key.backgroundColor : "transparent"
                }
                onClick={() => {
                  handleButtonOnClick(key);
                }}
              >
                {key.label}
              </Button>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Grid container xs={12} direction="column">
      {renderTopButtons()}
      <Grid container item xs direction="row">
        <Grid container item xs={9}>
          {buttons}
        </Grid>
        <Grid item container xs={3}>
          {renderRightButtons()}
        </Grid>
      </Grid>
    </Grid>
  );
}
