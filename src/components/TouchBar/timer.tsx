import React from "react";
import styles from "@/styles/TouchBar.module.css";
import { ButtonBase, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import TimerIcon from "@mui/icons-material/Timer";
import AlarmIcon from "@mui/icons-material/Alarm";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ClearIcon from "@mui/icons-material/Clear";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import { Input, Text } from "@nextui-org/react";
import KeyboardIcon from "@mui/icons-material/Keyboard";
export const TIMER_WIDTH = 180;
export const TYPE = "timer";

const ButtonContainer = styled("div")({
  backgroundColor: "#4B4A54",
  borderRadius: 5
});

const Container = styled("div")({
  flexDirection: "row",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: TIMER_WIDTH
});

type Props = {
  disabled?: boolean;
  setAnimation?: (animation: string) => void;
};
export default function Timer(props: Props) {
  const [currentView, setCurrentView] = React.useState("selection");
  const [displayTimer, setDisplayTimer] = React.useState("00:00");
  const [displayAlarm, setDisplayAlarm] = React.useState("00:00");
  const [timerStarted, setTimerStarted] = React.useState(false);
  const [alarmStarted, setAlarmStarted] = React.useState(false);
  const [alarmCustomTimeInput, setAlarmCustomTimeInput] = React.useState("");
  const timerInterval = React.useRef<any>(null);
  const timer = React.useRef<number>(0);
  const alarmTimer = React.useRef<number>(0);
  const alarmInterval = React.useRef<any>(null);
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startTimer = () => {
    setTimerStarted(true);

    timerInterval.current = setInterval(() => {
      timer.current = timer.current + 1;
      setDisplayTimer(formatTime(timer.current));
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerInterval.current);
    setTimerStarted(false);
  };

  const stopTimer = () => {
    clearInterval(timerInterval.current);
    setTimerStarted(false);
    timer.current = 0;
    setDisplayTimer(formatTime(timer.current));
  };

  const renderTimer = () => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Text b color="inherit">
          {displayTimer}
        </Text>
        <div style={{ display: "flex", flexDirection: "row", marginLeft: 10 }}>
          {renderPlayPauseButton()}
          <ButtonContainer style={{ marginLeft: 2 }}>
            <IconButton
              disabled={props.disabled}
              onClick={() => {
                if (!props.disabled) {
                  stopTimer();
                }
              }}
              size="small"
              style={{
                color: "white"
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </ButtonContainer>
          {renderCancelButton()}
        </div>
      </div>
    );
  };

  const renderCancelButton = () => {
    return (
      <ButtonContainer style={{ marginLeft: 2 }}>
        <IconButton
          disabled={props.disabled}
          onClick={() => {
            if (!props.disabled) {
              setCurrentView("selection");
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          <ClearIcon fontSize="small" />
        </IconButton>
      </ButtonContainer>
    );
  };

  const renderSelectionView = () => {
    return (
      <>
        <ButtonContainer>
          <IconButton
            className={`${
              timerStarted || timer.current > 0 ? styles.gradientBorder : ""
            } ${timer.current > 0 && !timerStarted ? styles.paused : ""}`}
            disabled={props.disabled}
            onClick={async () => {
              if (!props.disabled) {
                setCurrentView("timer");
              }
            }}
            size="small"
            style={{
              color: "white"
            }}
          >
            <TimerIcon fontSize="small" />
          </IconButton>
        </ButtonContainer>
        <ButtonContainer style={{ marginLeft: 3 }}>
          <IconButton
            className={`${
              alarmStarted || alarmTimer.current > 0
                ? styles.gradientBorder
                : ""
            } ${alarmTimer.current > 0 && !alarmStarted ? styles.paused : ""}`}
            disabled={props.disabled}
            onClick={async () => {
              if (!props.disabled) {
                if (alarmStarted || alarmTimer.current > 0) {
                  setCurrentView("alarm");
                } else {
                  setCurrentView("alarmTimeSelection");
                }
              }
            }}
            size="small"
            style={{
              color: "white"
            }}
          >
            <AlarmIcon fontSize="small" />
          </IconButton>
        </ButtonContainer>
      </>
    );
  };

  const startAlarm = (seconds: number) => {
    alarmTimer.current = seconds;
    setAlarmStarted(true);
    setCurrentView("alarm");
    alarmInterval.current = setInterval(() => {
      if (alarmTimer.current > 0) {
        alarmTimer.current = alarmTimer.current - 1;
      } else {
        clearInterval(alarmInterval.current);
        if (props.setAnimation) {
          props.setAnimation(`${styles.vibrate} ${styles.gradientBorder}`);
        }
      }
      setDisplayAlarm(formatTime(alarmTimer.current));
    }, 1000);
  };

  const pauseAlarm = () => {
    clearInterval(alarmInterval.current);
    setAlarmStarted(false);
  };

  const stopAlarm = () => {
    clearInterval(alarmInterval.current);
    setAlarmStarted(false);
    alarmTimer.current = 0;
    setDisplayAlarm(formatTime(alarmTimer.current));
    setCurrentView("alarmTimeSelection");
    props.setAnimation && props.setAnimation("");
  };

  const renderAlarmTimeSelection = () => {
    return (
      <>
        <ButtonContainer style={{ marginLeft: alarmStarted ? 2 : 0 }}>
          <ButtonBase
            style={{ width: 30, height: 30 }}
            onClick={() => {
              if (!alarmStarted) {
                startAlarm(5 * 60);
              }
            }}
          >
            <Text>5M</Text>
          </ButtonBase>
        </ButtonContainer>
        <ButtonContainer
          style={{ marginLeft: 2 }}
          onClick={() => {
            if (!alarmStarted) {
              startAlarm(10 * 60);
            }
          }}
        >
          <ButtonBase style={{ width: 30, height: 30 }}>
            <Text>10M</Text>
          </ButtonBase>
        </ButtonContainer>
        <ButtonContainer
          style={{ marginLeft: 2 }}
          onClick={() => {
            if (!alarmStarted) {
              startAlarm(60 * 60);
            }
          }}
        >
          <ButtonBase style={{ width: 30, height: 30 }}>
            <Text>1H</Text>
          </ButtonBase>
        </ButtonContainer>
        <ButtonContainer
          style={{ marginLeft: 2 }}
          onClick={() => {
            setCurrentView("alarmTimeSelectionCustom");
          }}
        >
          <ButtonBase style={{ width: 30, height: 30 }}>
            <KeyboardIcon fontSize="small" />
          </ButtonBase>
        </ButtonContainer>
        {renderCancelButton()}
      </>
    );
  };

  const renderAlarm = () => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <>
          <Text b color="inherit" style={{ marginRight: 5 }}>
            {displayAlarm}
          </Text>
          {renderPlayPauseButton()}
          {renderStopButton()}
          {renderCancelButton()}
        </>
      </div>
    );
  };

  const renderStopButton = () => {
    return (
      <ButtonContainer
        style={{ marginLeft: 2 }}
        onClick={() => {
          stopAlarm();
        }}
      >
        <ButtonBase style={{ width: 30, height: 30 }}>
          <StopIcon fontSize="small" />
        </ButtonBase>
      </ButtonContainer>
    );
  };

  const renderPlayPauseButton = () => {
    let _timerStarted = false;
    if (currentView === "timer") {
      _timerStarted = timerStarted;
    } else if (currentView === "alarm") {
      _timerStarted = alarmStarted;
    }
    return (
      <ButtonContainer>
        <IconButton
          disabled={props.disabled}
          onClick={() => {
            if (!props.disabled) {
              if (currentView === "timer") {
                if (!_timerStarted) {
                  startTimer();
                } else {
                  pauseTimer();
                }
              } else if (currentView === "alarm") {
                if (!_timerStarted) {
                  startAlarm(alarmTimer.current);
                } else {
                  pauseAlarm();
                }
              }
            }
          }}
          size="small"
          style={{
            color: "white"
          }}
        >
          {_timerStarted ? (
            <PauseIcon fontSize="small" />
          ) : (
            <PlayArrowIcon fontSize="small" />
          )}
        </IconButton>
      </ButtonContainer>
    );
  };

  const renderAlarmTimeSelectionCustomView = () => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <Input
          bordered={true}
          size="md"
          animated={false}
          type="time"
          onChange={(e) => {
            setAlarmCustomTimeInput(e.target.value);
          }}
        />
        <ButtonContainer>
          <IconButton
            disabled={props.disabled}
            onClick={() => {
              const time = alarmCustomTimeInput.split(":");
              const seconds = +time[0] * 60 * 60 + +time[1] * 60;
              startAlarm(seconds);
            }}
            size="small"
            style={{
              color: "white"
            }}
          >
            <PlayArrowIcon fontSize="small" />
          </IconButton>
        </ButtonContainer>
        {renderCancelButton()}
      </div>
    );
  };

  const renderViews = () => {
    switch (currentView) {
      case "selection":
        return renderSelectionView();
      case "timer":
        return renderTimer();
      case "alarm":
        return renderAlarm();
      case "alarmTimeSelection":
        return renderAlarmTimeSelection();
      case "alarmTimeSelectionCustom":
        return renderAlarmTimeSelectionCustomView();
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        width: TIMER_WIDTH,
        flexWrap: "nowrap",
        display: "flex",
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10
      }}
    >
      <Container>{renderViews()}</Container>
    </div>
  );
}
