# MindMate AI

GuideAI guided learning, StudyBuddy matching and MindMate learning modes in one local web app. Requires Node.js 22+. No external package installation needed.

Run START-MINDMATE.cmd or npm start, then open the printed URL. START-GUIDEAI.cmd remains compatible. See HOW-TO-RUN.txt for configuration and troubleshooting. Missing .env no longer prevents startup.

## Features

- Teacher, Mentor and Study Buddy modes; progressive hints, reasoning checks, teach-back, recaps and suggestions to switch modes when stuck.
- Built-in guided lessons, difficulty-based MCQ practice and materials for linear equations, speed/motion and loops/accumulation.
- Optional live AI conversations for other subjects, coding guidance, viva interviews, open-ended practice, text explanations and question-image transcription.
- Notes, summaries, flashcards, revision sheets, key concepts, practice questions and text mind maps. Text/Markdown input; PDF/Word parsing is not included.
- Study planner weighted by exam proximity, difficulty, weak areas, available time and progress. Use the rebalancing button to update unfinished work.
- Focus timer, session summaries, progress, XP, levels, achievements, streaks and activity-based recommendations.
- Opt-in profile discovery and matching by subject/topic/course/goals/level/availability/preference.
- Invitation-based rooms: group chat, shared AI, conflict-checked notes, synchronized 25/5 timer, goals and built-in quiz rounds with scores and weak-topic feedback.
- Browser history migration from original GuideAI memory, exports and deletion controls.

## Feature boundaries

This is a runnable local prototype, not a deployed service. Everyone in a shared room must reach the same server; localhost invitations work only on this computer. Browser profiles have no email/password recovery or cross-device account sync. Use separate browsers/private windows for test participants.

Automatic built-in answer grading and group quizzes cover three topics. Other practice formats, coding and viva use live conversation rather than a secure code runner or formal grading engine. Arbitrary-topic AI-generated quiz battles are not implemented. Custom flashcards are generated text; built-in flashcards have an interactive viewer. The planner uses deterministic scheduling. Analytics reflect recorded local activity, not inferred mastery or complete longitudinal predictions. Voice interviews, calendar notifications, graphical mind maps and production hosting are not included.

Personal learning state persists in the browser only with memory enabled. Social data is saved in data/mindmate.json. The single-process JSON store is for local use, not production concurrency. Clearing cookies loses access to that browser profile; export first. Shared notes can retain contributions after a participant leaves.

## Optional AI

Set OPENAI_API_KEY in .env; use .env.example as a template. The server handles AI requests and does not serve the key to browsers. Live AI requires network access and API credits. A key-configured badge does not verify API availability. Errors appear without invented AI results. Learner content submitted to live AI leaves the local machine. Coding-assistant subscription quotas are separate.

## Verification

Run npm test for tutor/learning tests and a two-session HTTP integration scenario covering room authorization, matching, invitations, notes conflicts, host permissions, quizzes and persistence. It uses temporary storage and port 3147. No paid AI calls are made by tests. Syntax checks: node --check server.js and node --check public/app.js.

Keep .env, data/ and backups private. Stop the app before backing up data.
