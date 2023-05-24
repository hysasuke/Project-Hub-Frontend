// Export all touch bar components
import TouchBar from "./touchBar";
import Clock, { CLOCK_WIDTH, TYPE as CLOCK_TYPE } from "./clock";
import CustomText, {
  CUSTOM_TEXT_WIDTH,
  TYPE as CUSTOM_TEXT_TYPE
} from "./customText";
import ScreenSwitcher, {
  SCREEN_SWITCHER_WIDTH,
  TYPE as SCREEN_SWITCHER_TYPE
} from "./screenSwitcher";

import MediaControl, {
  MEDIA_CONTROL_WIDTH,
  TYPE as MEDIA_CONTROL_TYPE
} from "./mediaControl";

import VolumeControl, {
  VOLUME_CONTROL_WIDTH,
  TYPE as VOLUME_CONTROL_TYPE
} from "./volumeControl";

import ScreenShotControl, {
  SCREEN_SHOT_CONTROL_WIDTH,
  TYPE as SCREEN_SHOT_CONTROL_TYPE
} from "./screenShotControl";

import QuickNotes, {
  QUICK_NOTES_WIDTH,
  TYPE as QUICK_NOTES_TYPE
} from "./quickNotes";

import Timer, { TIMER_WIDTH, TYPE as TIMER_TYPE } from "./timer";

export const ComponentWidthMap: {
  [key: string]: number;
} = {
  [CLOCK_TYPE]: CLOCK_WIDTH,
  [CUSTOM_TEXT_TYPE]: CUSTOM_TEXT_WIDTH,
  [SCREEN_SWITCHER_TYPE]: SCREEN_SWITCHER_WIDTH,
  [MEDIA_CONTROL_TYPE]: MEDIA_CONTROL_WIDTH,
  [VOLUME_CONTROL_TYPE]: VOLUME_CONTROL_WIDTH,
  [TIMER_TYPE]: TIMER_WIDTH,
  [SCREEN_SHOT_CONTROL_TYPE]: SCREEN_SHOT_CONTROL_WIDTH,
  [QUICK_NOTES_TYPE]: QUICK_NOTES_WIDTH
};
export default TouchBar;

export {
  Clock,
  CustomText,
  ScreenSwitcher,
  MediaControl,
  VolumeControl,
  Timer,
  ScreenShotControl,
  QuickNotes
};

export {
  CLOCK_WIDTH,
  SCREEN_SWITCHER_WIDTH,
  CUSTOM_TEXT_WIDTH,
  CLOCK_TYPE,
  CUSTOM_TEXT_TYPE,
  SCREEN_SWITCHER_TYPE,
  MEDIA_CONTROL_WIDTH,
  MEDIA_CONTROL_TYPE,
  VOLUME_CONTROL_WIDTH,
  VOLUME_CONTROL_TYPE,
  TIMER_TYPE,
  TIMER_WIDTH,
  SCREEN_SHOT_CONTROL_WIDTH,
  SCREEN_SHOT_CONTROL_TYPE,
  QUICK_NOTES_WIDTH,
  QUICK_NOTES_TYPE
};
