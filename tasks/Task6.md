# Task 6: Exploiting a Broken Access Control (CTF Challenge)

## Goal of Task 6

In this task, you will attempt to **bypass the authentication mechanisms** of the hardware store backend and retrieve a hidden flag.  
You will encounter a **rate-limited endpoint** that is normally impractical to brute-force – unless you find a hidden way in.

Your challenge:  
**Access a protected resource without proper credentials, and retrieve the secret flag.**

> ⚠️ **Important:** This is a challenge for your own skills.  
> **No help from any LLM or AI tool (e.g., ChatGPT, Copilot, Bard, etc.) is allowed.**  
> Your task is to think like a security analyst – not to prompt like one.

---

## Scenario

The hardware store backend exposes a seemingly simple endpoint that accepts a number and returns feedback.

- The endpoint allows only **10 guesses** before enforcing a **20-second lockout** per IP address.
- If you guess the correct number, a flag will be revealed.
- The number is random and too large to guess reliably.

However, **somewhere in the system**, there may be a **misconfigured backend route** or a logic flaw that unintentionally exposes the correct number. Your task is to discover and exploit it.

---

## Your Mission

1. **Access the web frontend** of the hardware store.
   - Navigate to the special challenge interface.
     - Hint: Try opening `/challenge.html` in your browser.

2. **Try to guess the secret number.**
   - Use the form to submit a number.
   - Observe how the system behaves after 10 attempts.

3. **Search for clues in the codebase.**
   - Investigate the backend logic and routes.
   - Can you find a hidden or undocumented route that exposes the number?

4. **Bypass access controls.**
   - Interact with the backend using browser tools, JavaScript, Postman, or curl.
   - Figure out how the system determines whether a client is allowed to see sensitive information.

5. **Capture the flag.**
   - If you submit the correct number successfully, the system will return a **congratulatory message** and a **flag**.

---

## Additional Learning

To understand the type of vulnerability you're exploiting, read the OWASP page on  
**[Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)**.

Ask yourself:
- Should this route be accessible without authentication?
- How does the backend differentiate between internal and external users?
- What defense mechanisms are missing?

---

## Task Summary

1. Interact with the rate-limited guessing endpoint.
2. Investigate the source code for hidden or undocumented backend functionality.
3. Identify and exploit a **Broken Access Control** vulnerability.
4. Retrieve the secret number.
5. Submit the number to obtain the flag.
6. **Do not use AI tools – rely on your own skills and reasoning.**

---
