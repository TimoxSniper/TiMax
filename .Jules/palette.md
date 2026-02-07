## 2026-05-21 - [Dynamic Accessibility Labels]

**Learning:** Static ARIA labels for toggle states (like menu or dark mode) are misleading for screen reader users. The label should reflect the action that will be performed or the new state, and it must be updated dynamically when the state changes.
**Action:** Always use dynamic ARIA labels for buttons that toggle between two states, ensuring they describe the _result_ of clicking the button (e.g., "Close menu" when the menu is already open).
