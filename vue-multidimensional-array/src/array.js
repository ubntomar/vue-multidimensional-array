ids=6
arr=[]
arr.push([
  { id:1,rowPosition:0,colPosition:0,parent:0  },{ id:2,rowPosition:0,colPosition:1,parent:0  },{ id:3,rowPosition:0,colPosition:2,parent:0  },
])
arr.push([                                       //arr[1].push(
  { id:4,rowPosition:1,colPosition:0,parent:1 }  //{ id:7,rowPosition:1,colPosition:1,parent:0 } 
])                                               //) 
arr.push([
  { id:5,rowPosition:2,colPosition:0,parent:4 }
])
arr.push([
  { id:6,rowPosition:3,colPosition:0,parent:5 }
])
// console.log(arr)
//lets going to create new col in row 1 over the first element

arr[1].push(
  { id:7,rowPosition:1,colPosition:1,parent:0 }  //colPosition:selectedBox.colPosition+1 || comes from clicked box 
)

const relocationIdSource=7                       //rowPosition comes from index row
const newOcupiedColPosition=1;
for( [i,row] of arr.entries() ){
    for( objForEach of row){ 
        const target=objForEach.id===relocationIdSource?'<-this':null
        console.log(`row ${i} id:${objForEach.id} current col: ${objForEach.colPosition} ${target} `)
        if(target!=='<-this' && objForEach.colPosition >= newOcupiedColPosition ){
            objForEach.colPosition+=1
        }
   }
}
console.log('-----------------------') 
for(row of arr){
    for(objForEach of row){ 
     const target=objForEach.id===relocationIdSource?'<-this':null
     console.log(`id:${objForEach.id} current col: ${objForEach.colPosition} ${target} `)
    }
 }