<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="Mname" label="商家名稱">
      <template slot-scope="scope">
        <span class="table-cell">{{ scope.row.Mname }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="MAccount" label="商家帳號">
      <template slot-scope="scope">
        <span class="table-cell">{{ scope.row.MAccount }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="Discount" label="折抵方式" :formatter="formatDiscount"></el-table-column>
    <el-table-column prop="Voucher" label="折抵券張數">
      <template slot-scope="scope">
        <span class="table-cell-V">{{ scope.row.Voucher }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button type="success" @click="handleEdit(scope.row)">編輯</el-button>
        <el-button type="warning" @click="PasswordEdit(scope.row)">更改商家密碼</el-button>
        <el-button type="primary" @click="handleViewMembers(scope.row)">查看商家會員</el-button>
      </template>
    </el-table-column>
  </el-table>

    <!-- 編輯商家資訊對話框 -->
    <el-dialog title="編輯商家資訊" :visible.sync="dialogVisible">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="商家名稱">
          <el-input v-model="editForm.Mname" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商家帳號">
          <el-input v-model="editForm.MAccount" :disabled="true"></el-input>
        </el-form-item>
      <el-form-item label="折抵方式(小時)">
        <el-input-number 
          v-model.number="editForm.Discount" 
          :min="1" 
          :max="24"
          :step="1"
          @change="validateDiscount"
        />
        <br>
        <span  style="color: blueviolet;">折抵方式必須在 1 到 24 之間</span>
        </el-form-item>
        <el-form-item label="折抵券張數">
          <el-input-number  v-model.number="editForm.Voucher"  
          :step="1" 
          :controls="true"
          :precision="0" 
          @change="validateVoucher"></el-input-number>
          <br>
          <span v-if="errorCount" style="color: red;">{{ errorCount }}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </div>
    </el-dialog>

     <!-- 更改商家密碼對話框 -->
     <el-dialog title="更改商家密碼" :visible.sync="PassdialogVisible">
      <el-form ref="editForm" :model="editForm">
        <el-form-item label="商家帳號" >
          <el-input v-model="editForm.MAccount" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item  label="舊密碼">
          <el-input v-model="editForm.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密碼">
          <el-input v-model="editForm.newPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="確認新密碼">
          <el-input v-model="editForm.checkPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="PassdialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePass">送出</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      tableData: [], // 用於存儲 API 返回的數據
      dialogVisible: false,
      PassdialogVisible: false,
      editForm: {
        Mname: '',
        MAccount: '',
        Discount: '',
        Voucher: '',
        oldPassword:'',
        newPassword:'',
        checkPassword:''
      },
      errorCount:'',
      originalVoucher: 0,
    };
  },
  created() {
    this.fetchTableData(); // 組件創建時調用 API
  },
  watch: {
    'editForm.Discount': function(newValue) {
      this.validateDiscount(newValue);
    },
    'editForm.Voucher': function(newValue) {
      this.validateVoucher(newValue);
    }
  },
  methods: {
    async fetchTableData() {
      try {
        const response = await fetch('https://192.168.1.150:443/maindata', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          this.tableData = await response.json();
        } else {
          console.error('API 請求失敗', response.statusText);
        }
      } catch (error) {
        console.error('請求錯誤', error);
      }
    },
    async saveAPI() {
      try {
        const response = await axios.put('https://192.168.1.150:443/updatestore', {
          MAccount: this.editForm.MAccount,
          Discount: this.editForm.Discount,
          Voucher: this.editForm.Voucher
        });

        if (response.data.success) {
          window.alert('更新成功');
          this.dialogVisible = false;
          this.fetchTableData();
        } else {
          window.alert(`更新失敗: ${response.data.message}`);
        }
      } catch (error) {
        console.error(`更新失敗: ${error.response.data.message}`);
        window.alert(`更新失敗: ${error.response.data.message}`);
      }
    },
    handleEdit(row) {
      // 打開編輯對話框，並將行數據填充到編輯表單中
      this.dialogVisible = true;
      this.editForm = { ...row }; // 使用對象展開運算符複製行數據到編輯表單中
      this.originalVoucher = row.Voucher;
    },
    PasswordEdit(row) {
      // 打開編輯對話框，並將行數據填充到編輯表單中
      this.PassdialogVisible = true;
      this.editForm = { ...row }; // 使用對象展開運算符複製行數據到編輯表單中
    },
    handleViewMembers(row) {
      // 使用路由导航到 /storedata 并将商家数据作为参数传递
      console.log('傳遞的 Sid:', row.SId);
      this.$router.push({ 
        name: 'storedata',
        query: {
          MAccount: row.MAccount,
          Mname: row.Mname,
          Voucher:row.Voucher,
          Sid: row.SId 
        }
      });
    },
    saveEdit() {
      if (this.editForm.Discount < 1 || this.editForm.Discount > 24||this.editForm.Voucher < this.originalVoucher) {
        window.alert('請確定資料輸入無誤');
        return;
      }
        this.errorCount = '';
        this.errorMessage = '';
        console.log('保存編輯', this.editForm);
        this.saveAPI()
      
    },
    validateDiscount(value) {
      if (value < 1) {
        this.editForm.Discount = 1;
      } else if (value > 24) {
        this.editForm.Discount = 24;
      }
    },
    validateVoucher(value) {
      if (value < this.originalVoucher) {
        this.errorCount = '折抵券不可比原數量少。原張數：'+this.originalVoucher;
      } else {
        this.errorCount = '';
      }
    },
    formatDiscount(row, column, cellValue) {
      return cellValue === 24 ? '折抵整天' : `${cellValue} 小時`;
    },
    async savePass() {
      if(this.editForm.MAccount&&this.editForm.oldPassword&&this.editForm.newPassword&&this.editForm.checkPassword){
      if (this.editForm.newPassword!=this.editForm.checkPassword) {
        window.alert('兩次密碼輸入不同');
        return;
      }
      try {
        const response = await axios.put('https://192.168.1.150:443/updatestore', {
          MAccount: this.editForm.MAccount,
          oldPassword:this.editForm.oldPassword,
          MPassword: this.editForm.newPassword,
        });

        if (response.data.success) {
          window.alert('密碼更新成功');
          this.PassdialogVisible = false;
        } else {
          window.alert(`更新失敗: ${response.data.message}`);
        }
      } catch (error) {
          window.alert(`更新失敗: ${error.response.data.message}`);

      }
    }else{
      window.alert('請輸入完整資料');
    }
  },
    
  },
};
</script>

<style scoped>
.el-table {
  border: 2px solid #080808;
  background-color: #edf1f3;
}
.table-cell {
  font-size: 20px;
  font-weight: bold; 
}
.table-cell-V{
  font-size: 20px;
  font-weight: bold; 
  color: rgb(53, 167, 30)
}
</style>
