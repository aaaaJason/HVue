<template>
  <div class="registration-form">
    <h2>商家註冊</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="mname">商家名稱</label>
        <input type="text" id="mname" v-model="mname" required>
      </div>
      <div class="form-group">
        <label for="mpassword">商家密碼</label>
        <input type="password" id="mpassword" v-model="mpassword" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">確認商家密碼</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
        <span v-if="passwordsMatch === false" class="alert">確認密碼不一致</span>
      </div>
      <div class="form-group">
        <label for="discount">折抵方式(小時)</label>
        <input type="number" id="discount" v-model.number="discount" required>
        <span class="note">24: 當日全天，1~23: 小時折抵</span>
       
      </div>
      <div class="form-group">
        <label for="voucher">折抵卷張數</label>
        <input type="number" id="voucher" v-model.number="voucher" required>
        <span v-if="voucher < 0" class="alert">折抵卷張數不能為負數</span>
      </div>
      <button type="submit" :disabled=" (discount < 1 ||discount>24) || voucher < 0" >確認</button>
    </form>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      mname: '',
      mpassword: '',
      confirmPassword: '',
      discount: null,
      voucher: null,
      passwordsMatch: true,
      registrationSuccess: false,
      userData: null
    };
  },
  methods: {
    async handleSubmit() {
      // 檢查密碼是否一致
      if (this.mpassword !== this.confirmPassword) {
        this.passwordsMatch = false;
        return;
      }

      // 檢查折抵方式和折抵卷張數是否合法
      if ((this.discount < 0||this.discount>23) || this.voucher < 0) {
        return;
      }

      // 密碼一致，重置密碼匹配狀態
      this.passwordsMatch = true;

      // 構造請求數據
      const requestData = {
        Mname: this.mname,
        MPassword: this.mpassword,
        Discount: this.discount,
        Voucher: this.voucher
      };

      try {
        // 發送POST請求到後端
        const response = await fetch('https://192.168.1.150:443/insertstore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        const responseData = await response.json();

        // 處理後端返回
        if (responseData.success) {
          this.registrationSuccess = true;
          this.userData = responseData.data; // 假設後端返回用戶資料
          const Mname=responseData.data.Mname
          const MAccount=responseData.data.MAccount
          // 提示註冊成功並重整頁面
          window.alert('註冊成功\n商家名稱：'+Mname+'\n商家帳號：'+MAccount+'\n請牢記商家帳號登入使用');
          window.location.reload();
        } else {
          alert('註冊失敗'); // 根據後端返回的具體錯誤進行處理
        }
      } catch (error) {
        console.error('註冊失敗：', error);
        alert('註冊失敗，請稍後重試');
      }
    }
  }
};
</script>

<style scoped>
.registration-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
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

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.alert {
  color: red;
}

.note {
  color: red;
  font-size: 0.8em;
}
</style>
