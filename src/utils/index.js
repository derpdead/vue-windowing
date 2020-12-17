// eslint-disable-next-line import/prefer-default-export
export const getFlattenedItems = ({
  items,
  level = 0,
}) => {
  const flattenedItems = [];

  items.forEach((item) => {
    const { children = [], ...rest } = item;

    flattenedItems.push({
      ...rest,
      level,
    });

    flattenedItems.push(...getFlattenedItems({ items: children, level: level + 1 }));
  });

  return flattenedItems;
};

export const getExpandingFlattenedItems = ({
  items,
  expanded,
  level = 0,
  rootId = null,
  rootIndex = 0,
}) => {
  const flattenedItems = [];

  items.forEach((item) => {
    const { children = [], ...rest } = item;

    const isExpanded = typeof expanded === 'object'
      ? expanded[rest.id]
      : expanded;

    flattenedItems.push({
      ...rest,
      level,
      expanded: isExpanded,
      rootId,
      rootIndex,
    });

    flattenedItems.push(...getExpandingFlattenedItems({
      items: children,
      expanded,
      level: level + 1,
      rootId: rest.id,
      rootIndex: flattenedItems.length,
    }));
  });

  return flattenedItems;
};
