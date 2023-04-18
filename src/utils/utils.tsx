import * as Clock from "@/components/TouchBar/clock";
import * as CustomText from "@/components/TouchBar/customText";
import * as ScreenSwitcher from "@/components/TouchBar/screenSwitcher";
import {
  addHeaderComponent,
  removeHeaderComponent,
  reorderHeaderComponents
} from "@/modules/HeaderModule";
type swapItemReturnType = {
  newArray: Array<any>;
  isModified: boolean;
};

export function swapItem<T>(
  from: number,
  to: number,
  list: Array<T>
): swapItemReturnType {
  if (from === to) return { newArray: list, isModified: false };
  if (from < 0 || to < 0) return { newArray: list, isModified: false };
  // let fromIndex = list.findIndex((item: any) => item.id === from);
  // let toIndex = list.findIndex((item: any) => item.id === to);

  // if (fromIndex === -1 || toIndex === -1)
  //   return { newArray: list, isModified: false };

  let newList = [...list];
  let temp = newList[from];
  newList[from] = newList[to];
  newList[to] = temp;
  return { newArray: newList, isModified: true };
}

export function generateTouchBarComponents(
  components: any[],
  touchBarSettingComponents: any[]
) {
  let _touchBarSettingComponents = [...touchBarSettingComponents];
  let newTouchBarComponents = components.map((component: any) => {
    // Set corresponding touch bar setting component to dummy
    _touchBarSettingComponents.find((tsc: any) => {
      if (tsc.type === component.type) {
        tsc.isDummy = true;
      }
    });
    let width = 0;
    switch (component.type) {
      case "clock":
        width = Clock.CLOCK_WIDTH;
        break;
      case "customText":
        width = CustomText.CUSTOM_TEXT_WIDTH;
        break;
      case "screenSwitcher":
        width = ScreenSwitcher.SCREEN_SWITCHER_WIDTH;
        break;
      default:
        break;
    }
    return {
      id: component.id,
      type: component.type,
      width: width,
      from: "touchBar",
      currentLocation: "touchBar",
      isDummy: false,
      text: component.customInfo
    };
  });
  return {
    touchBarComponents: newTouchBarComponents,
    touchBarSettingComponents: _touchBarSettingComponents
  };
}

export function handleOnDragStartFromSettingToTouchBar(
  dispatch: React.Dispatch<any>,
  component: any
) {
  dispatch({
    currentDraggingComponent: {
      type: component.type,
      width: component.width,
      from: "touchBarSetting",
      currentLocation: "touchBarSetting",
      isDummy: false,
      text: component.text
    }
  });
}

export function handleOnDragStartFromTouchBarToSetting(
  dispatch: React.Dispatch<any>,
  component: any
) {
  dispatch({
    currentDraggingComponent: {
      id: component.id,
      type: component.type,
      width: component.width,
      from: "touchBar",
      currentLocation: "touchBar",
      isDummy: false
    }
  });
}

export function handleOnDragOverFromSettingToTouchBar(
  e: React.DragEvent,
  dispatch: React.Dispatch<any>,
  globalStore: any
) {
  e.preventDefault();
  const currentWidth =
    globalStore.touchBarComponents.reduce((acc: number, component: any) => {
      return acc + component.width;
    }, 0) + globalStore.currentDraggingComponent.width;
  if (currentWidth > globalStore.touchBarWidth && !globalStore.touchBarFull) {
    dispatch({
      touchBarFull: true
    });
  } else if (currentWidth <= globalStore.touchBarWidth) {
    dispatch({
      touchBarFull: false
    });

    if (
      globalStore.currentDraggingComponent.from === "touchBarSetting" &&
      !globalStore.touchBarComponents.find(
        (component: any) => component.isDummy
      )
    ) {
      let touchBarSettingComponents = [
        ...globalStore.touchBarSettingComponents
      ];
      touchBarSettingComponents[
        touchBarSettingComponents.findIndex((component: any) => {
          return component.type === globalStore.currentDraggingComponent.type;
        })
      ].isDummy = true;
      dispatch({
        touchBarComponents: [
          ...globalStore.touchBarComponents,
          { ...globalStore.currentDraggingComponent, isDummy: true }
        ],
        touchBarSettingComponents: touchBarSettingComponents,
        currentDraggingComponent: {
          ...globalStore.currentDraggingComponent,
          currentLocation: "touchBar"
        }
      });
    }
  }
}

