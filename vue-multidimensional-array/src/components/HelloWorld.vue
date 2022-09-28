<script setup lang="ts">
  import { ref , onMounted} from 'vue'
  import type {Ref} from 'vue'
  defineProps<{ msg: string }>()
  
  let ipBoxes:Ref<any> =ref([{}])
  let containerHeadValues=ref({buttonMsj:'Start',ipAddress:undefined})

  const createFirstRow=()=>{
    if(containerHeadValues.value.buttonMsj==='Start' && containerHeadValues.value.ipAddress !==undefined ){
      ipBoxes.value.push(
        [
          {id: 1, descripcion: 'Leo', ip: containerHeadValues.value.ipAddress, parent:''},
        ]
        )
        containerHeadValues.value.buttonMsj='Restart'
      }else{
        ipBoxes.value=[]
        containerHeadValues.value.ipAddress=undefined
        containerHeadValues.value.buttonMsj='Start'
    }
  }

  onMounted(() => {
    ipBoxes.value.shift()
  })

</script> 

<template>
  <h1>{{ msg }}</h1>
  <div class="container">
    <div class="head">
      <input v-model="containerHeadValues.ipAddress"  type="text">
      <button @click="createFirstRow()">{{containerHeadValues.buttonMsj}}</button>
    </div>
    <div class="col" >
      <div class="row" v-for="(ipBox,index) in ipBoxes" :key="index">
       <!-- <span>L-{{ index }}=></span> -->
       <div class="box" v-for="(box,boxindex) in ipBox" :key="boxindex" >
          <div class="box--img">
            <img class="box--img__left" src="../assets/iconmonstr-angel-down-circle-thin.svg" alt="">
          </div> 
          <span>{{ box.ip }}</span>  
          <div class="box--img">
            <img class="box--img__right" src="../assets/iconmonstr-angel-right-circle-thin.svg" alt="">
          </div> 
       </div>
      </div>
    </div>

  </div>

</template>


<style scoped lang="scss"> 
  .container{
    font-size: .7rem;
    font-weight: 700;
    background-color: rgb(11, 36, 39);
    width: 400px;
    height: 400px; 
    padding: 20px;
  }
  .head{
    margin:0 0 .5rem 0;
  }
  .head input{
    margin: 0 1rem 0 0;
    border-style: none;
    padding: .6rem;
    max-width: 100px;
    border-radius: 5px;
    
  }
  .col{
    background-color: rgb(29, 36, 99);
    height: 300px;
    padding: .5rem;
  }
  .row{
    padding: 0;
    margin: .5rem;
    color: rgb(9, 31, 53);
    
  }
  .box{
    padding: 3px;
    border-radius: 10px;
    margin: .5rem;
    background-color:white;
    max-width: 9rem; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--img{
      background-color:white;
      &__left{
        transform: translateY(+20%);
      } 
      &__right{
        transform: translateY(+20%);
      } 
    }
  }
</style>
