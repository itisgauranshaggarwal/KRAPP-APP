import type { Contact, Conversation, Message, User } from '@/types'

const MINUTE = 60 * 1000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

function ago(ms: number): string {
  return new Date(Date.now() - ms).toISOString()
}

/** The signed-in user (mock). */
export const currentUser: User = {
  id: 'me',
  username: 'alex.rivera',
  displayName: 'Alex Rivera',
  email: 'alex@krapp.app',
  avatarUrl: null,
  bio: 'Just here to chat 🎧 · gaming & music',
  online: true,
  lastSeenAt: new Date().toISOString(),
}

export const mockUsers: Record<string, User> = {
  aria: {
    id: 'u-aria',
    username: 'aria',
    displayName: 'Aria Malik',
    avatarUrl: null,
    online: true,
    lastSeenAt: new Date().toISOString(),
  },
  dev: {
    id: 'u-dev',
    username: 'devninja',
    displayName: 'Dev Patel',
    avatarUrl: null,
    online: false,
    lastSeenAt: ago(12 * MINUTE),
  },
  maya: {
    id: 'u-maya',
    username: 'maya_x',
    displayName: 'Maya Chen',
    avatarUrl: null,
    online: true,
    lastSeenAt: new Date().toISOString(),
  },
  sam: {
    id: 'u-sam',
    username: 'sammy',
    displayName: 'Sam Rivera',
    avatarUrl: null,
    online: false,
    lastSeenAt: ago(5 * HOUR),
  },
  noor: {
    id: 'u-noor',
    username: 'noor.exe',
    displayName: 'Noor Hassan',
    avatarUrl: null,
    online: false,
    lastSeenAt: ago(2 * DAY),
  },
  liam: {
    id: 'u-liam',
    username: 'liam_b',
    displayName: 'Liam Brooks',
    avatarUrl: null,
    online: true,
    lastSeenAt: new Date().toISOString(),
  },
}

/** Accepted contacts. */
export const mockContacts: Contact[] = [
  {
    id: 'c-1',
    user: mockUsers.aria!,
    status: 'accepted',
    direction: 'outgoing',
    createdAt: ago(30 * DAY),
  },
  {
    id: 'c-2',
    user: mockUsers.dev!,
    status: 'accepted',
    direction: 'incoming',
    createdAt: ago(21 * DAY),
  },
  {
    id: 'c-3',
    user: mockUsers.maya!,
    status: 'accepted',
    direction: 'outgoing',
    createdAt: ago(10 * DAY),
  },
  {
    id: 'c-4',
    user: mockUsers.sam!,
    status: 'accepted',
    direction: 'incoming',
    createdAt: ago(6 * DAY),
  },
]

/** Incoming requests awaiting accept/reject. */
export const mockIncomingRequests: Contact[] = [
  {
    id: 'r-1',
    user: mockUsers.noor!,
    status: 'pending',
    direction: 'incoming',
    introMessage: 'Hey! Maya said we should connect 👋',
    createdAt: ago(2 * HOUR),
  },
  {
    id: 'r-2',
    user: mockUsers.liam!,
    status: 'pending',
    direction: 'incoming',
    introMessage: 'Yo, it is Liam from the gaming club.',
    createdAt: ago(1 * DAY),
  },
]

/** Requests we sent that are still pending. */
export const mockOutgoingRequests: Contact[] = [
  {
    id: 'r-3',
    user: {
      id: 'u-zoe',
      username: 'zoe.k',
      displayName: 'Zoe Kim',
      avatarUrl: null,
      online: false,
      lastSeenAt: ago(3 * DAY),
    },
    status: 'pending',
    direction: 'outgoing',
    introMessage: 'Hi Zoe, it is me from science class!',
    createdAt: ago(3 * HOUR),
  },
]

function message(
  partial: Omit<Message, 'createdAt' | 'status'> & { createdAt: string; status?: Message['status'] },
): Message {
  return { status: 'seen', ...partial }
}

