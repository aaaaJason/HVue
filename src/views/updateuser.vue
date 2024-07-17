<template>
  <div class="update-password-form">
    <h2>更新使用者密碼</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="account">帳號</label>
        <input type="text" id="account" v-model="account" required>
      </div>
      <div class="form-group">
        <label for="oldPassword">舊密碼</label>
        <input type="password" id="oldPassword" v-model="oldPassword" required>
      </div>
      <div class="form-group">
        <label for="newPassword">新密碼</label>
        <input type="password" id="newPassword" v-model="newPassword" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">確認新密碼</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit" >確認更新</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      account: '',
      newPassword: '',
      oldPassword:'',
      confirmPassword: '',
      passwordsMatch: null
    };
  },
  methods: {
    async handleSubmit() {
      this.passwordsMatch = this.newPassword === this.confirmPassword;
      if (!this.passwordsMatch && this.confirmPassword) {
        window.alert('兩次密碼輸入不同');
        return;
      }

      try {
        const response = await axios.put('http://192.168.1.150:2226/updateuser', {
          Account: this.account,
          oldPassword:this.oldPassword,
          NewPassword: this.newPassword
        });

        if (response.data.message === '密碼更新成功') {
          alert('密碼更新成功');
          window.location.href = '/';//登出
        } else {
          alert('密碼更新失敗: ' + response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          console.error('更新密碼時出錯:', error);
          alert('更新密碼失敗，請稍後再試');
        }
      }
    },
  }
};
</script>


<style scoped>

.update-password-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.update-password-form h2 {
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

.alert {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>
