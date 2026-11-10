import {seededShuffle,seedFor} from './content.mjs';
// Cumulative final: draw one applied question and one reasoning question from each of six modules.
// The complete 30-question bank is randomized consistently for each student.
// Question IDs differ from v2.1 so older in-progress answer selections cannot be graded against a new prompt.
const QUESTIONS = [
  {topic:'FIFO queue operations', applied:[
    {id:'fifoT1',prompt:'A FIFO queue starts [4, 9, 4] from front to rear. What is its final state?',code:`q.add(q.remove());
q.add(2);
q.remove();`,options:['[4, 4, 2]','[9, 4, 2]','[4, 2, 9]','[9, 4, 4, 2]'],correct:0},
    {id:'fifoT2',prompt:'The queue initially contains [3, 6, 9]. Which statement about x, y, and the remaining queue is correct?',code:`int x = q.peek();
q.add(q.remove());
int y = q.remove();`,options:['x = 3; y = 6; queue = [9, 3]','x = 3; y = 3; queue = [6, 9]','x = 6; y = 9; queue = [3]','x = 3; y = 9; queue = [6, 3]'],correct:0},
    {id:'fifoT3',prompt:'The queue starts [5, 7, 2]. Which state results after the statement executes? Remember that Java evaluates method arguments before calling add.',code:`q.add(q.remove() + q.peek());`,options:['[7, 2, 12]','[7, 2, 10]','[5, 7, 2, 12]','[7, 2, 7]'],correct:0}
  ], reasoning:[
    {id:'fifoR1',prompt:'You start with q = [2, 7]. Which sequence results in [7, 2, 2] without directly replacing the queue?',options:['q.add(q.peek()); q.add(q.remove());','q.add(q.remove()); q.add(q.peek());','q.remove(); q.add(2);','q.add(2); q.remove();'],correct:0},
    {id:'fifoR2',prompt:'For an initially empty Queue<Integer> implemented by LinkedList, what are first, next, and the final queue size?',code:`Integer first = q.peek();
q.add(5);
int next = q.remove();`,options:['first = null; next = 5; size = 0','first = 0; next = 5; size = 0','first = null; next = 5; size = 1','An exception is thrown by peek()'],correct:0}
  ]},
  {topic:'Queue processing and rotations', applied:[
    {id:'rotateT1',prompt:'The FIFO queue starts [5, 2, 8, 3]. What remains after the loop? The initial size is stored before the loop.',code:`int n = q.size();
for (int i = 0; i < n; i++) {
    int value = q.remove();
    if (value % 2 == 0) q.add(value);
}`,options:['[2, 8]','[5, 3]','[8, 2]','[]'],correct:0},
    {id:'rotateT2',prompt:'A one-lane garage holds [A, B, C, D] from exit to rear. Move A and B to a holding area, retrieve C, then return A and B to the rear in their original order. What is the garage order?',options:['[D, A, B]','[A, B, D]','[D, B, A]','[A, B, C, D]'],correct:0},
    {id:'rotateT3',prompt:'The queue starts [2, 5, 7]. What is its final state after this fixed-length loop?',code:`int n = q.size();
for (int i = 0; i < n; i++) {
    int x = q.remove();
    if (x >= 5) q.add(x + 1);
}`,options:['[6, 8]','[5, 7]','[2, 6, 8]','[8, 6]'],correct:0}
  ],reasoning:[
    {id:'rotateR1',prompt:'Why will this loop never terminate if q starts with three items and no other code changes q?',code:`while (!q.isEmpty()) {
    q.add(q.remove());
}`,options:['Each iteration keeps the queue size unchanged','remove() cannot be used inside add()','peek() would be required to prevent an exception','The queue becomes empty after three rotations'],correct:0},
    {id:'rotateR2',prompt:'A program rotates the front item to the rear until a target reaches the front. How can it avoid an infinite loop if the target is missing while preserving every item?',options:['Make at most the original q.size() rotations, then report not found','Continue until q.peek() equals the target, with no other limit','Use while (!q.isEmpty()) and rotate every iteration','Replace remove() with peek() inside the rotation'],correct:0}
  ]},
  {topic:'Stacks and palindrome algorithms', applied:[
    {id:'stackT1',prompt:'A queue and a stack both receive these words in this order: sun, moon, star, sun. Comparing queue.remove() with stack.pop(), when does the first mismatch occur?',options:['On the second comparison: moon versus star','On the first comparison: sun versus sun','On the third comparison: star versus moon','There is no mismatch'],correct:0},
    {id:'stackT2',prompt:'A queue and stack both receive red, blue, green, blue, red in that order. After two matching remove/pop comparisons, which pair is compared next?',options:['green with green','blue with blue','green with red','red with green'],correct:0},
    {id:'stackT3',prompt:'A palindrome test compares whole words from a queue (forward) and a stack (backward). What results should it give for these two lists?',code:`List A: ["ab", "ba"]
List B: ["ab", "x", "ab"]`,options:['A is false; B is true','A is true; B is true','A is false; B is false','A is true; B is false'],correct:0}
  ],reasoning:[
    {id:'stackR1',prompt:'The following test is supposed to return false when the next words differ. Which replacement correctly detects a mismatch in Java?',code:`if (q.remove() == s.pop()) {
    return false;
}`,options:['if (!q.remove().equals(s.pop())) return false;','if (q.remove().equals(s.pop())) return false;','if (q.remove() != s.pop()) return false;','if (q.peek() == s.pop()) return false;'],correct:0},
    {id:'stackR2',prompt:'A palindrome method removes every word from its queue and pops every word from its stack. What must happen before running the test again on the same input?',options:['Reload both collections because the original words were consumed','Only reset the queue; stack.pop() does not change the stack','Only reset the stack; Queue.remove() does not change the queue','Nothing; both collections still contain all original words'],correct:0}
  ]},
  {topic:'ArrayList-backed IntQueue', applied:[
    {id:'arrayT1',prompt:'An ArrayList-backed queue stores [7, 9, 7] with index 0 as the front. What are a, b, and the final list?',code:`int a = items.remove(0);
items.add(a);
int b = items.get(0);`,options:['a = 7; b = 9; list = [9, 7, 7]','a = 7; b = 7; list = [9, 7]','a = 9; b = 7; list = [7, 7, 9]','a = 7; b = 9; list = [7, 9, 7]'],correct:0},
    {id:'arrayT2',prompt:'A custom IntQueue begins empty and implements FIFO using an ArrayList. What are x, y, and the final queue?',code:`q.add(5);
q.add(2);
int x = q.remove();
q.add(x + 3);
int y = q.peek();`,options:['x = 5; y = 2; queue = [2, 8]','x = 2; y = 5; queue = [5, 5]','x = 5; y = 8; queue = [2, 8]','x = 5; y = 2; queue = [8, 2]'],correct:0},
    {id:'arrayT3',prompt:'An ArrayList-backed queue stores [2, 5, 9] with index 0 as the front. A student accidentally removes the last index. What are x and the final list?',code:`int x = items.remove(items.size() - 1);
items.add(4);`,options:['x = 9; list = [2, 5, 4]','x = 2; list = [5, 9, 4]','x = 9; list = [4, 2, 5]','x = 2; list = [9, 5, 4]'],correct:0}
  ],reasoning:[
    {id:'arrayR1',prompt:'Your custom IntQueue returns Integer.MIN_VALUE when remove() is called on an empty queue. What limitation does this sentinel design introduce?',options:['A real stored Integer.MIN_VALUE is indistinguishable from an empty-queue result by return value alone','The queue can never store negative values','Standard Queue.remove() will now return Integer.MIN_VALUE too','The implementation automatically removes every Integer.MIN_VALUE value'],correct:0},
    {id:'arrayR2',prompt:'A student implements IntQueue.remove() as shown, after checking for an empty queue. Which bug remains?',code:`public int remove() {
    if (items.isEmpty()) return Integer.MIN_VALUE;
    return items.get(0);
}`,options:['It returns the front but never removes it, so repeated calls return the same item','get(0) removes the rear instead of the front','The empty case always throws NoSuchElementException','The method reverses the remaining list'],correct:0}
  ]},
  {topic:'Priority queues and heaps', applied:[
    {id:'heapT1',prompt:'A PriorityQueue<Integer> starts empty. After the statements below, what are x, y, and z?',code:`pq.add(8); pq.add(3);
pq.add(5); pq.add(3);
int x = pq.remove();
pq.add(4);
int y = pq.remove();
int z = pq.peek();`,options:['x = 3; y = 3; z = 4','x = 8; y = 3; z = 4','x = 3; y = 4; z = 5','x = 3; y = 3; z = 5'],correct:0},
    {id:'heapT2',prompt:'A PriorityQueue<Integer> starts empty. What are a, b, and pq.peek() after these statements?',code:`pq.add(12); pq.add(4); pq.add(8);
int a = pq.remove();
pq.add(a + 10);
int b = pq.remove();`,options:['a = 4; b = 8; peek = 12','a = 12; b = 4; peek = 8','a = 4; b = 12; peek = 8','a = 4; b = 8; peek = 14'],correct:0},
    {id:'heapT3',prompt:'A FIFO Queue<Integer> and a PriorityQueue<Integer> both receive 7, then 2, then 6. What do the two structures return from remove(), and what does each peek() return afterward?',options:['FIFO: remove 7, peek 2; priority: remove 2, peek 6','FIFO: remove 2, peek 6; priority: remove 7, peek 2','FIFO: remove 7, peek 6; priority: remove 2, peek 7','FIFO: remove 7, peek 2; priority: remove 2, peek 7'],correct:0}
  ],reasoning:[
    {id:'heapR1',prompt:'Which array could represent a valid binary min-heap in level order? Each parent must be no greater than either child.',options:['[2, 7, 3, 10, 8, 5, 4]','[2, 7, 3, 6, 8, 5, 4]','[2, 7, 3, 10, 8, 2, 4]','[2, 7, 3, 10, 8, 5, 1]'],correct:0},
    {id:'heapR2',prompt:'After inserting 9, 2, 7, and 4 into a natural-order PriorityQueue<Integer>, which claim is guaranteed?',options:['peek() returns 2, but iterating the priority queue is not guaranteed to be sorted','toString() lists all values in ascending order','The first element added must be the first element removed','Every child in the heap is larger than every value at the previous level'],correct:0}
  ]},
  {topic:'Minimum-cost priority queue algorithm', applied:[
    {id:'mergeT1',prompt:'In the minimum-cost array-reduction problem, each merge replaces two values with their sum and adds that sum to the running cost. Starting with [2, 5, 7, 9], what total results from always merging the two smallest available values?',options:['44','37','46','50'],correct:0},
    {id:'mergeT2',prompt:'In minimum-cost reduction, each merge replaces two numbers with their sum and adds that sum to the total cost. Start with [3, 5, 12, 19]. After merging 3 and 5 into 8, which two numbers should be merged next?',options:['8 and 12','12 and 19','8 and 19','3 and 12'],correct:0},
    {id:'mergeT3',prompt:'In minimum-cost reduction, each merge replaces two numbers with their sum and charges that sum as a cost. Starting with [2, 4, 7, 8], what total cost results from always combining the two smallest versus always combining the two largest?',options:['Smallest-first = 40; largest-first = 55','Smallest-first = 55; largest-first = 40','Both methods cost 40','Smallest-first = 21; largest-first = 21'],correct:0}
  ],reasoning:[
    {id:'mergeR1',prompt:'A priority-queue reduction loop repeatedly removes TWO values, adds their sum to the total cost, and reinserts the sum. Why is while (pq.size() > 1) the appropriate loop condition?',options:['A merge needs two values; stopping with one prevents an invalid second remove()','Because the priority queue must be completely empty afterward','Because Java PriorityQueue.size() cannot return zero','To ensure that exactly one merge occurs for any input'],correct:0},
    {id:'mergeR2',prompt:'A minimum-cost reduction algorithm removes the two smallest values and adds their sum to the running cost, but forgets to put the sum back in the priority queue. Why is its result generally wrong?',options:['The combined value must be available to participate in later merges','The priority queue automatically reinserts removed values','Reinsertion would double-count the current merge immediately','Adding the sum to the total always sorts the remaining queue'],correct:0}
  ]}
];
export const TRACE_TASKS=[
 {id:'t1',title:'FIFO queue state',code:'Queue<Integer> q = new LinkedList<Integer>();\nq.add(3); q.add(8); q.add(11);\nq.remove();\nq.add(5);\nq.add(q.remove());',fields:[{label:'What does q.peek() now return?',answer:'11',kind:'number'},{label:'Write the full queue from front to rear, for example [1, 2, 3].',answer:'[11,5,8]',kind:'array'}]},
 {id:'t2',title:'Rotation with saved values',code:'Queue<Integer> q = new LinkedList<Integer>();\nq.add(9); q.add(2); q.add(7); q.add(4);\nint a = q.remove();\nq.add(a + 1);\nint b = q.remove();\nq.add(q.remove());',fields:[{label:'What is a + b?',answer:'11',kind:'number'},{label:'Write the final queue from front to rear.',answer:'[4,10,7]',kind:'array'}]},
 {id:'t3',title:'Integer priority queue',code:'PriorityQueue<Integer> pq = new PriorityQueue<Integer>();\npq.add(14); pq.add(5); pq.add(9); pq.add(3);\nint x = pq.remove();\npq.add(x + 6);\nint y = pq.remove();',fields:[{label:'Write x and y, separated by a comma.',answer:'3,5',kind:'pair'},{label:'What does pq.peek() return now?',answer:'9',kind:'number'}]},
 {id:'t4',title:'String priority queue',code:'PriorityQueue<String> pq = new PriorityQueue<String>();\npq.add("pear"); pq.add("Apple");\npq.add("apple"); pq.add("Banana");\nString a = pq.remove();\nString b = pq.remove();',fields:[{label:'Write a and b, separated by a comma (case-sensitive).',answer:'Apple,Banana',kind:'pair'},{label:'What does pq.peek() return now?',answer:'apple',kind:'string'}]}
];
export const FINAL_PROGRAMS=[
 {id:'f1',title:'Find an item by rotating',points:22,signature:'public static boolean alignFront(Queue<Integer> q, int target)',instructions:'Rotate a FIFO queue until target reaches the front. Return true when found; return false if it does not occur. You may make no more than one full pass. The queue must keep every original value, and its order must remain unchanged when target is absent. Do not remove the target permanently.',starter:`import java.util.Queue;
public class QueueFinal {
    public static boolean alignFront(Queue<Integer> q, int target) {
        // Rotate without losing elements.
        return false;
    }
}`},
 {id:'f2',title:'Serve values below a threshold',points:22,signature:'public static int countBelow(PriorityQueue<Integer> pq, int threshold)',instructions:'Remove and count all elements strictly less than threshold, using PriorityQueue operations. Keep elements equal to or greater than threshold in the same priority queue. Return how many values were removed.',starter:`import java.util.PriorityQueue;
public class PriorityFinal {
    public static int countBelow(PriorityQueue<Integer> pq, int threshold) {
        // Use peek() and remove() to examine the minimum.
        return 0;
    }
}`}
];
export function finalMC(studentKey){
  const seed=seedFor('final-questions-v2:'+studentKey);
  // Select exactly one applied + one reasoning question from each instructional module.
  const chosen=QUESTIONS.flatMap((group,i)=>[
    seededShuffle(group.applied,seed+61*i+11)[0],
    seededShuffle(group.reasoning,seed+61*i+29)[0]
  ]);
  return seededShuffle(chosen,seed+903).map((q,j)=>{
    const choices=seededShuffle(q.options.map((label,i)=>({label,correct:i===q.correct})),seed+47*j+31);
    return {...q,options:choices.map(x=>x.label),correct:choices.findIndex(x=>x.correct)};
  });
}
// Intentionally exported only for internal content checks, not displayed in the student interface.
export const finalQuestionBankForTesting = () => QUESTIONS;

export function gradeTrace(kind,actual,expected){const a=String(actual??'').trim(),b=String(expected);if(kind==='number')return a!==''&&Number(a)===Number(b);if(kind==='array'||kind==='pair')return a.replace(/[\[\]\s]/g,'')===b.replace(/[\[\]\s]/g,'');return a===b;}
