import { ref, watch, type Ref } from "vue";
import { storage } from "~/utils/storage";

export function useStorage<T>(key: string, fallback: T): Ref<T> {
  const data = ref<T>(fallback) as Ref<T>;
  let skipNextWatch = false;

  storage
    .get<T>(key)
    .then((value) => {
      skipNextWatch = true;
      data.value = value;
    })
    .catch(() => {
      // Key not in storage — use fallback (first-run scenario)
    });

  watch(data, (newValue) => {
    if (skipNextWatch) {
      skipNextWatch = false;
      return;
    }
    storage.set(key, newValue);
  }, { deep: true });

  return data;
}
