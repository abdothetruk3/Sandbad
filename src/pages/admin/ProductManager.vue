<template>
  <div class="space-y-8">
    <!-- Header with stats -->
    <div 
      class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8"
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0 }"
    >
      <div class="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 class="text-3xl font-bold gradient-text">Product Management</h1>
        <button 
          @click="isAddProductModalOpen = true"
          class="btn btn-primary flex items-center gap-2 mt-4 md:mt-0"
        >
          <PlusIcon class="w-5 h-5" />
          Add New Product
        </button>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Total Products</h3>
          <p class="text-2xl font-bold">{{ productCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Categories</h3>
          <p class="text-2xl font-bold">{{ categoryCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Low Stock</h3>
          <p class="text-2xl font-bold">{{ lowStockCount }}</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all">
          <h3 class="text-gray-500 text-sm">Out of Stock</h3>
          <p class="text-2xl font-bold">{{ outOfStockCount }}</p>
        </div>
      </div>
    </div>

    <!-- Rest of template content -->
  </div>
</template>

<script>
// Script content remains the same
</script>