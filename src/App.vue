<template>
  <v-app>
  <v-app-bar app color="green" dark>
    <v-btn v-if="$route.path !== '/'" icon @click="toggleDrawer">
       <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-toolbar-title>停車場帳號管理系統</v-toolbar-title>
    <v-spacer></v-spacer>
    <span v-if="$route.path !== '/'" class="username">使用者：{{ username }}</span>
  </v-app-bar>
  <v-navigation-drawer v-if="$route.path !== '/'" app v-model="drawer" temporary>
      <!-- 添加關閉按鈕 -->
      <v-list-item>
        <v-list-item-action>
          <v-btn icon @click="toggleDrawer">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <!-- 導航抽屜內容 -->
      <v-list>
      <!-- 主页面链接 -->
      <v-list-item v-on:click="goTo('/main')">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>主畫面</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <!-- 使用者新增链接 -->
      <v-list-item v-on:click="goTo('/insertuser')">
        <v-list-item-icon>
          <v-icon>mdi-account-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>使用者新增</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <!-- 使用者变更密码链接 -->
      <v-list-item v-on:click="goTo('/updateuser')">
        <v-list-item-icon>
          <v-icon>mdi-lock-reset</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>更新使用者密碼</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- 商家頁面 -->
      <v-list-item v-on:click="goTo('/insertstore')">
        <v-list-item-icon>
          <v-icon>mdi-storefront-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>新增商家</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <!-- 登出 -->
      <v-list-item v-on:click="goTo('/')">
        <v-list-item-icon>
        <v-icon>mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
         <v-list-item-title>登出</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    </v-navigation-drawer>

  <!-- 根据应用组件来调整你的内容 -->
  <v-main>
    <!-- 给应用提供合适的间距 -->
    <!-- <v-container fluid> -->
      <router-view></router-view>
    <!-- </v-container> -->
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>


<script>
import Cookies from 'js-cookie';
import { ref } from 'vue';
export default {
  data() {
    return {
      username: '' ,
    };
  },
  name: 'App',
  created() {
    // 在组件创建时获取 Cookie 中的用户名
    this.getUsernameFromCookie();
  },
  methods: {
    goTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      } else {
        console.log('已在當前路徑，無須前往');
      }
    },
    getUsernameFromCookie() {
      // 使用 js-cookie 库从 Cookie 中获取存储的用户名
      const login = Cookies.get('login');
      if (login) {
        // 如果 Cookie 中存在用户名，将其赋值给组件的数据属性
        const parsedLogin = JSON.parse(login);//解析JSON
        this.username = parsedLogin.username;
      }
    }
  },setup() {
    const drawer = ref(false);

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    };

    return {
      drawer,
      toggleDrawer,
    };
  },
  
};
</script>
<style scoped>
.user-info {
  display: flex;
  align-items: center;
}

.username {
  margin-right: 20px; /* 你可以根據需求調整這裡的數值 */
}

.logout-button {
  margin-left: 20px; /* 這裡也可以根據需求調整 */
}


</style>
