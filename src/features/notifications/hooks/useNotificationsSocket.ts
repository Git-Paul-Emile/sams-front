import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "../../../services/httpClient";
import { notificationsKeys } from "./useNotificationsQueries";

const SOCKET_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1").replace(/\/api\/v1\/?$/, "");

export function useNotificationsSocket(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const socket = io(SOCKET_URL, {
      auth: (cb) => cb({ token: getAccessToken() }),
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("notif:created", () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    });

    return () => {
      socket.disconnect();
    };
  }, [enabled, queryClient]);
}
