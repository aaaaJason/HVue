
<template>
  <div>
  <h1 style="text-align: center;">單位 - {{ Mname }}</h1>
  <span>商家帳號：{{ MAccount }}</span>
  <p>剩餘抵用券：<span class="voucher" style="color: red; font-size: larger;">{{ Voucher }}</span> 張</p>

  <el-table v-if="members.length > 0" :data="members"  class="custom-table">
    <el-table-column prop="MemberName" label="會員名稱"></el-table-column>
    <el-table-column prop="MemberAcc" label="會員帳號"></el-table-column>
    <el-table-column prop="VCount" label="折抵券張數"></el-table-column>
  </el-table>     
  <div v-else style="text-align: center; color: red;">
  <h1>無會員資料</h1>
  </div>

</div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    MAccount: {
      type: String,
      required: true
    },
    Mname: {
      type: String,
      required: true
    },
    Voucher: { 
      type: Number,
      required: true
    },
    Sid: { 
      type: Number,
      required: true
    },
  },
  data() {
    return {
      members: []
    };
  },
  created() {
    this.fetchMembers();
  },
  methods: {
    async fetchMembers() {
      try {
          console.log(this.Sid);
          const response = await axios.post('http://192.168.1.150:2226/storedata', {
              SId: this.Sid,
              table:'MerMembers'
              
      });
     
        if (response.status === 200) {
          this.members = response.data;
      } 
  } catch (error) {
      if(error.response.status === 404){
          console.log("查無資料");
      }else{
          console.error('請求失敗:', error);
      }
   }
  }
}
};
</script>
<style>
  .voucher {
  font-size: 25pt; 
  color: red; 
  }
  .custom-table {
width: 100%;
border: 2px solid #0a18d8;
background-color: #12597a;
}
</style>