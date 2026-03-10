# Dr. Anil Kumar Personal Website

## Current State
The site has all UI in place (hero, anonymous messaging, connect with me, about me, admin panel) but the backend uses `Map.empty()` which is immutable in the Motoko core library. This means `messages.add()` and `credentials.add()` calls are silently no-ops -- data is never actually stored. This explains why anonymous messaging and connect with me appear to work (no errors) but nothing persists.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Backend: Replace `Map.empty()` / mutable map pattern with `HashMap` (which is genuinely mutable) and stable storage arrays for upgrade persistence
- Backend: Fix all data storage so sendMessage, saveCredential, replyToMessage actually persist data

### Remove
- The broken `mo:core/Map` usage

## Implementation Plan
1. Rewrite backend `main.mo` using `HashMap` from `mo:base/HashMap` with stable var arrays for upgrade persistence
2. Keep all existing function signatures identical so frontend code doesn't need to change
3. Validate and deploy
