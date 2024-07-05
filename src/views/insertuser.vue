<template>
  <div class="user-registration">
    <h2>新增使用者</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="account">帳號</label>
        <input type="text" id="account" v-model="account" required>
      </div>
      <div class="form-group">
        <label for="password">密碼</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div class="form-group">
        <label for="Checkpassword">確認密碼</label>
        <input type="password" id="Checkpassword" v-model="Checkpassword" required>
      </div>
      <div class="form-group">
        <label for="username">使用者名稱</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <button type="submit">確認新增</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      account: '',
      password: '',
      Checkpassword:'',
      username: ''
    };
  },
  methods: {
    async handleSubmit() {
      if(this.password==this.Checkpassword){
        try {
          const response = await axios.post('http://192.168.1.150:2224/insertuser', {
            Account: this.account,
            Password: this.password,
            Username: this.username
          });

          if (response.data.message === '使用者新增成功') {
            alert('使用者新增成功');
            window.location.reload();
          } else {
            alert(response.data.message);
          }
        } catch (error) {
          console.error('新增使用者時發生錯誤:', error);
          alert('新增使用者失敗，請稍後再試');
        }
      }else{
        alert('確認密碼與密碼需相同');
      }
    }
  }
};
</script>

<style scoped>
.user-registration {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.user-registration h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
