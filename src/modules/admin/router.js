export default [
  // ✅ Admin Auth Routes (No Sidebar/Navbar)
  {
    path: '/admin/login',
    component: () => import('./layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin.login',
        component: () => import('./pages/auth/Login.vue')
      }
    ]
  },

  // ✅ Admin Dashboard & Protected Pages
  {
    path: '/admin',
    component:() => import('./layouts/AdminLayout.vue'),
    meta: { requiresAuth: true, role: 'admin' }, // ✅ secure all admin routes
    children: [
      //--------------Sale------------------------
     {
        path:'sale',
        name:'admin.sale',
        component: () => import('./pages/sale/Sale.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },

       {
        path:'sale-list',
        name:'admin.sale-list',
        component: () => import('./pages/sale/SaleList.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },

      //--------------Credit Customers------------------------
      //index
      {
        path:'credit-customers',
        name:'admin.credit-customers',
        component: () => import('./pages/credit/Index_Credit_Customers.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path:'credits-customer/:id',
        name:'admin.credits-customer',
        component: () => import('./pages/credit/Credits_Customer.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      //--------------Customer Payments detail
       {
        path:'customer-payments/:id',
        name:'admin.customer-payments',
        component: () => import('./pages/credit/Customer_Payments.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },

      {
        path: 'supplier',
        name: 'admin.supplier',
        component: () => import('./pages/supplier/Suppliers.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'supplier-detail/:id',
        name: 'admin.supplier-detail',
        component: () => import('./pages/supplier/Supplier_Detail.vue'),
        meta: { requiresAuth: true, role: 'admin' }
           },

      {
      path: 'stock-invoice/:id/:supplier_id',
      name: 'admin.stock-invoice',
      component: () => import('./pages/supplier/Order_Item_Stock_Invoice.vue'),
      meta: { requiresAuth: true, role: 'admin' }
      },

      {
      path: 'supplier-payments/:supplier_id',
      name: 'admin.supplier-payments',
      component: () => import('./pages/supplier/Supplier_Payments.vue'),
      meta: { requiresAuth: true, role: 'admin' }
      },
      // more admin pages...
      {
        path:'category',
        name:'admin.categories',
        component: () => import('./pages/item-category/Category.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path:'item',
        name:'admin.item',
        component: () => import('./pages/item/Item.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      //-------------Units-----------------------
      {
        path:'unit',
        name:'admin.unit',
        component: () => import('./pages/unit/Unit.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
     
     //--------------Expense
      {
        path:'expense',
        name:'admin.expense',
        component: () => import('./pages/expense/Expense.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      
      {
        path:'expense-category',
        name:'admin.expense-category',
        component: () => import('./pages/expense-category/ExpenseCategory.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      
      //--------------Account and Transaction-----------
       {
        path:'accounts',
        name:'admin.accounts',
        component: () => import('./pages/account/Index_Account.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      // {
      //   path:'account-detail',
      //   name:'admin.accounts-detail',
      //   component: () => import('./pages/account/AccountDetail.vue'),
      //   meta: { requiresAuth: true, role: 'admin' }
      // },
      {
        path:'transactions',
        name:'admin.transactions',
        component: () => import('./pages/transaction/Transaction.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },

       //--------------Report-----------
       {
        path:'report-transactions',
        name:'admin.report-transactions',
        component: () => import('./pages/report/Report_Transaction.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },

      //------------------------Report Sale Items------------------
      {
        path:'report-sale-items',
        name:'admin.report-sale-items',
        component: () => import('./pages/report/Report_Sale_Items.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },
      //------------------------Report All------------------
      {
        path:'report-all',
        name:'admin.report-all',
        component: () => import('./pages/report/Report_All.vue'),
        meta: { requiresAuth: true, role: 'admin' }
      },

      //--------------Customers
      {
        path:'customer',
        name:'admin.customer',
        component: ()=> import('./pages/customer/Customer.vue')
        ,meta: { requiresAuth: true, role: 'admin' } // ✅ added
      }
      ,
      {
        path:'admins',
        name:'admin.admins',
        component: ()=> import('./pages/admin/Admin.vue')
        ,meta: { requiresAuth: true, role: 'admin' } // ✅ added
      },
      {
        path:'admins/permissions-admin/:id?',
        name:'admin.permissions-admin',
        component: ()=> import('./pages/admin/Permissions_Admin.vue')
        ,meta: { requiresAuth: true, role: 'admin' } // ✅ added
      }
      ,
      {
        path:'about',
        name:'admin.about',
        component: ()=> import('./pages/about/About.vue')
        ,meta: { requiresAuth: true, role: 'admin' } // ✅ added
      }
      ,
    ]
  }
]
