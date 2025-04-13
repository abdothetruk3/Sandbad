<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold gradient-text">Admin Dashboard</h1>
      <span class="text-gray-600">Welcome, {{ user?.email }}</span>
    </div>

    <!-- Stats Overview -->
    <div class="grid md:grid-cols-4 gap-6">
      <div 
        v-for="(stat, index) in stats" 
        :key="index"
        class="card gradient-card-hover transform hover:scale-105 transition-all duration-300"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, delay: index * 100 }"
      >
        <component 
          :is="stat.icon" 
          class="w-8 h-8 mb-4 text-primary"
        />
        <div class="flex items-end gap-2 mb-2">
          <h3 class="text-2xl font-bold">{{ stat.value }}</h3>
          <span 
            :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'"
            class="text-sm font-medium"
          >
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
        </div>
        <p class="text-gray-600">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Sales Chart -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, x: -50 }"
        :enter="{ opacity: 1, x: 0 }"
      >
        <h2 class="text-xl font-semibold mb-6">Sales Overview</h2>
        <div class="h-64">
          <LineChart :chartData="salesChartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Popular Products -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, x: 50 }"
        :enter="{ opacity: 1, x: 0 }"
      >
        <h2 class="text-xl font-semibold mb-6">Popular Products</h2>
        <div class="space-y-4">
          <div 
            v-for="product in popularProducts" 
            :key="product.id"
            class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img 
              :src="product.image_url" 
              :alt="product.name"
              class="w-12 h-12 rounded-lg object-cover"
            />
            <div class="flex-grow">
              <h3 class="font-medium">{{ product.name }}</h3>
              <p class="text-sm text-gray-600">{{ product.category }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">${{ product.price }}</p>
              <p class="text-sm text-gray-600">{{ product.sales }} sales</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders and Inventory -->
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Recent Orders -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0 }"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Recent Orders</h2>
          <router-link to="/admin/orders" class="text-primary hover:underline">View all</router-link>
        </div>
        <div class="space-y-4">
          <div 
            v-for="order in recentOrders" 
            :key="order.id"
            class="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div>
              <p class="font-medium">Order #{{ order.id.slice(0, 8) }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(order.created_at) }}</p>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-lg font-semibold">${{ order.total.toFixed(2) }}</span>
              <span 
                class="px-3 py-1 rounded-full text-sm"
                :class="getStatusClass(order.status)"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Products -->
      <div 
        class="card"
        v-motion
        :initial="{ opacity: 0, y: 50 }"
        :enter="{ opacity: 1, y: 0, delay: 200 }"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Low Stock Alert</h2>
          <router-link to="/admin/products" class="text-primary hover:underline">Manage inventory</router-link>
        </div>
        <div class="space-y-4">
          <div 
            v-for="product in lowStockProducts" 
            :key="product.id"
            class="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <img 
                :src="product.image_url" 
                :alt="product.name"
                class="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <p class="font-medium">{{ product.name }}</p>
                <p class="text-sm text-gray-600">{{ product.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-red-600">{{ product.stock }} left</p>
              <button 
                @click="restockProduct(product.id)"
                class="text-sm text-primary hover:underline"
              >
                Restock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics & Insights -->
    <div class="card" v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0, delay: 300 }">
      <h2 class="text-xl font-semibold mb-6">Analytics & Insights</h2>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Category Distribution -->
        <div class="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Sales by Category</h3>
          <div class="h-48">
            <DoughnutChart :chartData="categoryChartData" :options="doughnutOptions" />
          </div>
        </div>
        
        <!-- Monthly Revenue -->
        <div class="bg-gradient-to-br from-secondary/5 to-primary/5 p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Monthly Revenue</h3>
          <div class="h-48">
            <BarChart :chartData="monthlyRevenueData" :options="barOptions" />
          </div>
        </div>
        
        <!-- User Acquisition -->
        <div class="bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-4">User Demographics</h3>
          <div class="h-48">
            <PieChart :chartData="userDemographicsData" :options="doughnutOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div 
      class="grid grid-cols-2 md:grid-cols-4 gap-4"
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, delay: 400 }"
    >
      <router-link to="/admin/products" class="card text-center hover:shadow-elevation-3 transition-all py-5">
        <ShoppingBagIcon class="w-8 h-8 text-primary mx-auto mb-2" />
        <p class="font-medium">Manage Products</p>
      </router-link>
      
      <router-link to="/admin/orders" class="card text-center hover:shadow-elevation-3 transition-all py-5">
        <ClipboardDocumentListIcon class="w-8 h-8 text-primary mx-auto mb-2" />
        <p class="font-medium">Manage Orders</p>
      </router-link>
      
      <router-link to="/admin/customers" class="card text-center hover:shadow-elevation-3 transition-all py-5">
        <UserGroupIcon class="w-8 h-8 text-primary mx-auto mb-2" />
        <p class="font-medium">Manage Customers</p>
      </router-link>
      
      <router-link to="/admin/settings" class="card text-center hover:shadow-elevation-3 transition-all py-5">
        <Cog6ToothIcon class="w-8 h-8 text-primary mx-auto mb-2" />
        <p class="font-medium">Site Settings</p>
      </router-link>
    </div>

    <!-- Add Product Modal -->
    <TransitionRoot appear :show="isAddProductModalOpen" as="template">
      <Dialog as="div" @close="closeAddProductModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <DialogTitle class="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Add New Product
                </DialogTitle>

                <form @submit.prevent="handleAddProduct" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      v-model="newProduct.name"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select v-model="newProduct.category_id" required class="select">
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      v-model="newProduct.description"
                      rows="3"
                      class="input"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      v-model="newProduct.price"
                      step="0.01"
                      min="0"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input
                      type="number"
                      v-model="newProduct.stock"
                      min="0"
                      required
                      class="input"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      v-model="newProduct.image_url"
                      class="input"
                    />
                  </div>

                  <div class="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      @click="closeAddProductModal"
                      class="btn btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="isSubmitting"
                    >
                      {{ isSubmitting ? 'Adding...' : 'Add Product' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { supabase } from '../../lib/supabase'
import { useToast } from 'vue-toastification'
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'
import { LineChart, BarChart, DoughnutChart, PieChart } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

export default {
  name: 'AdminDashboard',
  components: {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
    CurrencyDollarIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ClipboardDocumentListIcon,
    Cog6ToothIcon,
    LineChart,
    BarChart,
    DoughnutChart,
    PieChart
  },
  setup() {
    const toast = useToast()
    const user = computed(() => supabase.auth.currentUser)
    const isAddProductModalOpen = ref(false)
    const isSubmitting = ref(false)
    const categories = ref([])
    const recentOrders = ref([])
    const lowStockProducts = ref([])
    const popularProducts = ref([])
    const totalRevenue = ref(0)
    const totalOrders = ref(0)
    const totalCustomers = ref(0)
    const totalProducts = ref(0)

    const newProduct = ref({
      name: '',
      category_id: '',
      description: '',
      price: 0,
      stock: 0,
      image_url: ''
    })

    // Chart data
    const salesChartData = ref({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Sales 2025',
          borderColor: '#0e7490',
          backgroundColor: 'rgba(14,116,144,0.1)',
          data: [5500, 6200, 7800, 8500, 9200, 10500, 11800, 13200, 14500, 15800, 17200, 19500],
          tension: 0.4,
          fill: true
        }
      ]
    })

    const categoryChartData = ref({
      labels: ['Pain Relief', 'Vitamins', 'Skincare', 'Dental Care', 'First Aid', 'Supplements'],
      datasets: [
        {
          data: [35, 25, 15, 10, 8, 7],
          backgroundColor: [
            'rgba(239, 68, 68, 0.7)',   // Red
            'rgba(34, 197, 94, 0.7)',   // Green
            'rgba(168, 85, 247, 0.7)',  // Purple
            'rgba(6, 182, 212, 0.7)',   // Cyan
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(234, 179, 8, 0.7)'    // Yellow
          ]
        }
      ]
    })

    const monthlyRevenueData = ref({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Revenue',
          backgroundColor: 'rgba(14, 116, 144, 0.7)',
          data: [12500, 15200, 18800, 22500, 24800, 27500]
        }
      ]
    })

    const userDemographicsData = ref({
      labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
      datasets: [
        {
          data: [15, 30, 25, 20, 10],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Blue
            'rgba(14, 116, 144, 0.7)',  // Teal
            'rgba(6, 182, 212, 0.7)',   // Cyan
            'rgba(2, 132, 199, 0.7)',   // Sky
            'rgba(3, 105, 161, 0.7)'    // Dark blue
          ]
        }
      ]
    })

    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    const barOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }

    const stats = computed(() => [
      {
        label: 'Total Revenue',
        value: `$${totalRevenue.value.toFixed(2)}`,
        icon: 'CurrencyDollarIcon',
        trend: 12.5
      },
      {
        label: 'Total Orders',
        value: totalOrders.value,
        icon: 'ShoppingBagIcon',
        trend: 8.2
      },
      {
        label: 'Total Customers',
        value: totalCustomers.value,
        icon: 'UserGroupIcon',
        trend: 15.3
      },
      {
        label: 'Total Products',
        value: totalProducts.value,
        icon: 'ChartBarIcon',
        trend: 5.7
      }
    ])

    const getStatusClass = (status) => {
      return {
        'pending': 'bg-yellow-100 text-yellow-800',
        'processing': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
      }[status]
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase
          .from('product_categories')
          .select('*')
        categories.value = categoriesData || []

        // Fetch recent orders
        const { data: orders } = await supabase
          .from('orders')
          .select(`
            id,
            total,
            status,
            created_at,
            profiles (
              email
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5)
        recentOrders.value = orders || []

        // Fetch low stock products
        const { data: lowStock } = await supabase
          .from('products')
          .select('*')
          .lt('stock', 10)
          .order('stock', { ascending: true })
          .limit(5)
        lowStockProducts.value = lowStock || []

        // Fetch popular products
        const { data: popular } = await supabase
          .from('products')
          .select('*')
          .order('popularity', { ascending: false })
          .limit(5)
        
        // Add mock sales data for display purposes
        popularProducts.value = (popular || []).map(p => ({
          ...p,
          sales: Math.floor(Math.random() * 500) + 100
        }))

        // Calculate total revenue
        const { data: revenue } = await supabase
          .from('orders')
          .select('total')
          .eq('status', 'completed')
        totalRevenue.value = revenue?.reduce((sum, order) => sum + order.total, 0) || 0

        // Count total orders
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
        totalOrders.value = orderCount || 0

        // Count total customers
        const { count: customerCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
        totalCustomers.value = customerCount || 0

        // Count total products
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
        totalProducts.value = productCount || 0

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Error loading dashboard data')
      }
    }

    const handleAddProduct = async () => {
      try {
        isSubmitting.value = true
        const { data, error } = await supabase
          .from('products')
          .insert([newProduct.value])
          .select()

        if (error) throw error

        toast.success('Product added successfully')
        closeAddProductModal()
        fetchDashboardData()
      } catch (error) {
        console.error('Error adding product:', error)
        toast.error('Error adding product')
      } finally {
        isSubmitting.value = false
      }
    }

    const restockProduct = async (productId) => {
      try {
        const { error } = await supabase
          .from('products')
          .update({ stock: 100 })
          .eq('id', productId)

        if (error) throw error

        toast.success('Product restocked successfully')
        fetchDashboardData()
      } catch (error) {
        console.error('Error restocking product:', error)
        toast.error('Error restocking product')
      }
    }

    const closeAddProductModal = () => {
      isAddProductModalOpen.value = false
      newProduct.value = {
        name: '',
        category_id: '',
        description: '',
        price: 0,
        stock: 0,
        image_url: ''
      }
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return {
      user,
      stats,
      recentOrders,
      lowStockProducts,
      popularProducts,
      categories,
      isAddProductModalOpen,
      isSubmitting,
      newProduct,
      getStatusClass,
      formatDate,
      handleAddProduct,
      restockProduct,
      closeAddProductModal,
      salesChartData,
      categoryChartData,
      monthlyRevenueData,
      userDemographicsData,
      chartOptions,
      barOptions,
      doughnutOptions
    }
  }
}
</script>