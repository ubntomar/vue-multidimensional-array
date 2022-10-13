<script setup lang="ts">

import { ref , onMounted, computed, reactive} from 'vue'
import type {Ref} from 'vue'
defineProps<{ msg: string }>()

const boxes:Ref<any> =ref([])
const containerHeadValues=ref({buttonMsj:'Start',ipAddress:""})
const boxesId:Ref<any>=ref([])
boxesId.value.push(1)


const createFirstRow=()=>{
  if(containerHeadValues.value.buttonMsj==='Start' && containerHeadValues.value.ipAddress !=="" ){
      boxes.value.push(
          {id: 1, descripcion: 'Leo', ip: containerHeadValues.value.ipAddress,isAllowedGrowingToDown:true,isAllowedGrowingToRight:false,rowPosition:0,colPosition:0,parent:0,childs:[],isthereChildToRight:false,isthereChildToDown:false,lineToRightLong:0,isToShow:true },
        )
      containerHeadValues.value.buttonMsj='Restart'
    }else{
      boxes.value=[]
      containerHeadValues.value.ipAddress=""
      containerHeadValues.value.buttonMsj='Start'
  }
}

const addChild=(fatherBox:any,direction:string)=>{
  let fatherId:number=fatherBox.id
  let newChildIdFetched:number=boxesId.value.at(-1)+1
  boxesId.value.push(newChildIdFetched)
  let newChildRowPosition:number
  let newChildColPosition:number
  const newChildId:number=newChildIdFetched
  if(direction==='toBottom'){
    fatherBox.childs.push({id:newChildIdFetched,direction:'toBottom'})
    fatherBox.isAllowedGrowingToDown=false
    fatherBox.isAllowedGrowingToRight=true
    fatherBox.isthereChildToDown=true
    newChildRowPosition=fatherBox.rowPosition+1
    newChildColPosition=fatherBox.colPosition
  }else{
    fatherBox.childs.push({id:newChildIdFetched,direction:'toRight'})
    fatherBox.isAllowedGrowingToDown=true
    fatherBox.isAllowedGrowingToRight=false
    fatherBox.isthereChildToRight=true
    newChildRowPosition=fatherBox.rowPosition
    newChildColPosition=fatherBox.colPosition+1
    recalculateBoxesLocation(newChildId,newChildColPosition)
  }

  boxes.value.push(
      {id: newChildId, descripcion: 'RB', ip: containerHeadValues.value.ipAddress,isAllowedGrowingToDown:true,isAllowedGrowingToRight:true,rowPosition:newChildRowPosition,colPosition:newChildColPosition,parent:fatherId,childs:[],isthereChildToRight:false,isthereChildToDown:false,lineToRightLong:0,isToShow:true },
    )

}
const recalculateBoxesLocation=(newChildId:number,newOccupiedColPosition:number)=>{
  boxes.value.forEach((box: { id: number,colPosition:number, }) => {
    if(box.id!==newChildId && box.colPosition>=newOccupiedColPosition){
      let colPositionresponse=findFatherColPosition(box.id)
      if ( colPositionresponse.found && (colPositionresponse.value< newOccupiedColPosition) ) { 
        findFatherChildToRightAndExtendLine(box.id)
      }
      box.colPosition+=1
    }
  });
}

let findFatherColPosition=(idChild:number):any=>{
  let colPosition={
    found:false,
    value:0
  }
  boxes.value.forEach((box: { id: number,childs:any,lineToRightLong:number,isthereChildToRight:boolean, colPosition:number}) => {
    if(box.childs.find((child:any)=>child.id===idChild)){
      if(box.isthereChildToRight){
        colPosition.found=true
        colPosition.value=box.colPosition
      }
    }
  })
  return colPosition
}
const findFatherChildToRightAndExtendLine=(idChild:number)=>{
  boxes.value.forEach((box: { id: number,childs:any,lineToRightLong:number,isthereChildToRight:boolean }) => {
    if(box.childs.find((child:any)=>child.id===idChild)){
      if(box.isthereChildToRight)
      box.lineToRightLong===0?box.lineToRightLong+=12:box.lineToRightLong+=11
    }
  })
}
const findFatherChildAndDeleteLine=(idChild:number)=>{
  boxes.value.forEach((box: { id: number,childs:any,lineToRightLong:number,isthereChildToRight:boolean,isthereChildToDown:boolean,isAllowedGrowingToRight:boolean,isAllowedGrowingToDown:boolean }) => {
    let deleteChildRef:boolean=false
    box.childs.forEach((childRef:any)=>{
      if (childRef.id===idChild) {
        if(childRef.direction==='toRight'){
          box.lineToRightLong=0
          box.isthereChildToRight=false
          box.isAllowedGrowingToRight=true
        } 
        if(childRef.direction==='toBottom'){
          box.isthereChildToDown=false
          box.isAllowedGrowingToDown=true
        }
        deleteChildRef=true
      }
    })
    if(deleteChildRef)  box.childs=box.childs.filter((child:any)=>child.id!==idChild)
  })
}

