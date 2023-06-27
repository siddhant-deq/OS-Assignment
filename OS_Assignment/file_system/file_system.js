/* A simple file system that consists of the following structures
    > Memory(memory_size)
    > Volume(memory_to_bind, id)
    > Directory(name, parent, volume)
    > File(name, parent, memory_req)

    *Conceptual Overview*
    Memory represents the physical disk of a file system. We bind this memory to a volume. 
    First-level Directories are created with volumes as their parent, and can themselves be 
    a parent to a file or another directory. Volumes and Directories contain look up tables
    that are stored in memory. These LUTs contain the [start, offset] address pairs for each 
    of their children. Files cannot have any children and are made to handle data using the 
    read(), write(), and delete() methods.

    When creating a file/directory, a check is made if a file/dir with the same name already exists.
    Following this memory is allocated to it using contiguous first-fit memory allocation. A volume
    is allocated the 0th memory block by default, a directory is allocated the first available block,
    and a file is allocated a contiguous chunk based on memory_req. A memory allocation error is 
    raised in case the allocation is not possible.

    When a file is deleted, the entry in its parent's LUT is removed and the memory allocated to the
    file is freed (made '0', which represents an empty memory block).

    *File Functions*
    .delete()
    .read()
    .write(string, lineNumber)  //lineNumber <= memory_req
*/



const { memoryUsage } = require("process");

class Memory{
    constructor(memory_size){
        this.memory_size = memory_size;
        this.content = new Array(this.memory_size).fill('0');
        console.log("New Memory of Size ", this.memory_size);
    }
}

class Volume{
    constructor(memory_to_bind, id){
        this.memory = memory_to_bind;
        this.id = id;
        this.start_pointer = 0;
        this.lookup_table = {};
        this.lookup_table['id'] = this.id;
        this.update_mem();
        console.log("Created New Volume ", this.id);
    }

    update_mem(){
        this.memory.content[this.start_pointer] = this.lookup_table;
    }

    read_mem(){
        return this.memory.content[this.start_pointer];
    }
}

class Directory{
    constructor(name, parent, volume){
        this.name = name;
        this.parent = parent;
        this.volume = volume;
        this.start_pointer;
        
        //check if existing 
        //console.log("id", this.name);
        if(this.parent.read_mem()[this.name] != undefined){
            console.error("Error: File name already exists");
        }
        else{
            this.lookup_table = {};
            this.lookup_table['id'] = this.name;
            this.memory_alloc(this.volume.memory, this.name, this.parent.read_mem())
        }
    }

    memory_alloc(memory, hash, parent_lut){
        let success = 0;
        for(let i = 0; i < memory.memory_size; i++){
            if(memory.content[i] === '0'){
                this.start_pointer = i;
                success = 1;
                parent_lut[hash] = [this.start_pointer, 1];
                this.update_mem();
                this.parent.update_mem();
                console.log("Created Directory ", this.name);
                break;
            }
        }
        if(!success) console.error("Error: Memory Allocation Error");
    }

    update_mem(){
        this.volume.memory.content[this.start_pointer] = this.lookup_table;
    }

    read_mem(){
        return this.volume.memory.content[this.start_pointer];
    }
}

class File{
    constructor(name, parent, memory_req){
        this.name = name;
        this.parent = parent;
        this.memory_req = memory_req;
        this.start_pointer;
    
        //check if existing
        if(this.parent.read_mem()[this.name] != undefined){
            console.error("Error: File name already exists");
        }
        else{
            this.memory_alloc(this.parent.volume.memory, this.name, this.memory_req, this.parent.read_mem());
        }
    }

    memory_alloc(memory, hash, memory_req, parent_lut){
        let blockSize = 0;
        let start = 0;
        let success = 0;
        
        //contiguous memory allocation
        for(let i = 0; i < memory.memory_size; i++){
            if(blockSize === 0 && memory.content[i] === '0'){
                start = i;
                blockSize++;
            }
            else if(memory.content[i] === '0'){
                blockSize++;
            }
            else{
                blockSize=0;
            }
            if(blockSize === memory_req){
                success = 1;
                break;
            }
        }

        //marking memory
        if(success){
            this.start_pointer = start;
            this.limit = blockSize;
            for(let i = start; i < start+this.limit; i++){
                memory.content[i] = {id: this.name, content: '0'};
            }
            console.log("Created File ", this.name);
        }
        else{
            console.error("Error: Memory Allocation Error");
        }

        parent_lut[hash] = [this.start_pointer, this.limit];
        this.parent.update_mem();
    }

    delete(){
        delete this.parent.read_mem()[this.name];
        this.memory_dealloc();
        console.log("Deleted File ", this.name);
    }

    memory_dealloc(){
        for(let i = this.start_pointer; i < this.start_pointer + this.limit; i++){
            this.parent.volume.memory.content[i] = '0';
        }
    }

    read(){
        console.log("Reading File ", this.name);
        for(let i = this.start_pointer; i < this.start_pointer + this.limit; i++){
            console.log(this.parent.volume.memory.content[i].content);
        }
    }

    write(content, lineNumber){
        let memIndex = this.start_pointer+lineNumber-1;
        this.parent.volume.memory.content[memIndex].content = content;
        console.log("Written to File ", this.name);
    }    
}


//creating (and allocating) files
memory1 = new Memory(10);
console.log("Empty Memory", memory1);
volumeA = new Volume(memory1, 'c');
dirA = new Directory('Dir_A', volumeA, volumeA);
dirB = new Directory('Dir_B', volumeA, volumeA);
dirA1 = new Directory('Dir_A1', dirA, volumeA);
fileA11 = new File('File_A11', dirA1, 2);
fileB1 = new File('File_B1', dirB, 1);
console.log("Filled Memory", memory1);

//deleting (and deallocating) files
fileB1.delete();
console.log("Deleted File_B1 from Memory", memory1);

//Writing to file
fileA11.write('Hello, this is line 1', 1);
fileA11.write('Other ways to format 1221(U(*&*(@!', 2);

//Reading file
fileA11.read();

//Memory Overflow File
fileB2 = new File('File_B2', dirB, 4);
fileErr = new File('File_Err', dirB, 1);

//Memory Overflow Directory
dirErr = new Directory('Dir_Err', dirA1, volumeA);
