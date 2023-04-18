import { useAnimationFrame } from "@/utils/useAnimationFrame";
import { Text, Tooltip } from "@nextui-org/react";
import React from "react";

export const CLOCK_WIDTH = 80;
export const TYPE = "clock";
export default function Clock() {
  const [displayTime, setDisplayTime] = React.useState<string>("");
  useAnimationFrame(() => {
    setDisplayTime(clock());
  });

  const currentDate = () => {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const year =
      date.getFullYear() < 10 ? `0${date.getFullYear()}` : date.getFullYear();
    const week = daysOfWeek[date.getDay()];
    const fullDate = `${year}-${month}-${day} ${week}`;
    return fullDate;
  };

  const clock = () => {
    const date = new Date();
    const hours =
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const seconds =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    const time = `${hours}:${minutes}:${seconds}`;
    return time;
  };
  return (
    <div
      style={{
        width: CLOCK_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
      }}
    >
      <Tooltip content={currentDate()} rounded placement="bottom">
        <Text b color="inherit" hideIn="xs">
          {displayTime}
        </Text>
      </Tooltip>
    </div>
  );
}
