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
       <span>L-{{ index }}=></span>
       <span v-for="(box,boxindex) in ipBox" :key="boxindex" >
        | {{ box.ip }} | 
       </span>
      </div>
    </div>

  </div>

</template>


<style scoped>
  .container{
    background-color: brown;
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
    background-color: rgb(128, 42, 42);
    height: 300px;
    padding: .5rem;
  }
  .row{
    padding: .5rem;
    margin: .5rem;
    color: aliceblue;
    background-color: rgb(59, 17, 17);
    max-width: 130px;
    border-radius: 5px;
  }
</style>
