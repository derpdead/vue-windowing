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
      childrenLength: children.length,
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
  groupId = null,
  rootIndex = 0,
}) => {
  const flattenedItems = [];

  items.forEach((item) => {
    const { children = [], ...rest } = item;

    const isExpanded = Boolean(typeof expanded === 'object'
      ? expanded[rest.id]
      : expanded);

    const mappedGroupId = level === 0
      ? rest.id
      : groupId;

    flattenedItems.push({
      ...rest,
      level,
      expanded: isExpanded,
      groupId: mappedGroupId,
      rootId,
      rootIndex,
      childrenLength: children.length,
    });

    flattenedItems.push(...getExpandingFlattenedItems({
      items: children,
      expanded,
      level: level + 1,
      groupId: mappedGroupId,
      rootId: rest.id,
      rootIndex: flattenedItems.length,
    }));
  });

  return flattenedItems;
};
