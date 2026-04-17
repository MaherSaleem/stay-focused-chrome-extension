import { ref, watch, type Ref } from "vue";
import { chromeStorage } from "~/utils/storage";

export function useStorage<T>(key: string, fallback: T): Ref<T> {
  const data = ref<T>(fallback) as Ref<T>;
  let skipNextWatch = false;

  chromeStorage
    .get<T>(key)
    .then((value) => {
      skipNextWatch = true;
      data.value = value;
    })
    .catch(() => {
      // Key not in chromeStorage — use fallback (first-run scenario)
    });

  watch(
    data,
    (newValue) => {
      if (skipNextWatch) {
        skipNextWatch = false;
        return;
      }
      chromeStorage.set(key, newValue);
    },
    { deep: true },
  );

  return data;
}