export function handleOnDragOverFromTouchBarToSetting(
  e: React.DragEvent,
  dispatch: React.Dispatch<any>,
  globalStore: any
) {
  e.preventDefault();
  if (
    globalStore.touchBarSettingComponents.find(
      (component: any) => component.isDummy
    )
  ) {
    let touchBarSettingComponents = [...globalStore.touchBarSettingComponents];
    touchBarSettingComponents.find((component: any) => {
      return component.type === globalStore.currentDraggingComponent.type;
    }).isDummy = false;

    dispatch({
      touchBarComponents: globalStore.touchBarComponents.filter(
        (component: any) => !component.isDummy
      ),
      touchBarSettingComponents: touchBarSettingComponents,
      currentDraggingComponent: {
        ...globalStore.currentDraggingComponent,
        currentLocation: "touchBarSetting"
      }
    });
  }
}

export async function handleTouchBarComponentsOnDragOver(
  e: React.DragEvent,
  dispatch: React.Dispatch<any>,
  globalStore: any,
  toIndex: number
) {
  e.preventDefault();
  const fromIndex = globalStore.touchBarComponents.findIndex(
    (component: any) =>
      component.type === globalStore.currentDraggingComponent.type
  );
  const { newArray, isModified } = swapItem(
    fromIndex,
    toIndex,
    globalStore.touchBarComponents
  );
  if (isModified) {
    dispatch({
      touchBarComponents: newArray,
      currentDraggingComponent: {
        ...globalStore.currentDraggingComponent,
        index: toIndex
      }
    });
  }
}

export async function handleOnDragEnd(
  e: React.DragEvent,
  dispatch: React.Dispatch<any>,
  globalStore: any
) {
  dispatch({
    touchBarFull: false
  });
  let currentDraggingComponent = globalStore.currentDraggingComponent;
  if (
    currentDraggingComponent.from === currentDraggingComponent.currentLocation
  ) {
    // Call reorder API
    await reorderHeaderComponents(globalStore.touchBarComponents);
    return;
  }

  // touchBarSetting -> touchBar
  if (
    currentDraggingComponent.from === "touchBarSetting" &&
    currentDraggingComponent.currentLocation === "touchBar"
  ) {
    let touchBarComponents = [...globalStore.touchBarComponents];
    let index = touchBarComponents.findIndex((component: any) => {
      return component.type === currentDraggingComponent.type;
    });

    touchBarComponents[index].isDummy = false;
    dispatch({
      touchBarComponents: touchBarComponents
    });

    // Call create header component API
    let result = await addHeaderComponent(
      currentDraggingComponent.type,
      index,
      currentDraggingComponent.text,
      undefined,
      undefined
    );
    console.log(result);
    touchBarComponents[index].id = result.data.id;
    console.log("touchBarComponents", touchBarComponents);
    dispatch({
      touchBarComponents: touchBarComponents
    });
    // Call reorder API
    await reorderHeaderComponents(touchBarComponents);
  }

  // touchBar -> touchBarSetting
  if (
    currentDraggingComponent.from === "touchBar" &&
    currentDraggingComponent.currentLocation === "touchBarSetting"
  ) {
    let touchBarSettingComponents = [...globalStore.touchBarSettingComponents];
    touchBarSettingComponents[
      touchBarSettingComponents.findIndex((component: any) => {
        return component.type === currentDraggingComponent.type;
      })
    ].isDummy = false;
    dispatch({
      touchBarSettingComponents: touchBarSettingComponents,
      touchBarComponents: globalStore.touchBarComponents.filter(
        (component: any) => {
          return component.type !== currentDraggingComponent.type;
        }
      )
    });

    // Call remove header component API
    await removeHeaderComponent(globalStore.currentDraggingComponent.id);
    // Call reorder API
    await reorderHeaderComponents(globalStore.touchBarComponents);
  }
}
