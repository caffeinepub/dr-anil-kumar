# Dr. Anil Kumar

## Current State
- Hero section with photo, name, credentials, and "Ask Me Anything" CTA
- Anonymous messaging: visitors send messages stored with a temp user ID (kept in localStorage)
- "My Messages" panel: visible only to the sender on their device, showing messages they sent
- "Connect With Me" card: Instagram-style login form that saves credentials
- Bio section with static info
- Backend: `sendMessage`, `getAllMessages`, `saveCredential`, `getCredentials`

## Requested Changes (Diff)

### Add
- `reply` optional field (Text) on the `Message` type in the backend
- `replyToMessage(messageId, replyText)` backend function to let Dr. Anil post a reply
- Admin panel (password-protected) where Dr. Anil can view all messages and type a reply for each
- "My Messages" panel shows the reply from Dr. Anil beneath each message the sender sent

### Modify
- `getAllMessages` returns messages with the new optional `reply` field
- "My Messages" panel: each message item shows a reply bubble if a reply exists

### Remove
- Nothing removed

## Implementation Plan
1. Update `Message` type in Motoko to include `reply: ?Text`
2. Add `replyToMessage(id: MessageId, reply: Text) : async Bool` function
3. Regenerate backend bindings
4. Add admin panel UI: password-protected (hardcoded admin password), lists all messages, each has a reply textarea + submit button
5. Update "My Messages" panel to display reply bubble when `reply` is set
