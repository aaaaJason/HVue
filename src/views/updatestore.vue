<template>
  <div class="update-password-form">
    <h2>更新商家密碼</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="MAccount">商家帳號</label>
        <input type="text" id="MAccount" v-model="MAccount" required>
      </div>
      <div class="form-group">
        <label for="newPassword">新密碼</label>
        <input type="password" id="newPassword" v-model="newPassword" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">確認新密碼</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
      </div>
      <button type="submit">確認</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      MAccount: '',
      newPassword: '',
      confirmPassword: '',
      passwordsMatch: null,
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
        const response = await axios.put('https://192.168.1.150:443/updatestore', {
          MAccount: this.MAccount,
          MPassword: this.newPassword,
        });

        if (response.data.success) {
          window.alert('密碼更新成功');
          window.location.href = '/';//登出
        } else {
          window.alert(`更新失敗: ${response.data.message}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          window.alert('更新失敗: 未找到對應的商家');
        } else {
          console.error('更新密碼時出錯:', error);
          window.alert('更新密碼失敗，請稍後再試');
        }
      }
    },
  },
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

input[type="text"],
input[type="password"],
input[type="number"] {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
}

.form-group .alert {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background: #ccc;
}
</style>
