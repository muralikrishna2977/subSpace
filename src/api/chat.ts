import { gqlFetch, getWsClient } from "../lib/gql";
import type { Chat, Message } from "../types";

export async function fetchChats(): Promise<Chat[]> {
  const q = `
    query MyChats {
      chats(order_by:{updated_at: desc}) {
        id title user_id created_at updated_at
      }
    }
  `;
  const data = await gqlFetch<{ chats: Chat[] }>(q);
  return data.chats;
}

export async function createChat(title = "New Chat"): Promise<Chat> {
  const m = `
    mutation CreateChat($title:String!) {
      insert_chats_one(object:{title:$title}) {
        id title user_id created_at updated_at
      }
    }
  `;
  const data = await gqlFetch<{ insert_chats_one: Chat }>(m, { title });
  return data.insert_chats_one;
}

export async function fetchMessages(chatId: string): Promise<Message[]> {
  const q = `
    query Messages($chatId: uuid!) {
      messages(where:{chat_id:{_eq:$chatId}}, order_by:{created_at: asc}) {
        id chat_id role content created_at
      }
    }
  `;
  const data = await gqlFetch<{ messages: Message[] }>(q, { chatId });
  return data.messages;
}

export function subscribeMessages(
  chatId: string,
  onNext: (msgs: Message[]) => void,
  onError?: (e: unknown) => void,
) {
  const client = getWsClient();
  return client.subscribe(
    {
      query: `
        subscription Messages($chatId: uuid!) {
          messages(where:{chat_id:{_eq:$chatId}}, order_by:{created_at: asc}) {
            id chat_id role content created_at
          }
        }
      `,
      variables: { chatId },
    },
    {
      next: (payload) => onNext((payload as any).data?.messages ?? []),
      error: (err) => onError?.(err),
      complete: () => {},
    },
  );
}

/** Save user message, call Hasura Action (n8n), assistant reply arrives via subscription */
export async function sendMessageFlow(chatId: string, content: string) {
  // a) insert user message
  await gqlFetch(
    `
    mutation SaveUser($chatId: uuid!, $content: String!) {
      insert_messages_one(object:{chat_id:$chatId, content:$content}) { id }
    }
  `,
    { chatId, content },
  );

  // b) call Hasura Action -> n8n -> OpenRouter -> insert assistant
  const data = await gqlFetch<{ sendMessage: { reply: string } }>(
    `
    mutation Act($chatId: uuid!, $message: String!) {
      sendMessage(chat_id:$chatId, message:$message) { reply }
    }
  `,
    { chatId, message: content },
  );

  // c) Optional: you can show optimistic "assistant is typing…" until sub updates.
  return data.sendMessage.reply;
}
