<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="fixed inset-y-0 left-0 w-64 bg-white border-r transform -translate-x-full lg:translate-x-0 transition-transform duration-200 ease-in-out">
      <div class="h-16 flex items-center justify-center border-b">
        <router-link to="/admin" class="text-xl font-bold text-primary flex items-center gap-2">
          <ShieldCheckIcon class="w-6 h-6" />
          Admin Panel
        </router-link>
      </div>
      
      <nav class="p-4 space-y-2">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
          :class="{ 'bg-primary/5 text-primary': isCurrentRoute(link.path) }"
        >
          <component :is="link.icon" class="w-5 h-5" />
          {{ link.label }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <header class="h-16 bg-white border-b px-4 flex items-center justify-between">
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Bars3Icon class="w-6 h-6" />
        </button>

        <div class="flex items-center gap-4">
          <button
            @click="handleLogout"
            class="btn btn-primary"
          >
            Logout
          </button>
        </div>
      </header>

      <div class="p-6">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../lib/supabase'
import { useToast } from 'vue-toastification'
import {
  ShieldCheckIcon,
  Bars3Icon,
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'AdminLayout',
  components: {
    ShieldCheckIcon,
    Bars3Icon,
    HomeIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    ChartBarIcon,
    Cog6ToothIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    const sidebarOpen = ref(false)

    const navLinks = [
      { path: '/admin', label: 'Dashboard', icon: 'HomeIcon' },
      { path: '/admin/products', label: 'Products', icon: 'ShoppingBagIcon' },
      { path: '/admin/orders', label: 'Orders', icon: 'ChartBarIcon' },
      { path: '/admin/customers', label: 'Customers', icon: 'UserGroupIcon' },
      { path: '/admin/settings', label: 'Settings', icon: 'Cog6ToothIcon' }
    ]

    const isCurrentRoute = (path) => {
      return route.path === path
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const handleLogout = async () => {
      try {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/auth')
      } catch (error) {
        toast.error('Error logging out')
      }
    }

    return {
      navLinks,
      sidebarOpen,
      isCurrentRoute,
      toggleSidebar,
      handleLogout
    }
  }
}
</script>