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
            {id: 1, descripcion: 'Leo', ip: containerHeadValues.value.ipAddress,isGrowingToDown:true,isGrowingToRight:true,rowPosition:0,colPosition:0,parent:0},
          )
        containerHeadValues.value.buttonMsj='Restart'
      }else{
        boxes.value=[]
        containerHeadValues.value.ipAddress=""
        containerHeadValues.value.buttonMsj='Start'
    }
  }
  const addChild=(box:any,direction:string)=>{
    let parentId:number=box.id
    let newChildId:number=parentId+1
    let newChildRowPosition:number
    let newChildColPosition:number
    if(direction==='toBottom'){ 
      newChildRowPosition=box.rowPosition+1
      newChildColPosition=box.colPosition
    }else{
      console.log(box)
      parentId=0
      newChildRowPosition=box.rowPosition
      newChildColPosition=box.colPosition+1
    }
    if(box.isGrowingToDown){
      boxes.value.push(
          {id: newChildId, descripcion: 'RB', ip: containerHeadValues.value.ipAddress,isGrowingToDown:true,isGrowingToRight:true,rowPosition:newChildRowPosition,colPosition:newChildColPosition,parent:parentId},
        )
      }
    box.isGrowingToDown=false
  }

  const allocatePosition=computed(()=>{
    return (box:any)=>`grid-area: ${box.rowPosition+1} / ${box.colPosition+1} / ${box.rowPosition+2} / ${box.colPosition+2};`
  })

  onMounted(() => {
    boxes.value.shift() 
  })
</script> 

<template>
  <h1>{{ msg }}</h1>

  <div class="head">
      <input v-model="containerHeadValues.ipAddress"  type="text">
      <button @click="createFirstRow()">{{containerHeadValues.buttonMsj}}</button>
  </div>
  <main>
      <div class="box" :style="allocatePosition(box)" v-for="(box,index) in boxes" :key="index">
        <img class="ellipse-up" src="../assets/Ellipse-up.svg" alt="">
        <img class="ellipse-down" src="../assets/Ellipse-right.svg" alt="">
        <div class="box-menu">
          <img src="../assets/Vector-Mini-Menu.svg" alt="">
          <img src="../assets/Vector-Close.svg" alt="">
        </div>
        <div class="box-body" >
          <img class="ellipse-right" src="../assets/Ellipse-down.svg" alt="">
          <img @click="addChild(box,'toBottom')" class="box-body--arrow" src="../assets/Vector-Down.svg" alt="">
          <div class="box-input">
            <img class="box-input__success" src="../assets/Vector-success.svg" alt="successIP">
            <input type="text" v-model="box.ip">
          </div>
          <img @click="addChild(box,'toRight')" class="box-body--arrow" src="../assets/Vector-Right.svg" alt="">
        </div>
        <div class="footer">
          <p>id {{box.id}}  ({{box.rowPosition}},{{box.colPosition}})</p>
        </div>
      </div>
  </main>


  <!-- <main>
    <div class="head">
      <input v-model="containerHeadValues.ipAddress"  type="text">
      <button @click="createFirstRow()">{{containerHeadValues.buttonMsj}}</button>
    </div>
    <div class="grid-container" >
      <div class="grid-box" :style="allocatePosition(box)" v-for="(box,index) in boxes" :key="index">
       <div class="box">
          <div class="arrow">
            ({{box.parentRef}} UP)
          </div>
          <div class="box--img">
              <img v-if="box.isGrowingToDown" @click="addChild(box,'toBottom')" class="box--img__left" src="../assets/iconmonstr-angel-down-circle-thin.svg" alt="">
          </div> 
          <span>{{ box.ip }}</span>  
          <div class="box--img">
              <img class="box--img__right" @click="addChild(box,'toRight')" src="../assets/iconmonstr-angel-right-circle-thin.svg" alt="">
          </div> 
          <div class="arrow">
              ({{box.id}} DOWN)
          </div>  
        </div>
      </div>
    </div>
  </main> -->

</template>


<style scoped lang="scss"> 
.head{
  background-color: #102027;
  margin:0 0 .5rem 0;
  padding: 3px;
& input{
  margin: 0 1rem 0 0;
  border-style: none;
  max-width: 120px;
  border-radius: 5px;
  
}
}
main {
  background-color: #102027;
  padding: 10px;  
  width:100vw;
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
.box{
  width: 204px;
  height: 83px;
  position:relative;
  background: #FFFFFF;
  &-menu{
    width: 204px;
    height: 19px;
    padding: 3px;
    background: #37474F;
    display: flex;
    justify-content: space-between;
    & img:active{
      scale: .9;
    }
  }
  &-body{
    position: relative;
    padding:0 3px;
    margin: 0;
    height: 64px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    &--arrow{
      scale: .9;
      &:active{
        scale: .7;
      }
    }
    }

  &-input{
    position: relative;
    &__success{
      position: absolute;
      right: 0;
      transform: translate(80%,-80%);
    }
    & input{
      color:rgba($color: #102027, $alpha: .8);
      width: 110px;
      border: 1px solid rgba($color: #102027, $alpha: .2);
      padding: 3px;
      outline:none;
      text-align: center;
    }
  }
}
.ellipse-up{
  position: absolute;
  right:50%;
  transform: translateY(-50%);
}
.ellipse-down{
  position: absolute;
  top:100%;
  right:50%;
  transform: translateY(-50%);
}
.ellipse-right{
  position: absolute;
  top:50%;
  right:0;
  transform: translate(65%,-50%);
}  
.footer{
  font-size: 12px;
  padding: 3px 0;
  & p{
    width: min-content;
    white-space:nowrap;
    color: aliceblue;
    margin: 0 0 0 auto;
  }
}
</style>
