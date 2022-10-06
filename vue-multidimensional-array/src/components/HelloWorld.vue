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
          {id: 1, descripcion: 'Leo', ip: containerHeadValues.value.ipAddress,isAllowedGrowingToDown:true,isAllowedGrowingToRight:false,rowPosition:0,colPosition:0,parent:0,childs:[],isthereChildToRight:false,isthereChildToDown:false,lineToRightLong:20 },
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
  let newChildId:number=boxesId.value.at(-1)+1
  boxesId.value.push(newChildId)
  fatherBox.childs.push(newChildId)
  let newChildRowPosition:number
  let newChildColPosition:number
  const relocationIdSource:number=newChildId
  if(direction==='toBottom'){
    fatherBox.isAllowedGrowingToDown=false
    fatherBox.isAllowedGrowingToRight=true
    fatherBox.isthereChildToDown=true
    newChildRowPosition=fatherBox.rowPosition+1
    newChildColPosition=fatherBox.colPosition
  }else{
    fatherBox.isAllowedGrowingToDown=true
    fatherBox.isAllowedGrowingToRight=false
    fatherBox.isthereChildToRight=true
    newChildRowPosition=fatherBox.rowPosition
    newChildColPosition=fatherBox.colPosition+1
    recalculateBoxesLocation(relocationIdSource,newChildColPosition)
  }

  boxes.value.push(
      {id: newChildId, descripcion: 'RB', ip: containerHeadValues.value.ipAddress,isAllowedGrowingToDown:true,isAllowedGrowingToRight:true,rowPosition:newChildRowPosition,colPosition:newChildColPosition,parent:fatherId,childs:[],isthereChildToRight:false,isthereChildToDown:false,lineToRightLong:20 },
    )

}
const recalculateBoxesLocation=(relocationIdSource:number,newOccupiedColPosition:number)=>{
  let locationReallocated:boolean=false
  boxes.value.forEach((box: { id: number,colPosition:number, }) => {
    if(box.id!==relocationIdSource && box.colPosition>=newOccupiedColPosition){
      box.colPosition+=1
      findFatherChildToRight(box.id)
      locationReallocated=true
    }
  });
  return locationReallocated
}

const findFatherChildToRight=(idChild:number)=>{
  boxes.value.forEach((box: { id: number,childs:any,lineToRightLong:number,isthereChildToRight:boolean }) => {
    if(box.childs.find((child:number)=>child===idChild)){
      if(box.isthereChildToRight)
        box.lineToRightLong+=240
    }
  })
}

const allocatePosition=computed(()=>{
  return (box:any)=>`grid-area: ${box.rowPosition+1} / ${box.colPosition+1} / ${box.rowPosition+2} / ${box.colPosition+2};`
})
const showArrowtoRight=computed(()=>{
  return (box:any)=>`${box.isthereChildToRight?`display:block;transform: translate(${box.lineToRightLong/2}px,-50%) rotate(90deg);height: ${box.lineToRightLong}px;`:'display:none;'}`
})
const showArrowtoDown=computed(()=>{
  return (box:any)=>`${box.isthereChildToDown?'display:block;':'display:none;'}`
})
onMounted(() => {
  boxes.value.shift()
})
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="head">
    <input v-model="containerHeadValues.ipAddress" type="text" />
    <button @click="createFirstRow()">{{ containerHeadValues.buttonMsj }}</button>
  </div>
  <main>
    <div
      class="box"
      :style="allocatePosition(box)"
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
        <img src="../assets/Vector-Close.svg" alt="" />
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
</template>

<style scoped lang="scss">
.head {
  background-color: #102027;
  margin: 0 0 0.5rem 0;
  padding: 3px;
  & input {
    margin: 0 1rem 0 0;
    border-style: none;
    max-width: 120px;
    border-radius: 5px;
  }
}
main {
  background-color: #102027;
  padding: 10px;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  grid-column-gap: 15px;
  grid-row-gap: 18px;
}
.box {
  width: 204px;
  height: 83px;
  position: relative;
  background: #ffffff;
  &-menu {
    width: 204px;
    height: 19px;
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
    height: 64px;
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
      color: rgba($color: #102027, $alpha: 0.8);
      width: 110px;
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
  background-color: aqua;
}
.ellipse-right {
  position: absolute;
  top: 50%;
  right: 0;

  width: 3px;

  background-color: rgb(57, 55, 223);
}
.footer {
  font-size: 12px;
  padding: 3px 0;
  & p {
    width: min-content;
    white-space: nowrap;
    color: aliceblue;
    margin: 0 0 0 auto;
  }
}
</style>
