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
        <label for="voucher">折抵卷張數</label>
        <input type="number" id="voucher" v-model.number="voucher" required>
        <span v-if="voucher < 0" class="alert">折抵卷張數不能為負數</span>
      </div>
      <v-container>
        <label>設定折抵券時數</label>
        <v-select v-if="!isAllDay" v-model="discount" :items="hours" item-text="text" item-value="value" label="選擇每張折抵時數">
        </v-select>
        <v-checkbox v-model="isAllDay" @change="resetDiscount" label="每張整天折抵"></v-checkbox>
      </v-container>

      
      <button type="submit" :disabled=" !discount||voucher < 0" >確認</button>
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
      userData: null,
      isAllDay: false,  // 是否选择全天折抵
      hours: Array.from({ length: 23 }, (v, k) => ({
        text: `折抵${k + 1}小時`,
        value: k + 1
      }))
    };
  },
  methods: {
    resetDiscount() {
      if (this.isAllDay) {
        // 如果选择了全天折抵，将值设置为 24
        this.discount = 24;
      } else {
        // 如果未选择全天折抵，重置折抵值
        this.discount = null;
      }
    },
    async handleSubmit() {
      // 檢查密碼是否一致
      if (this.mpassword !== this.confirmPassword) {
        this.passwordsMatch = false;
        return;
      }

      // 檢查折抵方式和折抵卷張數是否合法
      if ( this.voucher < 0) {
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
        const response = await fetch('http://192.168.1.150:2224/insertstore', {
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
.form-group {
  margin-bottom: 1em;
}
/* 自定义复选框标签的样式 */
.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}

/* 自定义复选框文字的样式 */
.checkbox-label {
  font-size: 1.5em;  /* 设置“整天折抵”的文字大小 */
  margin-left: 0.5em;
}

/* 自定义下拉框的样式 */
.select-style {
  width: 200px;  /* 设置下拉框的宽度 */
  padding: 5px;  /* 设置内边距 */
  border-radius: 5px;  /* 设置边框圆角 */
  border: 1px solid #ccc;  /* 设置边框样式 */
  background-color: #f8f8f8;  /* 设置背景颜色 */
  color: #333;  /* 设置文字颜色 */
  font-size: 1em;  /* 设置文字大小 */
}

</style>