const hideBoxes=(box:any)=>{
  findFatherChildAndDeleteLine(box.id)
  box.isToShow=false
  box.lineToRightLong=0
  box.isthereChildToRight=false
  box.isthereChildToDown=false
  box.childs.forEach((childId:any) => {
    boxes.value.find((recursiveBox:any)=>{
      if(recursiveBox.id===childId.id){
        recursiveBox.isToShow=false
        hideBoxes(recursiveBox)
      }

    })
    
  });
}



const allocatePosition=computed(()=>{
  return (box:any)=>{
    let style='display:none;'
    if(box.isToShow)
      style=`grid-area: ${box.rowPosition+1} / ${box.colPosition+1} / ${box.rowPosition+2} / ${box.colPosition+2};`
    return style
  }
})
const showArrowtoRight=computed(()=>{
  return (box:any)=>`${box.isthereChildToRight?`display:block;transform: translate(${box.lineToRightLong==0?'.5':box.lineToRightLong/2}rem,-50%) rotate(90deg);height: ${box.lineToRightLong==0?'1':box.lineToRightLong}rem;`:'display:none;'}`
})
const showArrowtoDown=computed(()=>{
  return (box:any)=>`${box.isthereChildToDown?'display:block;':'display:none;'}`
})

onMounted(() => {
  boxes.value.shift()
})
</script>

<template>
  <div class="content">
  <div class="head">
    <input v-model="containerHeadValues.ipAddress" type="text" />
    <button @click="createFirstRow()">{{ containerHeadValues.buttonMsj }}</button>
  </div>
  <main>
    <div
      :style="allocatePosition(box)"
      class="box"
      v-for="(box, index) in boxes" 
      :key="index"
    >
      <img class="ellipse-up" src="../assets/Ellipse-up.svg" alt="" />
      <img
        :style="showArrowtoDown(box)"
        class="ellipse-down"
        src="../assets/Ellipse-right.svg"
        alt=""
      />
      <div class="box-menu">
        <img src="../assets/Vector-Mini-Menu.svg" alt="" />
        <img @click="hideBoxes(box)" src="../assets/Vector-Close.svg" alt="" />
      </div>
      <div class="box-body">
        <img
          :style="showArrowtoRight(box)"
          class="ellipse-right"
          src="../assets/Ellipse-down.svg"
          alt=""
        />
        <img
          v-if="box.isAllowedGrowingToDown"
          @click="addChild(box, 'toBottom')"
          class="box-body--arrow"
          src="../assets/Vector-Down.svg"
          alt=""
        />
        <div class="box-input">
          <img
            class="box-input__success"
            src="../assets/Vector-success.svg"
            alt="successIP"
          />
          <input type="text" v-model="box.ip" />
        </div>
        <img
          v-if="box.isAllowedGrowingToRight"
          @click="addChild(box, 'toRight')"
          class="box-body--arrow"
          src="../assets/Vector-Right.svg"
          alt=""
        />
      </div>
      <div class="footer">
        <p>id {{ box.id }} ({{ box.rowPosition }},{{ box.colPosition }})</p>
      </div>
    </div>
  </main>
  </div>
</template>

<style scoped lang="scss">
.content{
  width: max-content;
  min-width: 100vw;
  min-height: 100vh;
  overflow: scroll;
}
.head {
  background-color: #102027;
  margin: 0 0 0.5rem 0;
  padding: 3px;
  & input {
    margin: 0 1rem 0 0;
    border-style: none;
    max-width: 7.5rem;
    border-radius: 5px;
  }
}
main {
  background-color: #102027;
  display: grid;
  grid-template-columns: repeat(100, 1fr);
  grid-template-rows: repeat(100, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 18px;
}
.box {
  max-width: 10rem;
  height: 5.2rem;
  position: relative;
  background: #ffffff;
  &-menu {
    width: 10rem;
    height: 1.18rem;
    padding: 3px;
    background: #37474f;
    display: flex;
    justify-content: space-between;
    & img:active {
      scale: 0.9;
    }
  }
  &-body {
    position: relative;
    padding: 0 3px;
    margin: 0;
    height: 4rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    &--arrow {
      scale: 0.9;
      &:active {
        scale: 0.7;
      }
    }
  }

  &-input {
    position: relative;
    &__success {
      position: absolute;
      right: 0;
      transform: translate(80%, -80%);
    }
    & input {
      font-size: .8rem;
      color: rgba($color: #102027, $alpha: 0.8);
      width: 6.87rem;
      border: 1px solid rgba($color: #102027, $alpha: 0.2);
      padding: 3px;
      outline: none;
      text-align: center;
    }
  }
}
.ellipse-up {
  position: absolute;
  right: 50%;
  transform: translateY(-50%);
  display: none;
}
.ellipse-down {
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 40px;
  background-color: rgb(255, 255, 255);
}
.ellipse-right {
  position: absolute;
  top: 50%;
  right: 0;
  width: 3px;
  background-color: rgb(252, 252, 252);
}
.footer {
  font-size: .75rem;
  padding: 3px 0;
  & p {
    width: min-content;
    white-space: nowrap;
    color: aliceblue;
    margin: 0 0 0 auto;
  }
}
</style>
