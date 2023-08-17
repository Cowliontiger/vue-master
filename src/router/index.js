
import Vue from 'vue'
import Router from 'vue-router'

const Login = resolve => require(['../page/login/login'], resolve)
const Home = resolve => require(['../page/home/home'], resolve)
const Test = resolve => require(['../page/DB/DBTable'], resolve)

const Excel = resolve => require(['../page/excel/excel'], resolve)
const TestPlan = resolve => require(['../page/testPlan/testPlan'], resolve)
const Chart = resolve => require(['../page/chart/chart'], resolve)
const OrderReceivable = resolve => require(['../page/inquiry/OrderReceivable'], resolve)
const TransactionFlow =  resolve => require(['../page/inquiry/TransactionFlow'], resolve)
const SystemStatement = resolve => require(['../page/inquiry/SystemStatement'], resolve)
const orderDetail = resolve => require(['../page/inquiry/children/orderDetail'],resolve)
const orderAdd = resolve => require(['../page/inquiry/children/orderAdd'],resolve)
const BankFlow = resolve => require(['../page/inquiry/BankFlow'], resolve)
const VerifyReceivables = resolve => require(['../page/verifyPlatform/VerifyReceivables'], resolve)
const VerifyBankStatement = resolve => require(['../page/verifyPlatform/VerifyBankStatement'], resolve)
const VerifyReceivablesRecord = resolve => require(['../page/verifyRecord/VerifyReceivablesRecord'], resolve)
const VerifyBankStatementRecord = resolve => require(['../page/verifyRecord/VerifyBankStatementRecord'], resolve)
const OrderSummary =  resolve => require(['../page/reportForms/OrderSummary'], resolve)
const ReceivablesBalance = resolve => require(['../page/reportForms/ReceivablesBalance'], resolve)
const Upload = resolve => require(['../page/upload/upload'], resolve)
const Structure = resolve => require(['../page/set/structure'], resolve)
const UpdatePWD = resolve => require(['../page/set/updatePWD'], resolve)
const VerifyAutomate = resolve => require(['../page/verifyPlatform/verifyAutomate'], resolve)

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '',
      redirect: '/login'
    },
    {
      path:'/home',
      component: Home,
      meta: { title: '自述文件' },
      children: [
        { //我的账户
          path: '/test',
          component: Test,
          meta: { title: '测试数据库' }
        },
        { //测试案例
          path: '/excel',
          component: Excel,
          meta: { title: '测试案例' }
        },
        { //测试调度
          path: '/testPlan',
          component: TestPlan,
          meta: { title: '测试调度' }
        },

        {
          path: '/Upload',
          component: Upload,
          meta: {title: '文件上传'}
        },
        /**
        * 设置
        * */
        {
          path: '/Structure',
          component: Structure,
          meta: { title: '组织架构'}
        },
        //修改密码
        {
          path: '/UpdatePWD',
          component: UpdatePWD,
          meta: { title: '修改密码'}
        }
      ]
    },
    {
      path: '/login',
      component: Login,
      meta: { title: '登陆' }
    }
  ]


})