export const mockMessages: Record<string, Message[]> = {
  'conv-aria': [
    message({
      id: 'm-1',
      conversationId: 'conv-aria',
      senderId: 'u-aria',
      type: 'text',
      content: 'You free later? Want to test that new game.',
      createdAt: ago(3 * HOUR),
    }),
    message({
      id: 'm-2',
      conversationId: 'conv-aria',
      senderId: 'me',
      type: 'text',
      content: 'Yeah after 6 works. Did you finish the project though? 😅',
      createdAt: ago(2 * HOUR + 40 * MINUTE),
    }),
    message({
      id: 'm-3',
      conversationId: 'conv-aria',
      senderId: 'u-aria',
      type: 'text',
      content: 'Almost! Just the notes part left.',
      createdAt: ago(2 * HOUR + 30 * MINUTE),
    }),
    message({
      id: 'm-4',
      conversationId: 'conv-aria',
      senderId: 'me',
      type: 'text',
      content: 'Send it over if you want a second pair of eyes.',
      createdAt: ago(30 * MINUTE),
      status: 'delivered',
    }),
    message({
      id: 'm-5',
      conversationId: 'conv-aria',
      senderId: 'u-aria',
      type: 'text',
      content: 'Legend. I will in a bit 🙌',
      createdAt: ago(2 * MINUTE),
    }),
  ],
  'conv-dev': [
    message({
      id: 'm-6',
      conversationId: 'conv-dev',
      senderId: 'me',
      type: 'text',
      content: 'Push the fix when ready, CI is green again.',
      createdAt: ago(6 * HOUR),
    }),
    message({
      id: 'm-7',
      conversationId: 'conv-dev',
      senderId: 'u-dev',
      type: 'text',
      content: 'On it. Should be done in an hour.',
      createdAt: ago(5 * HOUR + 40 * MINUTE),
    }),
    message({
      id: 'm-8',
      conversationId: 'conv-dev',
      senderId: 'me',
      type: 'text',
      content: 'No rush 👍',
      createdAt: ago(5 * HOUR + 20 * MINUTE),
      status: 'delivered',
    }),
  ],
  'conv-maya': [
    message({
      id: 'm-9',
      conversationId: 'conv-maya',
      senderId: 'u-maya',
      type: 'text',
      content: 'Are we still on for the movie tomorrow?',
      createdAt: ago(1 * DAY + 2 * HOUR),
    }),
    message({
      id: 'm-10',
      conversationId: 'conv-maya',
      senderId: 'me',
      type: 'text',
      content: 'Yes! 7pm right?',
      createdAt: ago(1 * DAY + HOUR),
    }),
    message({
      id: 'm-11',
      conversationId: 'conv-maya',
      senderId: 'u-maya',
      type: 'text',
      content: 'Yup. Bring snacks 🍿',
      createdAt: ago(22 * HOUR),
    }),
  ],
  'conv-sam': [
    message({
      id: 'm-12',
      conversationId: 'conv-sam',
      senderId: 'u-sam',
      type: 'text',
      content: 'Happy birthday!! 🎉',
      createdAt: ago(4 * DAY),
    }),
  ],
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-aria',
    user: mockUsers.aria!,
    lastMessage: mockMessages['conv-aria']!.at(-1),
    unreadCount: 1,
    updatedAt: mockMessages['conv-aria']!.at(-1)!.createdAt,
  },
  {
    id: 'conv-maya',
    user: mockUsers.maya!,
    lastMessage: mockMessages['conv-maya']!.at(-1),
    unreadCount: 0,
    updatedAt: mockMessages['conv-maya']!.at(-1)!.createdAt,
  },
  {
    id: 'conv-dev',
    user: mockUsers.dev!,
    lastMessage: mockMessages['conv-dev']!.at(-1),
    unreadCount: 0,
    updatedAt: mockMessages['conv-dev']!.at(-1)!.createdAt,
  },
  {
    id: 'conv-sam',
    user: mockUsers.sam!,
    lastMessage: mockMessages['conv-sam']!.at(-1),
    unreadCount: 0,
    updatedAt: mockMessages['conv-sam']!.at(-1)!.createdAt,
  },
]

/**
 * Accounts a "new contact" search can find (mock directory). Includes the
 * people already in the user's world, plus strangers who are not yet contacts.
 */
const mockStrangers: User[] = [
  {
    id: 'u-ivy',
    username: 'ivy.codes',
    displayName: 'Ivy Nguyen',
    avatarUrl: null,
    online: true,
    lastSeenAt: new Date().toISOString(),
  },
  {
    id: 'u-theo',
    username: 'theo_p',
    displayName: 'Theo Alvarez',
    avatarUrl: null,
    online: false,
    lastSeenAt: ago(45 * MINUTE),
  },
  {
    id: 'u-june',
    username: 'june.bee',
    displayName: 'June Okafor',
    avatarUrl: null,
    online: false,
    lastSeenAt: ago(8 * HOUR),
  },
  {
    id: 'u-kai',
    username: 'kai_skates',
    displayName: 'Kai Tanaka',
    avatarUrl: null,
    online: true,
    lastSeenAt: new Date().toISOString(),
  },
  {
    id: 'u-rosa',
    username: 'rosa.m',
    displayName: 'Rosa Delgado',
    avatarUrl: null,
    online: false,
    lastSeenAt: ago(2 * DAY),
  },
]

export const mockDirectory: User[] = [...Object.values(mockUsers), ...mockStrangers]
