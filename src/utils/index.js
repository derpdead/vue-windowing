// eslint-disable-next-line import/prefer-default-export
export const getFlattenedItems = (
  items,
  results = {
    flattenedItems: [],
    parents: {},
  },
) => {
  const {
    flattenedItems,
    parents,
  } = results;

  Object.keys(items).forEach((key) => {
    parents[flattenedItems.length] = key;

    if (Array.isArray(items[key])) {
      flattenedItems.push(key, ...items[key]);
    } else {
      const tmpResult = getFlattenedItems(
        items[key],
        {
          flattenedItems: [...flattenedItems, key],
          parents,
        },
      );

      flattenedItems.push(...tmpResult.flattenedItems);
    }
  });

  return {
    flattenedItems,
    parents,
  };
};
