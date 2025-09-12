import { useCallback } from "react";

export function toast(msg: string) {
  if (typeof window !== "undefined") {
    window.alert(msg);
  }
}

export function useToast() {
  return useCallback((msg: string) => {
    toast(msg);
  }, []);
}
