<template>
  <div class="container">
    <table class="login-table">
      <tr>
        <td align="center">
          <h2>系統登入</h2>
          <form @submit.prevent="login">
            <div class="input-container">
              <label for="username">帳號：</label>
              <input type="text" id="username" v-model="loginForm.username" class="custom-input">
            </div>
            <div class="input-container">
              <label for="password">密碼：</label>
              <input type="password" id="password" v-model="password" class="custom-input">
            </div>
            <div class="button-container">
              <button type="submit" class="login-button">登入</button>
            </div>
          </form>
          <p v-if="error" style="color: red;">{{ error }}</p>
        </td>
      </tr>
    </table>
  </div>
</template>
  

  

  <script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      loginForm: {
        username: '',
        token: '' // 初始化 token
      },
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('https://192.168.1.150:443/userslogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.loginForm.username, // 使用 loginForm 中的 username
            password: this.password  // 使用 loginForm 中的 password
          })
        });

        const data = await response.json();
        if (response.ok && data.success) {
          const token = data.token; // 确保 token 来自响应数据
          this.loginForm.token = token; // 使用 token 初始化 loginForm 的 token
          console.log(this.loginForm);
          Cookies.set('login', JSON.stringify(this.loginForm), { expires: 1 });
          if (Cookies.get('login') && this.loginForm.token) {
            this.$router.push('/main');
            window.location.reload();
          }
        } else {
          this.error = data.error || '登入失敗，帳號或密碼錯誤';
        }
      } catch (error) {
        console.error('Error:', error);
        this.error = '無法連接到伺服器，請稍後再試';
      }
    }
  }
};
</script>

   <style scoped>
   .container {
     display: flex;
     justify-content: center;
     align-items: center;
     height: 100vh;
   }
   
   .login-table {
     width: 30%;
     height: 40%;
     background-color: #ccc;
   }
   
   .input-container,
   .button-container {
     padding: 10px;
   }
   
   .login-button {
     background-color: #4ae252;
     border: none;
     color: white;
     padding: 10px 20px;
     text-align: center;
     text-decoration: none;
     display: inline-block;
     font-size: 16px;
     margin: 4px 2px;
     transition-duration: 0.4s;
     cursor: pointer;
     border-radius: 12px;
   }
   
   .login-button:hover {
     background-color:#0b5c0b ;
   }
   
   /* 自定義輸入框樣式 */
   .custom-input {
     padding: 8px;
     border: 1px solid #ccc;
     border-radius: 5px;
     font-size: 16px;
     background-color: white; /* 將背景色設置為白色 */
   }
   
   /* 輸入框聚焦時的樣式 */
   .custom-input:focus {
     outline: none;
     border-color: #470ceb;
     box-shadow: 0 0 5px #470ceb;
   }
   </style>