"use client";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useAuthListener } from "@/hooks/useAuthListener";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
