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
  let fromIndex = list.findIndex((item: any) => item.id === from);
  let toIndex = list.findIndex((item: any) => item.id === to);
  if (fromIndex === -1 || toIndex === -1)
    return { newArray: list, isModified: false };

  let newList = [...list];
  let temp = newList[fromIndex];
  newList[fromIndex] = newList[toIndex];
  newList[toIndex] = temp;
  return { newArray: newList, isModified: true };
}
