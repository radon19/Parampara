# Arrangement — Ladakh–Spiti shared catalogue

1. The catalogue lives on Swarm. Anyone may read it. Writing is restricted.
2. Paying, publishing, and authorising succession are three jobs: payer (node wallet), publisher (owner key), governance (Safe on Gnosis).
3. Readers start from the Safe address + topic `catalogue-publisher-pointer`. That address does not change when the owner changes. The Safe holds keys, not the catalogue rows.
4. Named new owner: Tenzin Pema, signing identity `0x13b991900a7570bdde9b1e8bf466796bb7b11ffe`. Repeat that same address in `identities.json`.
5. Trigger: succession starts when any one is true: (a) current owner has not answered a written correction request for thirty days; (b) owner sends governance a signed stand-down; (c) at least four of the seven committees vote that the owner cannot continue.
6. After the trigger, Safe owners confirm `setPublisher(incoming)` and the app writes the Swarm pointer. CLI twin: `succeed.ts --incoming <new owner>`. The new owner publishes on `ladakh-spiti-shared-catalogue` with their own key.
7. Storage is a subscription. The payer runs `npm run extend` on a schedule so the existing batch is topped up, not replaced.
8. Honest custody: on a shared Swarm Desktop node every batch belongs to that node's wallet. This arrangement does not split the money. It splits signing authority.

## How the app enforces this

9. Publishing: `/publish` submits only when the connected wallet is the current owner from the live pointer. Anyone else is refused, on screen and on the server. The publisher key writes rows only and can never retarget readers.
10. Succession: `/succeed` refuses the current owner, past owners, and the payer. Only a committee wallet may propose — restrict it further with `COMMITTEE_ADDRESSES`. The new owner arrives as a typed parameter, never from code. The old owner field is fixed to whoever the pointer names.
11. Paying: `/extend` shows the node wallet's live xBZZ balance and warns before it runs dry. Anyone may refill it with their own xBZZ — the tank belongs to the arrangement, not to a person.
