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

export default TouchBar;

export { Clock, CustomText, ScreenSwitcher, MediaControl, VolumeControl };

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
  VOLUME_CONTROL_TYPE
};
