//Inputs - processes with arrival time, burst time
//Output - order of execution, average waiting
//non-preemptive

class Process {
    constructor(pid, arrival_t, burst_t){
      this.pid = pid;
      this.arrival_t = arrival_t;
      this.burst_t = burst_t;
    }
}

function compareArrival(a, b) {
    return (a.arrival_t - b.arrival_t);
}

function compareBurst(a, b) {
    if(a.burst_t !== b.burst_t) return (a.burst_t - b.burst_t);
    else return a.arrival_t-b.arrival_t;
}

function updateQueue(processes, queue, time){
    for(proc of processes){
        while(processes.length !==0 && processes[0].arrival_t <= time){
            queue.push(processes[0]);
            processes.shift();        
        }
    }
}
  
//input
let inputs = [];
inputs.push(new Process(1, 1, 7));
inputs.push(new Process(2, 2, 5));
inputs.push(new Process(3, 3, 1));
inputs.push(new Process(4, 4, 2));
inputs.push(new Process(5, 5, 8));

console.log(inputs);


//algorithm
function SJN(processes){
    processes.sort(compareArrival);
    let waitQueue = [];
    let order = [];
    let averageWait = 0;
    let averageTurnaround = 0;
    let currentTime = 0;
    let n = processes.length;
    let processed = 0;

    while(processed !== n){
        updateQueue(processes, waitQueue, currentTime);
        if(waitQueue.length === 0){currentTime++; continue;} 
        waitQueue.sort(compareBurst);
        currentTime += waitQueue[0].burst_t;
        let turnaround = currentTime - waitQueue[0].arrival_t;
        averageTurnaround += turnaround;
        averageWait += (turnaround-waitQueue[0].burst_t);
        
        order.push(waitQueue[0]);
        waitQueue.shift();
        processed++;
    }

    averageTurnaround /= n;
    averageWait /= n;

    console.log("Order\n", order);
    console.log("\nAverage Waiting Time: ", averageWait);
    console.log("\nAverage Turnaround Time: ", averageTurnaround);
}

//test
SJN(inputs);