# CS3 Java Queues Lab · Student Website v2.2

A complete self-paced, six-module Java queues instructional website for Flour Bluff CS3. Host this folder on GitHub Pages. The site uses **only static HTML, CSS, and JavaScript** with a browser-based Java subset interpreter and a self-contained PDF exporter. No API keys, external services, CDN, npm, or backend are required.

## Install on GitHub Pages

1. Create or open a GitHub repository for the activity.
2. Extract the student ZIP and upload its **contents**, including `index.html`, `css/`, `js/`, and the Markdown instructions, into the repository root. Do not upload the teacher ZIP.
3. In GitHub repository Settings → Pages, choose **Deploy from a branch**, `main`, `/ (root)`.
4. Open the GitHub Pages URL and verify that the Java test runner and final PDF download work in your browser.
5. For local preview, serve this directory with `python -m http.server 8000`. Open `http://localhost:8000/`. Opening `index.html` directly via `file://` may block JavaScript modules in some browsers.

## Course sequence

1. **Introduction to Queues:** FIFO, Queue interface and LinkedList, three prediction-based queue manipulation missions, `frontAfter` method.
2. **Queue Operations and Tracing:** Lock a prediction before stepping through code; complete three **required** one-lane parking garage challenges; write `moveFrontToBack`.
3. **Queue Algorithms and Stacks:** Learn the contrast between FIFO and LIFO, compare word lists forwards and backwards, implement `PalinList`.
4. **Implementing IntQueue:** Design and test an ArrayList-backed integer queue, including an explicitly defined custom empty-state sentinel.
5. **Priority Queues and Heaps:** Work through three interactive min-heap challenges and implement **three methods**: `drainNatural`, `sumSmallest`, `processEvents`.
6. **Priority Queue Algorithms:** Discover the minimum-cost strategy through two competing merge plans, an independent optimization challenge, and written reasoning; then write the complete `ArrayReduction` Java class in a blank editor.
7. **Cumulative final assessment (unlocked after all six modules):** 12 multiple-choice questions selected from a 30-question bank (24 points), four two-part code traces (32 points), and two new Java methods (44 points). There is **one graded submission**, with a teacher-controlled reset. A student can download a **multipage PDF assessment report** showing their answers, source code, results, and automatically calculated grade, without an answer key. The final assessment is also included in the JSON export.

Lessons are written to be **complete instruction for students who have never seen these topics**. They do not depend on a separate slide deck or lab handout.

## Completion rules

- Complete each module's interactive activity.
- Pass **all** automated tests for that module's programming challenge.
- Score **100% (5/5)** on its knowledge check. Module checks allow unlimited retries and shuffle selections between attempts.
- Complete the three required parking garage scenarios in Module 2.
- Modules strictly unlock in order. The final assessment unlocks after all six modules are complete.
- Students provide first name and last initial. Progress autosaves to browser localStorage. Use **Export JSON** often; students can later **Import JSON** to restore a backup on another device.

## Important update for users of v1.0

The current JSON schema is **version 3** (the teacher reviewer also supports versions 1 and 2). The student site can import version 1 JSON or migrate a version 1 browser save. Previously passed quizzes scoring only 4/5 no longer satisfy the new 100% rule. Because the activities in Modules 1 and 5 have changed significantly, their interactive completions are reset. Module 5's prior one-method programming completion is also reset; the earlier source is retained as `legacySource` in the migrated JSON. Module 2's newly required parking garage activity must be completed. Other submitted sources and history remain in the record.

## Java execution limitations

The browser executes a documented restricted Java subset, not an arbitrary Java compiler. Refer to `SUPPORTED_JAVA.md`. Student Java programs are tested locally inside the browser, using Web Workers where supported. The interpreter was tested with representative reference implementations of all eight Java assignments (six module programs and two final-assessment methods). Test results are evidence of work, but the teacher should review important solutions.

Client-side exams are **not secure high-stakes testing environments**. Code, scoring logic, and browser data can be inspected or edited by a determined user. For independent classroom assessment, review exported code in the local teacher application.

## Exports and teacher review

- JSON download: `CS3_Queues_First_L_YYYY-MM-DD.json`. Contains `format: CS3-Queues-Student`, `schemaVersion: 3`, `student`, six `modules`, `final`, and `summary` on export.
- PDF download after final assessment submission: `CS3_Queues_Final_First_L_YYYY-MM-DD.pdf`.
- The separate **local-only** teacher reviewer imports version 1, 2, and 3 JSON exports, displays module and final scores, supports teacher-adjusted final points and per-question/program feedback, and exports a grading CSV plus feedback JSON.

## Teacher tools on the student device

The **Teacher** button unlocks preview, module/quiz resets, and a final assessment reset after the teacher enters the classroom code. This is client-side access control, not server authentication. Keep the teacher ZIP and the plaintext code out of the student repository. Preview does not persist progress made while previewing.

## Version 2.1 change: Module 6 discovery before code

Module 6 no longer displays a complete Java algorithm before its programming task. Its required investigation consists of:

1. Test a specified first merge for `[4, 6, 9]`, selecting each pair manually.
2. Solve the same input with a less expensive merge order.
3. Independently achieve the minimum possible cost on `[2, 4, 7, 8]` (the site checks the score after a complete run).
4. Answer five design/boundary questions and explain the strategy in writing.

Only then does the **blank Java editor** unlock. Students write the import, class, method, and algorithm. The investigation's plan records and written reasoning appear in exported JSON and the updated teacher reviewer. In-progress Module 6 discovery autosaves to the browser. A version 1/2 progress import preserves existing student source and scores. Students who have not submitted the final assessment must complete the new discovery activity before Module 6 counts as complete. Already-submitted final assessments remain accessible and are grandfathered as prior work.

## Version 2.2 change: Final multiple-choice question review

The cumulative assessment now draws from a 30-question bank. It selects exactly **one applied/tracing problem and one reasoning/debugging problem from each of the six modules**, for 12 questions total (24 points). Questions are randomized deterministically for each student and answers are shuffled. The prior very simple questions about `String.equals()` and basic method vocabulary have been replaced with queue/heap tracing, FIFO transformations, edge cases, and minimum-cost comparisons. Merge problems define their objective rather than referring to a previous activity without context. Multi-line Java snippets appear as formatted code blocks and are included in the teacher review and student PDF report.

If a student already submitted the final in an earlier version, their existing score and original response snapshot remain unchanged. Incomplete final drafts retain Java solutions and tracing responses but clear the old multiple-choice selections because those prompts have changed. The student must answer the newly selected multiple-choice questions before submitting. Student JSON schemaVersion remains 3.
