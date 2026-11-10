# Supported Java in the CS3 Queues Lab

This site contains a deliberately **restricted Java interpreter** written in JavaScript. It is **not** a JVM, Java compiler, or remote execution service. The code editor checks six module exercises and two final assessment methods inside the browser; the same source may require additional imports or changes when used in a real Java IDE. Students should still learn standard Java syntax and verify their understanding with their regular Java development environment when appropriate.

## Supported subset

- One Java class per editor; optional `public`, `private`, `protected`, `static`, `final` modifiers; fields, constructors, methods, `return`; Java imports are accepted and ignored (libraries below are simulated).
- Primitive `int`, `boolean`, `double` numeric literals; `String`, `int[]` parameters; objects and `null`; basic integer arithmetic, relational/equality operators, `!`, `&&`, `||`, assignments, `+=`, `-=`, `++`, `--`, array indices and `.length`.
- `if / else`, `while`, enhanced `for (int v : values)`, classic `for (int i = 0; i < n; i++)`, blocks and local variables.
- `new LinkedList<E>()`, `new PriorityQueue<E>()`, `new ArrayList<E>()`, `new Stack<E>()`. The simulator supports `add`, `remove`, `peek`, `isEmpty`, `size`, `get`, `set`, `contains`, `clear`, `push`, `pop` and `toString` where applicable.
- String methods `equals`, `split`, `trim`, `strip`, `isEmpty`, `substring`, `charAt` and `toString`; `Integer.MIN_VALUE` / `Integer.MAX_VALUE`; string concatenation.
- Full-class student solutions for `PalinList` and `IntQueue`, three static methods in the Module 5 priority-queue class, and the two final assessment methods.

## Important differences and boundaries

- Unsupported Java APIs, inheritance, exceptions/try-catch, lambdas, generics beyond collection declarations, floating-point precision/overload rules, and advanced reflection may not work. Consult the assignment starter and examples for permitted syntax.
- `ArrayList<Integer>.remove(0)` removes by **index**, as the exercises require.
- The regular `Queue.remove()` throws when empty, whereas the **custom IntQueue** lab specifically requires `Integer.MIN_VALUE` when empty.
- `PriorityQueue` uses a simulated binary min-heap. Iteration / `toString()` of a priority queue is **not** guaranteed to be sorted in actual Java. Only the minimum exposed by `peek()` or `remove()` should be relied on.
- Arrays passed into the student method are not cloned by the interpreter; the tests check that ArrayReduction does not modify the input array.
- All loops and method calls have execution limits to avoid hangs. The site runs in a Web Worker on GitHub Pages. If a browser does not support it, it falls back to the local interpreter on the main page.
- Because **all grading logic runs in the browser**, students can technically inspect or modify client-side results. JSON exports are evidence of work, not secure or tamper-proof exam submissions. Teachers should review important solutions in the local reviewer.

If the interpreter rejects an otherwise valid advanced Java construct, use the supported subset documented here and report the issue to the teacher. It does not necessarily mean the code is invalid in Java.

## Final assessment behavior (v2.0)

The final is a single graded submission in the browser. Two independent Java methods are tested when students submit. The PDF report is generated locally without any external library or server and includes the submitted code and test outcomes. Graded feedback and partial credit can be assigned after submission in the separate teacher reviewer.
