<template>
  <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-elevation-1">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2">
          <img :src="siteSettings.site_logo || '/src/assets/sendbad.png'" alt="Logo" class="h-10 w-auto" />
          <span class="text-2xl font-bold medical-text-gradient">{{ siteSettings.site_title || (currentLocale === 'ar' ? 'سندباد' : 'Sandbad') }}</span>
        </router-link>
        
        <div class="hidden md:flex items-center space-x-8">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            :class="{ 'bg-primary/5 text-primary': isCurrentRoute(link.path) }"
          >
            <component :is="link.icon" class="w-5 h-5" />
            {{ $t(`nav.${link.key}`) }}
          </router-link>

          <!-- Admin Dashboard Link (only for admin users) -->
          <router-link 
            v-if="isAdmin"
            to="/admin" 
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors shadow-elevation-1"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            Admin Dashboard
          </router-link>

          <div v-if="user" class="relative">
            <Menu as="div" class="relative inline-block text-left">
              <MenuButton class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors">
                <UserCircleIcon class="w-6 h-6" />
                <span>{{ currentLocale === 'ar' ? 'الحساب' : 'Account' }}</span>
                <ChevronDownIcon class="w-4 h-4" />
              </MenuButton>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-elevation-2 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <router-link
                        to="/profile"
                        :class="[
                          active ? 'bg-primary/5 text-primary' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        ]"
                      >
                        {{ currentLocale === 'ar' ? 'الملف الشخصي' : 'Profile' }}
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <router-link
                        to="/orders"
                        :class="[
                          active ? 'bg-primary/5 text-primary' : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        ]"
                      >
                        {{ currentLocale === 'ar' ? 'الطلبات' : 'Orders' }}
                      </router-link>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <button
                        @click="handleLogout"
                        :class="[
                          active ? 'bg-primary/5 text-primary' : 'text-gray-700',
                          'block w-full text-left px-4 py-2 text-sm'
                        ]"
                      >
                        {{ $t('buttons.logout') }}
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>

          <router-link 
            v-else 
            to="/auth" 
            class="btn btn-primary flex items-center gap-2 shadow-elevation-2 hover:shadow-elevation-3"
          >
            <UserIcon class="w-5 h-5" />
            {{ $t('buttons.signIn') }}
          </router-link>

          <router-link 
            to="/cart" 
            class="relative flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <ShoppingCartIcon class="w-6 h-6" />
            <span 
              v-if="cartStore.totalItems" 
              class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full"
            >
              {{ cartStore.totalItems }}
            </span>
          </router-link>
        </div>

        <!-- Mobile Menu Button -->
        <button 
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="md:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Bars3Icon v-if="!isMobileMenuOpen" class="w-6 h-6" />
          <XMarkIcon v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            :class="{ 'bg-primary/5 text-primary': isCurrentRoute(link.path) }"
            @click="isMobileMenuOpen = false"
          >
            <component :is="link.icon" class="w-5 h-5" />
            {{ $t(`nav.${link.key}`) }}
          </router-link>

          <!-- Admin Dashboard Link (Mobile) -->
          <router-link
            v-if="isAdmin"
            to="/admin"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            Admin Dashboard
          </router-link>

          <router-link
            v-if="!user"
            to="/auth"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <UserIcon class="w-5 h-5" />
            {{ $t('buttons.signIn') }}
          </router-link>

          <div v-else class="space-y-1">
            <router-link
              to="/profile"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
              @click="isMobileMenuOpen = false"
            >
              <UserCircleIcon class="w-5 h-5" />
              {{ currentLocale === 'ar' ? 'الملف الشخصي' : 'Profile' }}
            </router-link>
            <router-link
              to="/orders"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
              @click="isMobileMenuOpen = false"
            >
              <ClipboardDocumentListIcon class="w-5 h-5" />
              {{ currentLocale === 'ar' ? 'الطلبات' : 'Orders' }}
            </router-link>
            <button
              @click="handleLogout"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors w-full"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              {{ $t('buttons.logout') }}
            </button>
          </div>
          
          <router-link
            to="/cart"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-colors"
            @click="isMobileMenuOpen = false"
          >
            <div class="relative">
              <ShoppingCartIcon class="w-5 h-5" />
              <span 
                v-if="cartStore.totalItems" 
                class="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-primary rounded-full"
              >
                {{ cartStore.totalItems }}
              </span>
            </div>
            Cart
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useToast } from 'vue-toastification'
import { useCartStore } from '../stores/cartStore'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
  HeartIcon,
  ShoppingCartIcon,
  HomeIcon,
  ShoppingBagIcon,
  UserIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Navbar',
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    HeartIcon,
    ShoppingCartIcon,
    HomeIcon,
    ShoppingBagIcon,
    UserIcon,
    UserCircleIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
    ClipboardDocumentListIcon,
    ArrowRightOnRectangleIcon,
    ShieldCheckIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    const isMobileMenuOpen = ref(false)
    const user = computed(() => supabase.auth.currentUser)
    const cartStore = useCartStore()
    const currentLocale = inject('locale')
    const siteSettings = inject('siteSettings', ref({}))
    const $t = inject('t')
    const isAdmin = ref(false)

    const navLinks = [
      { path: '/', key: 'home', icon: 'HomeIcon' },
      { path: '/products', key: 'products', icon: 'ShoppingBagIcon' },
      { path: '/about', key: 'about', icon: 'HeartIcon' }
    ]

    const isCurrentRoute = (path) => {
      return route.path === path
    }

    const handleLogout = async () => {
      try {
        await supabase.auth.signOut()
        toast.success(currentLocale.value === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')
        router.push('/')
        isMobileMenuOpen.value = false
      } catch (error) {
        toast.error(currentLocale.value === 'ar' ? 'خطأ في تسجيل الخروج' : 'Error logging out')
      }
    }

    // Check if the current user is an admin
    const checkAdminStatus = async () => {
      if (user.value) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.value.id)
            .single()

          if (error) throw error
          isAdmin.value = data?.role === 'admin'
        } catch (error) {
          console.error('Error checking admin status:', error)
        }
      } else {
        isAdmin.value = false
      }
    }

    onMounted(() => {
      checkAdminStatus()
      
      // Listen for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          checkAdminStatus()
        } else if (event === 'SIGNED_OUT') {
          isAdmin.value = false
        }
      })
    })

    return {
      navLinks,
      user,
      cartStore,
      isMobileMenuOpen,
      isCurrentRoute,
      handleLogout,
      currentLocale,
      $t,
      isAdmin,
      siteSettings
    }
  }
}
</script>