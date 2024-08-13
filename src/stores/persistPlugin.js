function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  }
  return value;
}

function reviver(key, value) {
  if (typeof value === 'object' && value !== null && value.dataType === 'Map') {
    return new Map(value.value);
  }
  return value;
}

export function persistPlugin({ store }) {
  const storedState = localStorage.getItem(store.$id);
  if (storedState) {
    store.$patch(JSON.parse(storedState, reviver));
  }

  store.$subscribe((_, state) => {
    localStorage.setItem(store.$id, JSON.stringify(state, replacer));
  });
}