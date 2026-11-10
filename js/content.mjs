export const MODULES=[
 {id:'m1',name:'Introduction to Queues',subtitle:'FIFO and the Queue interface',period:'About 35–45 min',goals:['Explain FIFO with front and rear positions','Distinguish add, remove, peek, size, and isEmpty','Write a short method using Queue<Integer>'],
  sections:[
   {title:'A queue models a waiting line',body:'A queue is a first-in, first-out (FIFO) structure. New items enter at the REAR; the FRONT item leaves first. The item that has been waiting longest gets served first. Think of a line at a ticket window, not a stack of plates.',key:'Front = next to leave. Rear = where the next item arrives.'},
   {title:'Queue is an interface',body:'In Java, Queue<E> is an interface, so we instantiate an implementing class. For a regular FIFO queue, Queue<Integer> q = new LinkedList<Integer>();. The type in angle brackets tells Java what kind of elements the queue holds. Queue is in java.util.',key:'Use Queue<Integer> as the variable type, LinkedList<Integer> as the concrete class.'},
   {title:'Understand the basic operations',body:'add(x) puts x at the rear. remove() removes AND returns the front. peek() returns the front WITHOUT removing it. size() counts elements, and isEmpty() reports whether the queue has no elements. Calling remove() on an empty LinkedList queue throws NoSuchElementException; peek() returns null.',key:'Never confuse peek with remove.'}],
  example:`Queue<Integer> q = new LinkedList<Integer>();
q.add(25);
q.add(14);
q.add(67);          // [25, 14, 67]
System.out.println(q.peek());    // 25
System.out.println(q.remove());  // 25
System.out.println(q);           // [14, 67]`,
  exercise:'e1',practiceType:'fifo'},
 {id:'m2',name:'Queue Operations and Tracing',subtitle:'Reason about what each statement changes',period:'About 35–50 min',goals:['Trace sequential queue operations','Explain how a queue changes inside a loop','Write a queue rotation algorithm'],
  sections:[
   {title:'Trace the state, not just the output',body:'For every line, keep a small sketch of the queue from front to rear. If a call returns a value, record that separately from the queue state. A trace may mix calls to remove, peek, add, and print.',key:'A printed value is not the same as a changed queue.'},
   {title:'Why loops matter',body:'A common pattern is while (!q.isEmpty()) { System.out.println(q.remove()); }. Each loop removes the front, so a FIFO queue prints elements in insertion order. The queue ends empty. Contrast a loop that only peeks, which would never shrink the queue.',key:'If you use while (!q.isEmpty()), something in the loop must change the condition.'},
   {title:'Rotation: remove, then add',body:'To move the front element to the rear, save it with remove() and immediately add() it back. Doing this n times rotates the queue n positions. You will also use this idea to solve a parking-garage challenge.',key:'A rotation keeps the same number of elements, but changes their order.'}],
  example:`Queue<Integer> q = new LinkedList<Integer>();
q.add(4);
q.add(8);
q.add(12);
q.add(16);
q.add(q.remove());    // [8, 12, 16, 4]
q.add(q.remove());    // [12, 16, 4, 8]
System.out.println(q.peek());   // 12`,
  exercise:'e2',practiceType:'trace'},
 {id:'m3',name:'Queue Algorithms and Stacks',subtitle:'A palindrome from both directions',period:'About 40–55 min',goals:['Contrast FIFO and LIFO','Explain why Queue + Stack can detect a palindrome list','Write a class that constructs, resets, and examines data structures'],
  sections:[
   {title:'Queue vs. Stack',body:'Queues remove from the front (FIFO). Stacks pop from the top (LIFO, last-in first-out). If you add the same sequence of words to both structures, queue.remove() produces the forward sequence, while stack.pop() produces the reverse sequence.',key:'Same input, opposite removal orders.'},
   {title:'A palindrome list',body:'A list is a palindrome when its words read the same forward and backward, such as one two three two one. Compare words, not characters: "racecar is racecar" succeeds because the first and last WORDS match. Use String.equals, not ==, to compare the text.',key:'Compare words with equals().'},
   {title:'Reset your data before retesting',body:'In the PalinList programming challenge, setList builds a fresh queue and stack. isPalin can consume both. If students call it again without resetting, the structures are already empty. A useful class separates loading data from checking it.',key:'Construct a fresh Queue and Stack whenever setList is called.'}],
  example:`Queue<String> q = new LinkedList<String>();
Stack<String> s = new Stack<String>();
for (String word : list.split(" ")) {
    q.add(word);
    s.push(word);
}
while (!q.isEmpty()) {
    if (!q.remove().equals(s.pop())) {
        return false;
    }
}
return true;`,
  exercise:'e3',practiceType:'palindrome'},
 {id:'m4',name:'Implementing IntQueue',subtitle:'Build FIFO behavior with an ArrayList',period:'About 45–65 min',goals:['Identify the storage and methods needed in a queue class','Implement remove and peek safely','Test repeated operations and boundary cases'],
  sections:[
   {title:'An ArrayList can be the storage',body:'A queue is a behavior contract, not a particular built-in class. To implement our own IntQueue, we can store integers in an ArrayList<Integer>. Its index 0 represents the FRONT of the queue, and the last index represents the REAR.',key:'listOfInts.add(item) appends at the rear.'},
   {title:'Design your operations',body:'add(item) appends. remove() reads and deletes index 0. peek() reads index 0 without deletion. isEmpty() can delegate to the list. toString() can delegate to the list as well, producing familiar bracketed output.',key:'ArrayList.remove(0) shifts later elements left; appropriate for this teaching implementation.'},
   {title:'Empty-state contract',body:'Java Queue.remove() normally throws on an empty queue, but our custom IntQueue class will use Integer.MIN_VALUE as a sentinel for empty remove() and peek(). This is a deliberate design choice for this class, not standard Queue behavior.',key:'Our custom IntQueue returns Integer.MIN_VALUE when empty. Standard Queue.remove() instead throws an exception.'}],
  example:`private ArrayList<Integer> listOfInts;

public IntQueue() {
    listOfInts = new ArrayList<Integer>();
}

public void add(int item) {
    listOfInts.add(item);
}
// Implement remove, peek, isEmpty, toString.`,
  exercise:'e4',practiceType:'arraylist'},
 {id:'m5',name:'Priority Queues and Heaps',subtitle:'Minimum first, not first in',period:'About 40–50 min',goals:['Contrast FIFO with a Java PriorityQueue','Predict removal order for integers and strings','Read a min-heap and avoid assumptions about toString'],
  sections:[
   {title:'A different rule for leaving the queue',body:'PriorityQueue<Integer> retrieves the smallest item under natural ordering. It is NOT a FIFO queue. Adding 11, 10, and 7 will remove 7, then 10, then 11, regardless of insertion order. A comparator can also define a different priority, but this unit uses natural ordering.',key:'The next item removed is the minimum, not the oldest.'},
   {title:'The binary min-heap beneath it',body:'Java PriorityQueue is typically implemented as a binary heap. The root is the minimum, and each parent is no greater than its children. That is a heap property, not a promise that the complete internal array is sorted. Each add/remove may rearrange multiple nodes.',key:'Root has minimum; siblings and other nodes are not globally sorted.'},
   {title:'Watch out for toString and String ordering',body:'PriorityQueue.toString() shows the heap iteration order, which is NOT specified to be sorted. Different implementations or operation histories may yield different printed layouts. To get true sorted/natural order, repeatedly remove() until empty. Strings use lexicographic Unicode ordering; uppercase letters come before lowercase letters.',key:'A correct question asks what remove()/peek() returns, not the exact printed heap ordering.'}],
  example:`PriorityQueue<Integer> pq = new PriorityQueue<Integer>();
pq.add(11);
pq.add(10);
pq.add(7);
System.out.println(pq.peek());   // 7
System.out.println(pq.remove()); // 7
System.out.println(pq.remove()); // 10
System.out.println(pq.remove()); // 11
// Don't treat pq.toString() as sorted.`,
  exercise:'e5',practiceType:'priority'},
 {id:'m6',name:'Priority Queue Algorithms',subtitle:'Minimum-cost array reduction',period:'About 60–90 min',goals:['Discover why different merge orders have different costs','Compare, improve, and justify your own merge strategy','Design and independently code a general Java solution'],
  sections:[],
  example:'',
  exercise:'e6',practiceType:'reduction'}
];
// Every quiz attempt takes five questions from the bank and shuffles answer positions.
export const QUESTION_BANK=[
 [
  ['Which item leaves first from a FIFO queue containing [25, 14, 67]?',['25','14','67','The most recently added item'],0,'FIFO removes the oldest item at the front.'],
  ['Which method looks at the front without changing the queue?',['remove()','peek()','add()','clear()'],1,'peek() returns the front but leaves it in the queue.'],
  ['Which declaration correctly creates a FIFO queue of integers?',['Queue<Integer> q = new LinkedList<Integer>();','Queue<Integer> q = new Queue<Integer>();','Queue q = new int[10];','Stack<Integer> q = new Queue<Integer>();'],0,'Queue is an interface, and LinkedList is one implementing class.'],
  ['After add(4), add(9), remove(), what remains?',['[9]','[4]','[]','[4, 9]'],0,'remove() removes 4, leaving 9.'],
  ['What does isEmpty() return for a newly created queue?',['true','false','null','0'],0,'A newly created queue has no elements.'],
  ['What is the result of peek() on an empty LinkedList queue?',['0','false','null','NoSuchElementException'],2,'peek() returns null on an empty queue.'],
  ['What happens if remove() is called on an empty LinkedList queue?',['It returns null','It throws NoSuchElementException','It returns 0','It adds an empty value'],1,'remove() throws; poll() would return null.']
 ],[
  ['After [4, 8, 12] rotates once, what is the new front?',['4','8','12','There is no front'],1,'Rotation moves 4 to the rear.'],
  ['What is printed by while (!q.isEmpty()) { println(q.remove()); } for [3, 6]?',['6 then 3','3 then 6','3 forever','No output'],1,'The loop removes the front until the queue is empty.'],
  ['What bug occurs in while (!q.isEmpty()) { println(q.peek()); }?',['The queue grows','The loop never removes anything','peek throws immediately','The first element gets removed'],1,'Without a changing condition, the loop does not finish.'],
  ['If q is [2, 5, 8], what does q.remove() return?',['2','5','8','[5, 8]'],0,'remove() returns and deletes the front value.'],
  ['After removing the front of [2, 5, 8], what is q?',['[2, 5]','[5, 8]','[8, 5]','[2, 5, 8]'],1,'The queue becomes [5, 8].'],
  ['Which two operations rotate the front item to the rear?',['peek then peek','add then clear','add(q.remove())','remove then remove'],2,'q.add(q.remove()) rotates one place.'],
  ['What is the size of [7, 9] after peek()?',['1','2','3','0'],1,'peek does not remove anything.']
 ],[
  ['Which data structure uses LIFO?',['Queue','Stack','PriorityQueue','LinkedList used as Queue'],1,'Stack pops the most recently pushed item.'],
  ['What does stack.pop() return after pushing "A", "B", "C"?',['A','B','C','null'],2,'A stack returns the last item pushed.'],
  ['Which word list is a palindrome?',['one two three','red blue red','a a b','cat dog'],1,'The words match forward and backward.'],
  ['Why compare queue.remove() with stack.pop()?',['They both produce the same order','One reads forward and one reads backward','It sorts the list','It keeps both collections unchanged'],1,'FIFO and LIFO produce opposite orders.'],
  ['How should Java String values be compared for equal text?',['==','equals()','compare using =','isEmpty()'],1,'Use equals() for text equality.'],
  ['Why should setList create fresh collections?',['To preserve old duplicates','To replace old data before another test','So isPalin never removes anything','To sort the strings'],1,'Resetting is important because the comparison consumes elements.'],
  ['Is "racecar is racecar" a palindrome list?',['Yes','No','Only if all letters are reversed','Only with uppercase words'],0,'The first and last word match, with is in the middle.']
 ],[
  ['Where is the front stored in our ArrayList-backed IntQueue?',['index 0','last index','middle index','no index'],0,'We designate index 0 as the front.'],
  ['Which ArrayList operation removes the front value?',['remove(size())','remove(0)','clear(0)','peek(0)'],1,'Removing index 0 removes the oldest value.'],
  ['What should peek() do in our custom IntQueue?',['Delete item 0','Return item 0 without deleting','Add an item','Return the last item'],1,'peek reads without mutating.'],
  ['Which value signals empty remove() in our custom IntQueue class?',['0','null','Integer.MIN_VALUE','false'],2,'Our custom IntQueue uses Integer.MIN_VALUE when empty.'],
  ['Does standard Queue.remove() return Integer.MIN_VALUE when the queue is empty?',['Yes','No, standard remove throws an exception','Only when using LinkedList','Only for PriorityQueue'],1,'Standard Queue.remove() throws NoSuchElementException when empty.'],
  ['After add(5), add(7), remove(), what does toString() produce?',['[5, 7]','[5]','[7]','[]'],2,'The front 5 leaves.'],
  ['Which ArrayList operation adds at the rear?',['add(item)','remove(0)','get(0)','isEmpty()'],0,'add(item) appends.']
 ],[
  ['For a natural-order PriorityQueue<Integer>, what does remove() return from {11, 7, 10}?',['11','10','7','Insertion order decides'],2,'The smallest integer has highest retrieval priority.'],
  ['Does PriorityQueue.toString() guarantee sorted order?',['Yes','No','Only with three items','Only for String'],1,'Iteration/toString order is not guaranteed sorted.'],
  ['Which structure typically underlies Java PriorityQueue?',['Binary min-heap','Array stack','HashMap','FIFO linked list'],0,'Java PriorityQueue uses a heap.'],
  ['What does the root of a min-heap represent?',['Largest item','Newest item','Smallest item','Middle item'],2,'Heap parents are no greater than their children.'],
  ['Which repeatedly produces sorted removal order?',['System.out.println(pq)','Calling pq.peek() repeatedly','Calling pq.remove() until empty','Calling pq.toString()'],2,'Removing the minimum repeatedly yields sorted output.'],
  ['Which String is removed first: "apple", "Banana", "zebra"?',['apple','Banana','zebra','Depends on insertion order'],1,'Uppercase B sorts before lowercase a and z.'],
  ['If you add 4, 4, and 1 to a PQ, what are the first two removals?',['4 then 4','1 then 4','4 then 1','1 then 1'],1,'The minimum comes first, then one of the equal 4s.']
 ],[
  ['What is the minimum total cost of reducing [1, 2, 3]?',['6','9','3','12'],1,'Merge 1+2=3 (cost 3), then 3+3=6 (total 9).'],
  ['With [2, 5, 9], which values should be combined first?',['2 and 5','5 and 9','2 and 9','Any pair'],0,'Combine the two smallest available values.'],
  ['After combining 2 and 5, what is added back into the PQ?',['2','5','7','10'],2,'The combined value is 7.'],
  ['What should min_cost return for [42]?',['42','0','-1','null'],1,'There is no merge with a single item.'],
  ['What is the correct main loop condition?',['!pq.isEmpty()','pq.size() > 1','pq.size() == 1','pq.size() < 2'],1,'You need at least two items for a merge.'],
  ['Which value should the algorithm return?',['Last item remaining','Number of merges','Sum of all merge costs','Smallest initial item'],2,'Total cost accumulates every intermediate sum.'],
  ['What is the cost of reducing [1, 1, 1]?',['3','5','6','2'],1,'First merge costs 2, second merge costs 3, total 5.']
 ]
];
export function seededShuffle(arr,seed){const a=arr.slice();let x=(seed>>>0)||1;for(let i=a.length-1;i>0;i--){x^=x<<13;x^=x>>>17;x^=x<<5;let j=(x>>>0)%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function seedFor(s){let x=2166136261;for(let i=0;i<s.length;i++){x^=s.charCodeAt(i);x=Math.imul(x,16777619);}return x>>>0;}
export function quizQuestions(moduleIndex,studentKey,attempt){let seed=seedFor(studentKey+'-'+moduleIndex+'-'+attempt),bank=seededShuffle(QUESTION_BANK[moduleIndex].map((q,i)=>({q,i})),seed).slice(0,5);
 return bank.map(({q,i},j)=>{let choices=seededShuffle(q[1].map((label,idx)=>({label,correct:idx===q[2]})),seed+37*j+12);return {id:`${moduleIndex+1}-${i}`,prompt:q[0],options:choices.map(c=>c.label),correct:choices.findIndex(c=>c.correct),explanation:q[3]};});}
