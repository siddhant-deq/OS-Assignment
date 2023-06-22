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

function updateQueue(processes, queue, time){
    for(proc of processes){
        while(processes.length !==0 && processes[0].arrival_t <= time){
            queue.push(processes[0]);
            queue[queue.length-1]['burst_t_orig'] = processes[0].burst_t;
            processes.shift();        
        }
    }
}
  
//input
let inputs = [];
inputs.push(new Process(1, 0, 5));
inputs.push(new Process(2, 1, 4));
inputs.push(new Process(3, 2, 2));
inputs.push(new Process(4, 4, 1));

console.log(inputs);


//algorithm
function RR(processes, timeQuantum){
    processes.sort(compareArrival);
    let waitQueue = [];
    let order = [];
    let tempQueue = [];
    let averageWait = 0;
    let averageTurnaround = 0;
    let currentTime = 0;
    let n = processes.length;
    let processed = 0;

    while(processed !== n){
        updateQueue(processes, waitQueue, currentTime);
        while(tempQueue.length !== 0){
            waitQueue.push(tempQueue[0]);
            tempQueue.shift();
        }
        if(waitQueue.length === 0){currentTime++; continue;} 
        
        if(waitQueue[0].burst_t <= timeQuantum){
            currentTime += waitQueue[0].burst_t;
            let turnaround = currentTime - waitQueue[0].arrival_t;
            let waittime = (turnaround-waitQueue[0].burst_t);
            averageTurnaround += turnaround;
            averageWait += (turnaround-waitQueue[0].burst_t_orig);
            order.push(waitQueue[0]);
            waitQueue.shift();
            processed++;
        }
        else{
            currentTime += timeQuantum;
            waitQueue[0].burst_t -= timeQuantum;
            tempQueue.push(waitQueue[0]);
            waitQueue.shift();
        }
    }

    averageTurnaround /= n;
    averageWait /= n;

    console.log("Order\n", order);
    console.log("\nAverage Waiting Time: ", averageWait);
    console.log("\nAverage Turnaround Time: ", averageTurnaround);
}

//queue pop=shift, push=push


//test
RR(inputs, 2);