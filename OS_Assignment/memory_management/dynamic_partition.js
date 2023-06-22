//Inputs - processes with arrival time, memory requirement, running time
//Output - order of execution, average waiting
//non-preemptive

class Process {
    constructor(pid, arrival_t, memory_req, run_t){
      this.pid = pid;
      this.arrival_t = arrival_t;
      this.memory_req = memory_req;
      this.run_t = run_t;
      this.departure_t = this.arrival_t + run_t;
    }
}

function compareArrival(a, b) {
    if(a.arrival_t !== b.arrival_t) return (a.arrival_t - b.arrival_t);
    return a.memory_req - b.memory_req;
}

function compareDep(a, b) {
    return (a.departure_t - b.departure_t);
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
inputs.push(new Process(1, 4, 9, 9));
inputs.push(new Process(2, 1, 8, 2));
inputs.push(new Process(3, 2, 14, 8));
inputs.push(new Process(4, 4, 2, 6));

//console.log(inputs);

//memory 
memory = new Array(32).fill(0);

function fixed_partition(processes, memory, partition_size){
    processes.sort(compareArrival);
    let waitQueue = [];
    let allocQueue = [];
    let n = processes.length;
    let processed = 0;
    let currentTime = 0;
    while(processed !== n){
        updateQueue(processes, waitQueue, currentTime);
        if(waitQueue.length === 0 && allocQueue.length === 0){currentTime++; continue;} 
        
        //dealloc
        allocQueue.sort(compareDep);
        while(allocQueue.length !== 0 && allocQueue[0].departure_t <= currentTime){
            for(let i = 0; i < memory.length; i+=partition_size){
                if(memory[i] === allocQueue[0].pid){
                    for(let j = 0; j < partition_size; j++){
                        memory[i] = 0;
                    } 
                } 
            }
            allocQueue.shift();
            processed++;
        }           

        //alloc
        if(waitQueue.length !== 0){
            while(waitQueue.length !== 0 && waitQueue[0].arrival_t <= currentTime){
                let blocksReq = Math.ceil(waitQueue[0].memory_req/partition_size);
                let blocksFree = 0;
                for(let i = 0; i < memory.length; i+=partition_size){
                    if(memory[i] === 0) blocksFree++;
                }
                
                if(blocksFree < blocksReq){
                    console.log("Not Enough Memory");
                    break;
                }

                else{
                    waitQueue[0].departure_t = currentTime + waitQueue[0].run_t;
                    for(let i = 0; i < memory.length; i+=partition_size){
                        if(memory[i] === 0){ 
                            blocksReq--;
                            for(let j = 0; j < partition_size; j++){
                                memory[i+j] = waitQueue[0].pid;
                            }
                        }
                        if(blocksReq === 0) break;
                    }
                    allocQueue.push(waitQueue[0]);
                    waitQueue.shift();
                }
            }
        }

        console.log("Current Time: ", currentTime);
        console.log(memory);
        currentTime++;
    }
}

function dynamic_partition(processes, memory){
    fixed_partition(processes, memory, 1);
}

dynamic_partition(inputs, memory);