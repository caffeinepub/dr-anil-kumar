import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Message } from "../backend.d";
import { useActor } from "./useActor";

export function useSaveCredential() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      await actor.saveCredential(username, password);
    },
  });
}

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      tempUserId,
    }: {
      content: string;
      tempUserId: string | null;
    }) => {
      if (!actor) throw new Error("No actor available");
      const returnedId = await actor.sendMessage(content, tempUserId);
      return returnedId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useReplyToMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      replyText,
    }: {
      messageId: bigint;
      replyText: string;
    }) => {
      if (!actor) throw new Error("No actor available");
      const success = await actor.replyToMessage(messageId, replyText);
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}
