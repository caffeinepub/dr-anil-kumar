# Dr. Anil Kumar - Personal Index Page

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Personal index/landing page for Dr. Anil Kumar
  - Name, credentials (MBBS from CIMS Bilaspur, MD General Medicine from CIMS)
  - Identity as part-time gamer and tech enthusiast
  - Hero/profile section
- Anonymous messaging feature
  - A prominent "Ask Me Anything" / "Send Anonymous Message" button
  - A message form (textarea + send button)
  - Backend stores each message with a temporary/anonymous user ID (auto-generated per session)
  - No login required for senders
- Admin view (basic): Dr. Anil Kumar can view messages sent to him

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend (Motoko):
   - Data model: `AnonymousMessage { id; tempUserId; content; timestamp }`
   - `sendMessage(content: Text) : async Text` -- creates temp user ID if none, stores message, returns tempUserId
   - `getMessages() : async [AnonymousMessage]` -- returns all messages (admin use)
   - Temp user tracking: generate a UUID-like ID per call or allow frontend to pass/store one in localStorage

2. Frontend:
   - Landing page with profile hero section (name, credentials, gamer/tech bio)
   - "Ask Me Anything" button that opens a message dialog/modal
   - Anonymous message form with textarea and submit
   - Success state after sending
   - Simple messages inbox view (behind a toggle/button for admin)
