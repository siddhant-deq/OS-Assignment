//Inputs - processes with arrival time, burst time
//Output - order of execution, average waiting

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
  
//input
let inputs = [];
inputs.push(new Process(1, 3, 4));
inputs.push(new Process(2, 5, 3));
inputs.push(new Process(3, 0, 2));
inputs.push(new Process(4, 5, 1));
inputs.push(new Process(5, 4, 3));

console.log(inputs);


//algorithm
function FCFS(processes){
    processes.sort(compareArrival);
    let averageWait = 0;
    let averageTurnaround = 0;
    let currentTime = 0;
    for(proc of processes){
        if(currentTime < proc.arrival_t){
            currentTime = proc.arrival_t;
        }
        currentTime += proc.burst_t;

        let turnaround = currentTime - proc.arrival_t;
        averageTurnaround += turnaround;
        averageWait += (turnaround-proc.burst_t);
    }
    let n = processes.length;
    averageTurnaround /= n;
    averageWait /= n;

    console.log("Order\n", processes);
    console.log("\nAverage Waiting Time: ", averageWait);
    console.log("\nAverage Turnaround Time: ", averageTurnaround);
}

//test
FCFS(inputs);