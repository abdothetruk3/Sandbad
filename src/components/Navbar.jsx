import { defineComponent } from 'vue'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'Navbar',
  setup() {
    return () => (
      <nav class="bg-white shadow-md">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <router-link to="/" class="text-2xl font-bold text-primary">
              Sandbad
            </router-link>
            
            <div class="flex items-center space-x-8">
              <router-link to="/" class="text-gray-700 hover:text-primary">
                Home
              </router-link>
              <router-link to="/products" class="text-gray-700 hover:text-primary">
                Products
              </router-link>
              <router-link to="/cart" class="text-gray-700 hover:text-primary flex items-center">
                <ShoppingCartIcon class="w-6 h-6" />
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    )
  }
})