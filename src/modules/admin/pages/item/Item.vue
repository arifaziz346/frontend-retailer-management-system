<template>
  <div v-if="isLoading && state.items.length === 0" class="fixed inset-0 flex items-center justify-center bg-slate-900/10 backdrop-blur-md z-[100]">
    <div class="flex flex-col items-center p-8 bg-white rounded-3xl shadow-2xl border border-white">
      <VueSpinnerDots size="50px" color="#2563eb" />
      <p class="text-slate-500 text-xs font-bold mt-4 tracking-[0.2em] uppercase">Processing Data</p>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-screen bg-[#f8fafc] w-full">

    <!-- Header -->
    <header class="sticky top-0 z-30 w-full bg-white border-b border-slate-200 shadow-sm">
      <div class="w-full px-4 sm:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-col">
          <nav class="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <router-link to="/admin/Item" class="hover:text-blue-600 transition-colors">Inventory</router-link>
            <i class="pi pi-chevron-right text-[10px]"></i>
            <span class="text-blue-600">{{ category_name || 'All Categories' }}</span>
          </nav>
          <h1 class="text-2xl font-black text-slate-800 tracking-tight">Product Management</h1>
        </div>

        <button
          class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all text-sm"
          @click="() => { resetForm(); editItem = false; showModal = true; }"
        >
          <i class="pi pi-plus-circle"></i>
          <span>Create New Item</span>
        </button>
      </div>
    </header>

    <main class="w-full px-4 sm:px-8 py-6">

      <!-- Filter Bar -->
      <div class="w-full mb-8">
        <FilterBar
          :subCategories="state.categories"
          v-model:search="searchText"
          v-model:category_id="category_id"
          :showButton="false"
          class="w-full"
        />
      </div>

      <!-- Items Table -->
      <div v-if="state.items && state.items.length" class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden w-full">
        <div class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr class="bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-widest border-b border-slate-100">
                <th class="px-6 py-5">Product Info</th>
                <th class="px-6 py-5">Category</th>
                <th class="px-6 py-5">Units</th>
                <th class="px-6 py-5">Pricing (Cost / Sale)</th>
                <th class="px-6 py-5">Profit Analysis</th>
                <th class="px-6 py-5 w-[220px]">Inventory Health</th>
                <th class="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="item in state.items" :key="item.id" class="hover:bg-blue-50/40 transition-all group">

                <!-- Product Info -->
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 text-base group-hover:text-blue-700 transition-colors">{{ item.name }}</span>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span v-if="item.grade" class="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold border border-blue-100 uppercase">Grade: {{ item.grade }}</span>
                      <span v-if="item.size" class="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded font-bold border border-slate-100">Size: {{ item.size }}</span>
                      <span class="text-xs font-mono text-slate-400">#{{ item.unique_barcode || item.id }}</span>
                    </div>
                  </div>
                </td>

                <!-- Category -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {{ item.category?.category_name || 'General' }}
                  </span>
                </td>

                <!-- Units -->
                <td class="px-6 py-4">
                  <div v-if="item.conversion_factor && item.conversion_factor > 1" class="flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded font-bold border border-purple-100 uppercase">Buy: {{ item.purchase_unit }}</span>
                      <i class="pi pi-arrow-right text-[9px] text-slate-300"></i>
                      <span class="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold border border-green-100 uppercase">Sell: {{ item.unit }}</span>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium">1 {{ item.purchase_unit }} = {{ item.conversion_factor }} {{ item.unit }}</span>
                  </div>
                  <div v-else>
                    <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold border border-slate-200 uppercase">{{ item.unit }}</span>
                  </div>
                </td>

                <!-- Pricing -->
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-slate-700">
                    Rs.{{ item.sale_price }}
                    <span class="text-[10px] text-slate-400 font-medium">/{{ item.unit }}</span>
                  </div>
                  <div class="text-[11px] text-slate-400 font-medium">
                    Cost: Rs.{{ item.cost_price }}/{{ item.unit }}
                  </div>
                  <div v-if="item.conversion_factor && item.conversion_factor > 1" class="text-[10px] text-purple-500 font-medium mt-0.5">
                    ≈ Rs.{{ (item.cost_price * item.conversion_factor).toFixed(0) }}/{{ item.purchase_unit }}
                  </div>
                </td>

                <!-- Profit -->
                <td class="px-6 py-4">
                  <div class="flex items-baseline gap-2">
                    <span class="text-sm font-black text-green-600">+{{ (item.sale_price - item.cost_price).toFixed(0) }}</span>
                    <span class="text-[10px] font-bold text-green-500/80 bg-green-50 px-1.5 py-0.5 rounded">
                      {{ profitPercentage(item.sale_price, item.cost_price) }}
                    </span>
                  </div>
                </td>

                <!-- Inventory Health -->
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1.5">
                    <div class="flex justify-between text-[10px] font-bold uppercase">
                      <span :class="item.quantity_in_stock < 10 ? 'text-red-500' : 'text-slate-500'">
                        {{ item.quantity_in_stock || 0 }} {{ item.unit }}
                      </span>
                      <span class="text-slate-400">Max: 100</span>
                    </div>
                    <div v-if="item.conversion_factor && item.conversion_factor > 1" class="text-[10px] text-purple-500 font-medium">
                      ≈ {{ (item.quantity_in_stock / item.conversion_factor).toFixed(3) }} {{ item.purchase_unit }}
                    </div>
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-1000"
                        :class="item.quantity_in_stock > 20 ? 'bg-blue-500' : item.quantity_in_stock > 5 ? 'bg-amber-400' : 'bg-red-500'"
                        :style="{ width: Math.min((item.quantity_in_stock / 100) * 100, 100) + '%' }"
                      ></div>
                    </div>
                  </div>
                </td>

                <!-- Actions -->
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end items-center gap-1">
                    <button @click="edit(item)" class="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors">
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                    <button @click="onDelete(item.id)" class="p-2 hover:bg-red-100 text-red-500 rounded-lg transition-colors">
                      <i class="pi pi-trash text-sm"></i>
                    </button>
                    <button
                      @click="openUpdateStockModal(item)"
                      :disabled="isLoading"
                      class="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg disabled:bg-gray-400 transition-all">
                      Update Stock
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-slate-50/50 px-8 py-4 border-t border-slate-100">
          <Pagination :pagination="state.pagination" @page-change="fetchItems" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="w-full py-32 flex flex-col items-center justify-center bg-white border-2 border-dashed border-slate-200 rounded-[2rem]">
        <div class="p-6 bg-slate-50 rounded-full mb-4">
          <i class="pi pi-box text-5xl text-slate-300"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800">Your inventory is empty</h3>
        <p class="text-slate-500 mb-6">Start tracking your products by clicking the button below.</p>
        <button @click="showModal = true" class="text-blue-600 font-bold hover:text-blue-700">+ Add First Product</button>
      </div>
    </main>

    <!-- ===================== CREATE / EDIT MODAL ===================== -->
    <BaseModal
      v-model="showModal"
      :title="editItem ? 'Modify Product Information' : 'Catalog New Item'"
      @save="() => onSaveOrUpdate()"
      :disableSaveBtn="isLoading"
      panelClass="max-w-2xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">

        <!-- Item Name -->
        <div class="md:col-span-2">
          <FormInput
            id="name"
            label="Item Name (e.g. Steel Rebar, Falcon Cement)"
            v-model="form.name"
            placeholder="Enter product name..."
            :error="errors.name"
          />
        </div>

        <!-- Category -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-slate-700">Select Category</label>
          <div class="flex gap-2">
            <Selector
              id="category"
              v-model="form.category_id"
              :options="state.categories.map(u => ({ label: u.category_name, value: u.id }))"
              placeholder="Select Category"
              class="flex-1"
              :error="errors.category_id"
            />
            <button type="button" @click="navigateToSubcategory" class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
              <i class="pi pi-plus"></i>
            </button>
          </div>
        </div>

        <!-- Unit Mode Toggle -->
        <div class="space-y-2">
          <label class="block text-sm font-bold text-slate-700">Unit Mode</label>
          <div class="flex gap-2 mt-1">
            <button type="button" @click="setSingleUnitMode"
              :class="['flex-1 py-2 rounded-lg text-sm font-bold border transition-all',
                !form.isDualUnit ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300']">
              <i class="pi pi-tag mr-1"></i> Single Unit
            </button>
            <button type="button" @click="form.isDualUnit = true"
              :class="['flex-1 py-2 rounded-lg text-sm font-bold border transition-all',
                form.isDualUnit ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300']">
              <i class="pi pi-arrows-h mr-1"></i> Dual Unit
            </button>
          </div>
        </div>

        <!-- SINGLE UNIT MODE -->
        <template v-if="!form.isDualUnit">
          <div class="space-y-2 md:col-span-2">
            <label class="block text-sm font-bold text-slate-700">Unit of Measure</label>
            <div class="flex gap-2">
              <Selector
                id="unit"
                v-model="form.unit"
                :options="state.units.map(u => ({ label: u.name, value: u.name }))"
                placeholder="Select Unit..."
                class="flex-1"
                :error="errors.unit"
              />
              <button type="button" @click="goToUnitPage" class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                <i class="pi pi-plus"></i>
              </button>
            </div>
          </div>
        </template>

        <!-- DUAL UNIT MODE -->
        <template v-else>

          <!-- Purchase Unit -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">
              <span class="text-purple-600">Purchase Unit</span>
              <span class="text-slate-400 font-normal ml-1">(you buy in)</span>
            </label>
            <div class="flex gap-2">
              <Selector
                v-model="form.purchase_unit"
                :options="state.units.map(u => ({ label: u.name, value: u.name }))"
                placeholder="Select unit"
                class="flex-1"
                :error="errors.purchase_unit"
                @update:modelValue="onUnitPairChange"
              />
              <button type="button" @click="goToUnitPage" class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                <i class="pi pi-plus"></i>
              </button>
            </div>
          </div>

          <!-- Sale Unit -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-slate-700">
              <span class="text-green-600">Sale Unit</span>
              <span class="text-slate-400 font-normal ml-1">(you sell in)</span>
            </label>
            <div class="flex gap-2">
              <Selector
                v-model="form.unit"
                :options="state.units.map(u => ({ label: u.name, value: u.name }))"
                placeholder="Select unit"
                class="flex-1"
                :error="errors.unit"
                @update:modelValue="onUnitPairChange"
              />
              <button type="button" @click="goToUnitPage" class="p-2 bg-slate-100 rounded-lg hover:bg-slate-200">
                <i class="pi pi-plus"></i>
              </button>
            </div>
          </div>

          <!-- Conversion Factor — AUTO-FILLED, read-only if known -->
          <div class="md:col-span-2 space-y-1">
            <label class="block text-sm font-bold text-slate-700 flex items-center gap-2">
              Conversion Factor
              <span v-if="conversionIsKnown"
                class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                ✓ Auto-detected
              </span>
              <span v-else-if="form.purchase_unit && form.unit"
                class="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                Enter manually
              </span>
            </label>

            <div class="flex gap-2 items-center">
              <input
                type="number"
                v-model="form.conversion_factor"
                :readonly="conversionIsKnown"
                :class="[
                  'flex-1 border rounded-lg px-4 py-2.5 text-sm font-bold transition-all outline-none',
                  conversionIsKnown
                    ? 'bg-green-50 border-green-300 text-green-700 cursor-not-allowed'
                    : 'bg-white border-slate-200 text-slate-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                ]"
                placeholder="e.g. 1000 (for Ton → KG)"
                @input="calculateCostPrice"
              />
              <!-- Allow overriding auto-detected value -->
              <button
                v-if="conversionIsKnown"
                type="button"
                @click="conversionIsKnown = false"
                class="text-xs text-slate-400 hover:text-red-500 underline whitespace-nowrap px-2"
              >
                Override
              </button>
            </div>

            <!-- Visual badge explaining conversion -->
            <div v-if="form.purchase_unit && form.unit && form.conversion_factor" class="mt-1">
              <span :class="['inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border',
                conversionIsKnown
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-amber-50 border-amber-200 text-amber-700']">
                <i class="pi pi-info-circle text-[11px]"></i>
                1 {{ form.purchase_unit }} = {{ form.conversion_factor }} {{ form.unit }}
              </span>
            </div>

            <!-- Hint if unit pair is reversed -->
            <p v-if="conversionHint" class="text-[11px] text-blue-500 font-medium mt-1">
              💡 {{ conversionHint }}
            </p>
            <!-- Hint if pair is completely unknown -->
            <p v-if="form.purchase_unit && form.unit && !conversionIsKnown && !form.conversion_factor" class="text-[11px] text-amber-600 mt-1">
              No preset found for "{{ form.purchase_unit }} → {{ form.unit }}". Enter the factor manually.
            </p>
          </div>
        </template>

        <!-- Stock Quantity -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">
            Stock Quantity
            <span v-if="form.isDualUnit && form.purchase_unit" class="text-purple-500 font-normal ml-1">(in {{ form.purchase_unit }})</span>
            <span v-else-if="form.unit" class="text-slate-400 font-normal ml-1">(in {{ form.unit }})</span>
          </label>
          <FormInput
            id="quantity_in_stock"
            type="number"
            v-model="form.quantity_in_stock"
            :error="errors.quantity_in_stock"
            :placeholder="form.isDualUnit && form.purchase_unit ? `Qty in ${form.purchase_unit}` : '0.00'"
            @input="onConversionOrQuantityChange"
          />
          <!-- Show converted equivalent -->
          <p v-if="form.isDualUnit && form.quantity_in_stock && form.conversion_factor" class="text-[11px] text-green-600 font-bold mt-1">
            = {{ (parseFloat(form.quantity_in_stock) * parseFloat(form.conversion_factor)).toFixed(2) }} {{ form.unit }}
            <span class="text-slate-400 font-normal">(stored in system)</span>
          </p>
        </div>

        <!-- Total Cost -->
        <div>
          <FormInput
            v-model="form.total_cost"
            :error="errors.total_cost"
            :label="`Total Cost Price`"
            type="number"
            placeholder="Total amount paid for all stock"
            @input="calculateCostPrice"
          />
        </div>

        <!-- Cost Price per Unit — auto-calculated -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1">
            Cost Price / {{ form.unit || 'Unit' }}
            <span class="ml-1 text-[10px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">Auto</span>
          </label>
          <input
            type="number"
            v-model="form.cost_price"
            class="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-bold text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            placeholder="Auto-calculated or enter manually"
            @input="updateTotalFromCostPrice"
          />
          <p v-if="form.isDualUnit && form.cost_price && form.conversion_factor" class="text-[11px] text-purple-600 font-bold mt-1">
            ≈ Rs.{{ (parseFloat(form.cost_price) * parseFloat(form.conversion_factor)).toFixed(2) }} / {{ form.purchase_unit }}
          </p>
          <p v-if="errors.cost_price" class="text-[11px] text-red-500 mt-1">{{ errors.cost_price }}</p>
        </div>

        <!-- Sale Price per Unit -->
        <div>
          <FormInput
            v-model="form.sale_price"
            :error="errors.sale_price"
            :label="`Selling Price / ${form.unit || 'Unit'}`"
            type="number"
            placeholder="0.00"
          />
          <p v-if="form.isDualUnit && form.sale_price && form.conversion_factor" class="text-[11px] text-green-600 font-bold mt-1">
            ≈ Rs.{{ (parseFloat(form.sale_price) * parseFloat(form.conversion_factor)).toFixed(2) }} / {{ form.purchase_unit }}
          </p>
        </div>

        <!-- Live Profit Preview -->
        <div v-if="form.cost_price && form.sale_price"
          class="md:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <p class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Live Profit Preview</p>
          <div class="flex flex-wrap gap-6">
            <div class="text-center">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Per {{ form.unit || 'Unit' }}</p>
              <p class="text-lg font-black text-green-600">
                +Rs.{{ (parseFloat(form.sale_price) - parseFloat(form.cost_price)).toFixed(2) }}
              </p>
            </div>
            <div v-if="form.isDualUnit && form.conversion_factor" class="text-center">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Per {{ form.purchase_unit }}</p>
              <p class="text-lg font-black text-purple-600">
                +Rs.{{ ((parseFloat(form.sale_price) - parseFloat(form.cost_price)) * parseFloat(form.conversion_factor)).toFixed(2) }}
              </p>
            </div>
            <div class="text-center">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Margin %</p>
              <p class="text-lg font-black text-blue-600">{{ profitPercentage(form.sale_price, form.cost_price) }}</p>
            </div>
            <div v-if="stockInSaleUnits > 0" class="text-center">
              <p class="text-[10px] text-slate-400 font-bold uppercase">Total Profit (Stock)</p>
              <p class="text-lg font-black text-emerald-600">
                +Rs.{{ ((parseFloat(form.sale_price) - parseFloat(form.cost_price)) * stockInSaleUnits).toFixed(0) }}
              </p>
            </div>
          </div>
        </div>

      </div>
    </BaseModal>

    <!-- ===================== UPDATE STOCK MODAL ===================== -->
    <BaseModal
      v-model="showUpdateStockModal"
      title="Quick Inventory Update"
      @save="() => updateStock()"
      :disableSaveBtn="isLoading"
      panelClass="max-w-md"
    >
      <div class="p-2 space-y-4">

        <!-- Item info banner -->
        <div v-if="selectedItem" class="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p class="font-bold text-slate-700 text-sm">{{ selectedItem.name }}</p>
          <p class="text-[11px] text-slate-400 mt-0.5">
            Current stock:
            <span class="font-bold text-slate-600">{{ selectedItem.quantity_in_stock }} {{ selectedItem.unit }}</span>
            <span v-if="selectedItem.conversion_factor > 1" class="ml-2 text-purple-500 font-bold">
              ({{ (selectedItem.quantity_in_stock / selectedItem.conversion_factor).toFixed(3) }} {{ selectedItem.purchase_unit }})
            </span>
          </p>
        </div>

        <!-- Dual unit stock entry -->
        <div v-if="selectedItem && selectedItem.conversion_factor > 1" class="space-y-4">

          <div class="space-y-1">
            <label class="block text-sm font-bold text-slate-700">Enter quantity in:</label>
            <div class="flex gap-2">
              <button type="button" @click="stockInputMode = 'purchase'"
                :class="['flex-1 py-2 rounded-lg text-xs font-bold border transition-all',
                  stockInputMode === 'purchase' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300']">
                {{ selectedItem.purchase_unit }} (Purchase)
              </button>
              <button type="button" @click="stockInputMode = 'sale'"
                :class="['flex-1 py-2 rounded-lg text-xs font-bold border transition-all',
                  stockInputMode === 'sale' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-500 border-slate-200 hover:border-green-300']">
                {{ selectedItem.unit }} (Sale)
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1">
              Quantity
              <span class="text-slate-400 font-normal">(in {{ stockInputMode === 'purchase' ? selectedItem.purchase_unit : selectedItem.unit }})</span>
            </label>
            <FormInput
              type="number"
              v-model="new_quantity_in_stock"
              :error="errors.new_quantity_in_stock"
              :placeholder="`Enter qty in ${stockInputMode === 'purchase' ? selectedItem.purchase_unit : selectedItem.unit}`"
            />
          </div>

          <!-- Live conversion preview -->
          <div v-if="new_quantity_in_stock" class="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p class="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2">Conversion Preview</p>
            <div class="flex justify-between items-center text-sm font-black">
              <div class="text-center">
                <p class="text-[10px] text-slate-400 mb-0.5">{{ selectedItem.purchase_unit }}</p>
                <span class="text-purple-700">{{ stockInPurchaseUnits }}</span>
              </div>
              <i class="pi pi-arrows-h text-slate-300"></i>
              <div class="text-center">
                <p class="text-[10px] text-slate-400 mb-0.5">{{ selectedItem.unit }}</p>
                <span class="text-green-700">{{ stockInSaleUnitsForUpdate }}</span>
              </div>
            </div>
            <p class="text-[10px] text-slate-400 mt-2">
              System will store: <span class="font-bold text-slate-600">{{ stockInSaleUnitsForUpdate }} {{ selectedItem.unit }}</span>
            </p>
          </div>
        </div>

        <!-- Single unit stock entry -->
        <div v-else>
          <label class="block text-sm font-bold text-slate-700 mb-2">
            New Quantity
            <span v-if="selectedItem" class="text-slate-400 font-normal">({{ selectedItem?.unit }})</span>
          </label>
          <FormInput
            type="number"
            v-model="new_quantity_in_stock"
            :error="errors.new_quantity_in_stock"
            placeholder="Enter quantity"
          />
        </div>

        <p class="text-[10px] text-slate-400 italic">* This will update the total available stock for this item.</p>
      </div>
    </BaseModal>

  </div>
</template>


<script setup>
import api from "@/plugins/axios";
import { useRoute, useRouter } from "vue-router";
import { reactive, onMounted, ref, watch, computed } from "vue";
import { VueSpinnerDots } from "vue3-spinners";
import BaseModal from "@/components/BaseModal.vue";
import FormInput from "@/components/admin/FormInput.vue";
import Selector from "@/components/Selector.vue";
import Pagination from "@/components/admin/Pagination.vue";
import { toast } from '@/utils/toast';
import { useFormErrors } from "@/composables/admin/useFormErrors";
import FilterBar from "@/components/FilterBar.vue";
import { profitPercentage } from "@/utils/helper";
import _ from 'lodash';

const route = useRoute();
const router = useRouter();

// =====================================================================
// UNIT CONVERSION LOOKUP TABLE
// Key: "PURCHASE_UNIT|SALE_UNIT" (uppercase)
// Value: how many sale units = 1 purchase unit
// =====================================================================
const UNIT_CONVERSIONS = {
  // Weight
  'TON|KG'            : 1000,
  'TON|G'             : 1000000,
  'TON|GRAM'          : 1000000,
  'TONNE|KG'          : 1000,
  'KG|G'              : 1000,
  'KG|GRAM'           : 1000,
  'KG|MG'             : 1000000,
  'QUINTAL|KG'        : 100,
  'MAUND|KG'          : 37.324,   // Pakistani / South Asian maund
  'MAUND|G'           : 37324,
  'SEER|G'            : 933.1,    // Pakistani seer
  'POUND|G'           : 453.592,
  'POUND|KG'          : 0.4536,

  // Bags / Packaging
  'BAG|KG'            : 50,       // Standard cement/flour bag
  'SACK|KG'           : 50,
  'BORI|KG'           : 50,       // Urdu term for bag
  'BUNDLE|PIECE'      : 1,        // Variable — user can override
  'BUNDLE|PCS'        : 1,

  // Counting
  'DOZEN|PIECE'       : 12,
  'DOZEN|PCS'         : 12,
  'GROSS|PIECE'       : 144,
  'GROSS|PCS'         : 144,
  'SCORE|PIECE'       : 20,
  'SCORE|PCS'         : 20,

  // Length
  'METER|CM'          : 100,
  'METER|MM'          : 1000,
  'FOOT|INCH'         : 12,
  'YARD|FOOT'         : 3,
  'YARD|INCH'         : 36,
  'KM|METER'          : 1000,
  'KM|CM'             : 100000,
  'MILE|FOOT'         : 5280,
  'MILE|METER'        : 1609.344,

  // Volume / Liquid
  'LITER|ML'          : 1000,
  'GALLON|LITER'      : 3.785,
  'BARREL|LITER'      : 158.987,
  'CUBIC METER|LITER' : 1000,
  'CUBIC FOOT|LITER'  : 28.317,
};

/**
 * Lookup conversion factor for a purchase→sale unit pair.
 * Returns { factor, found, hint }
 */
const lookupConversion = (purchaseUnit, saleUnit) => {
  if (!purchaseUnit || !saleUnit) return { factor: null, found: false };

  const pu = purchaseUnit.trim().toUpperCase();
  const su = saleUnit.trim().toUpperCase();

  if (pu === su) return { factor: 1, found: true }; // same unit

  const key = `${pu}|${su}`;
  if (UNIT_CONVERSIONS[key] !== undefined) {
    return { factor: UNIT_CONVERSIONS[key], found: true };
  }

  // Check reverse — give a helpful hint
  const reverseKey = `${su}|${pu}`;
  if (UNIT_CONVERSIONS[reverseKey] !== undefined) {
    return {
      factor: null,
      found: false,
      hint: `Did you swap units? 1 ${saleUnit} = ${UNIT_CONVERSIONS[reverseKey]} ${purchaseUnit}`
    };
  }

  return { factor: null, found: false };
};

// ===================== STATE =====================
const state = reactive({
  items: [],
  units: [],
  categories: [],
  pagination: {
    currentPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
    lastPage: 1,
  },
});

const category_id = ref('');
const category_name = ref('');
const isLoading = ref(false);
const isLoadingSearch = ref(false);
const editItem = ref(false);
const item_id = ref('');
const showModal = ref(false);
const conversionIsKnown = ref(false);
const conversionHint = ref('');

const showUpdateStockModal = ref(false);
const selectedItem = ref(null);
const new_quantity_in_stock = ref(0);
const stockInputMode = ref('purchase');

const searchText = ref('');

// ===================== FORM =====================
const form = reactive({
  name: '',
  category_id: '',
  sale_price: '',
  cost_price: '',
  quantity_in_stock: '',
  unit: '',             // Sale unit (always stored in DB in this unit)
  purchase_unit: '',    // Purchase unit (dual mode only)
  conversion_factor: '',
  isDualUnit: false,
  grade: '',
  size: '',
  total_cost: '',
});

const errors = reactive({
  name: '',
  sale_price: '',
  category_id: '',
  cost_price: '',
  quantity_in_stock: '',
  unit: '',
  purchase_unit: '',
  conversion_factor: '',
  new_quantity_in_stock: '',
  total_cost: '',
});

const handleFormErrors = useFormErrors(errors);

// ===================== COMPUTED =====================

// Stock quantity converted to sale units (for profit preview)
const stockInSaleUnits = computed(() => {
  const qty = parseFloat(form.quantity_in_stock) || 0;
  const conv = parseFloat(form.conversion_factor) || 1;
  return form.isDualUnit ? qty * conv : qty;
});

// For update stock modal
const stockInPurchaseUnits = computed(() => {
  if (!selectedItem.value) return 0;
  const qty = parseFloat(new_quantity_in_stock.value) || 0;
  const conv = parseFloat(selectedItem.value.conversion_factor) || 1;
  return stockInputMode.value === 'purchase' ? qty : (qty / conv).toFixed(4);
});

const stockInSaleUnitsForUpdate = computed(() => {
  if (!selectedItem.value) return 0;
  const qty = parseFloat(new_quantity_in_stock.value) || 0;
  const conv = parseFloat(selectedItem.value.conversion_factor) || 1;
  return stockInputMode.value === 'sale' ? qty : (qty * conv).toFixed(2);
});

// ===================== AUTO CONVERSION DETECTION =====================

/**
 * Triggered when either purchase_unit or sale unit (form.unit) changes.
 * Auto-fills conversion_factor from the lookup table.
 */
const onUnitPairChange = () => {
  conversionHint.value = '';

  const { factor, found, hint } = lookupConversion(form.purchase_unit, form.unit);

  if (found) {
    form.conversion_factor = factor;
    conversionIsKnown.value = true;
  } else {
    conversionIsKnown.value = false;
    // Only clear factor if it wasn't manually set before
    if (conversionIsKnown.value) form.conversion_factor = '';
    if (hint) conversionHint.value = hint;
  }

  calculateCostPrice();
};

// ===================== PRICE CALCULATIONS =====================

const calculateCostPrice = () => {
  const totalCost = parseFloat(form.total_cost) || 0;
  const qty = parseFloat(form.quantity_in_stock) || 0;
  const conv = parseFloat(form.conversion_factor) || 1;
  const qtyInSaleUnits = form.isDualUnit ? qty * conv : qty;

  if (qtyInSaleUnits > 0 && totalCost > 0) {
    form.cost_price = (totalCost / qtyInSaleUnits).toFixed(4);
  } else {
    form.cost_price = '';
  }
};

const onConversionOrQuantityChange = () => {
  calculateCostPrice();
};

const updateTotalFromCostPrice = () => {
  const qty = parseFloat(form.quantity_in_stock) || 0;
  const costPrice = parseFloat(form.cost_price) || 0;
  const conv = parseFloat(form.conversion_factor) || 1;
  const qtyInSaleUnits = form.isDualUnit ? qty * conv : qty;

  if (qtyInSaleUnits > 0 && costPrice > 0) {
    form.total_cost = (costPrice * qtyInSaleUnits).toFixed(2);
  } else {
    form.total_cost = '';
  }
};

// ===================== UNIT MODE =====================
const setSingleUnitMode = () => {
  form.isDualUnit = false;
  form.purchase_unit = '';
  form.conversion_factor = '';
  conversionIsKnown.value = false;
  conversionHint.value = '';
};

// ===================== DEBOUNCED SEARCH =====================
const fetchItemsDebounced = _.debounce(() => {
  isLoadingSearch.value = true;
  fetchItems();
}, 500);

watch([searchText, category_id], () => {
  fetchItemsDebounced();
});

// ===================== NAVIGATION =====================
const goToUnitPage = () => router.push('/admin/unit');
const navigateToSubcategory = () => router.push('/admin/category');

// ===================== FETCH =====================
const fetchItems = async (url = '/items') => {
  try {
    isLoadingSearch.value ? (isLoadingSearch.value = true) : (isLoading.value = true);
    const response = await api.get(url, {
      params: {
        search: searchText.value || null,
        category_id: category_id.value || null,
      },
    });
    const paginated = response.data.data;
    state.items = paginated.data;
    state.pagination.currentPage = paginated.current_page;
    state.pagination.lastPage = paginated.last_page;
    state.pagination.nextPageUrl = paginated.next_page_url;
    state.pagination.prevPageUrl = paginated.prev_page_url;
  } catch (error) {
    console.error('Error fetching items:', error);
  } finally {
    isLoading.value = false;
    isLoadingSearch.value = false;
  }
};

const fetchItemCategories = async () => {
  try {
    const response = await api.get('/categories');
    state.categories = response.data.categories;
  } catch (err) {
    console.error('Error categories:', err);
  }
};

const fetchUnits = async () => {
  try {
    const response = await api.get('/units');
    state.units = response.data.data;
  } catch (err) {
    console.error('Error units:', err);
  }
};

// ===================== RESET FORM =====================
const resetForm = () => {
  form.name = '';
  form.sale_price = '';
  form.cost_price = '';
  form.unit = '';
  form.purchase_unit = '';
  form.conversion_factor = '';
  form.isDualUnit = false;
  form.category_id = category_id.value || '';
  form.quantity_in_stock = '';
  form.grade = '';
  form.size = '';
  form.total_cost = '';
  conversionIsKnown.value = false;
  conversionHint.value = '';
  Object.keys(errors).forEach(key => errors[key] = '');
  showModal.value = false;
  editItem.value = false;
  item_id.value = '';
};

// ===================== EDIT =====================
const edit = (item) => {
  editItem.value = true;
  item_id.value = item.id;
  form.name = item.name;
  form.sale_price = item.sale_price;
  form.cost_price = item.cost_price;
  form.unit = item.unit;
  form.category_id = item.category_id;
  form.grade = item.grade || '';
  form.size = item.size || '';

  const conv = parseFloat(item.conversion_factor) || 1;

  if (conv > 1 && item.purchase_unit) {
    form.isDualUnit = true;
    form.purchase_unit = item.purchase_unit;
    form.conversion_factor = conv;

    // Check if it's in our table
    const { found } = lookupConversion(item.purchase_unit, item.unit);
    conversionIsKnown.value = found;

    // DB stores in sale units — convert back to purchase units for form display
    const saleQty = parseFloat(item.quantity_in_stock) || 0;
    form.quantity_in_stock = (saleQty / conv).toFixed(4);
    form.total_cost = (parseFloat(item.cost_price) * saleQty).toFixed(2);
  } else {
    form.isDualUnit = false;
    form.purchase_unit = '';
    form.conversion_factor = '';
    conversionIsKnown.value = false;
    form.quantity_in_stock = item.quantity_in_stock;
    form.total_cost = (parseFloat(item.cost_price) * parseFloat(item.quantity_in_stock)).toFixed(2);
  }

  showModal.value = true;
};

// ===================== SAVE / UPDATE =====================
const onSaveOrUpdate = async () => {
  isLoading.value = true;
  try {
    const qty = parseFloat(form.quantity_in_stock) || 0;
    const conv = parseFloat(form.conversion_factor) || 1;
    // Always store quantity in sale units
    const quantityToStore = form.isDualUnit ? qty * conv : qty;

    const payload = {
      name: form.name,
      sale_price: form.sale_price,
      cost_price: form.cost_price,
      quantity_in_stock: quantityToStore,
      unit: form.unit,
      category_id: form.category_id,
      grade: form.grade,
      size: form.size,
      purchase_unit: form.isDualUnit ? form.purchase_unit : null,
      conversion_factor: form.isDualUnit ? conv : 1,
    };

    let response;
    if (!editItem.value) {
      response = await api.post('/items', payload);
    } else {
      response = await api.put(`/items/${item_id.value}`, payload);
    }

    if (response.data.success) {
      fetchItems();
      toast.success(response.data.message || 'Operation successful');
      resetForm();
    }
  } catch (error) {
    handleFormErrors(error);
  } finally {
    isLoading.value = false;
  }
};

// ===================== DELETE =====================
const onDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  isLoading.value = true;
  try {
    const response = await api.delete(`/items/${id}`);
    if (response.data.success) {
      state.items = state.items.filter(i => i.id !== id);
      toast.success(response.data.message);
    }
  } catch (error) {
    toast.error('Failed to delete item');
  } finally {
    isLoading.value = false;
  }
};

// ===================== UPDATE STOCK =====================
const openUpdateStockModal = (item) => {
  selectedItem.value = item;
  item_id.value = item.id;
  stockInputMode.value = 'purchase';
  errors.new_quantity_in_stock = '';

  const conv = parseFloat(item.conversion_factor) || 1;
  new_quantity_in_stock.value = conv > 1
    ? (parseFloat(item.quantity_in_stock) / conv).toFixed(4)
    : item.quantity_in_stock;

  showUpdateStockModal.value = true;
};

const updateStock = async () => {
  isLoading.value = true;
  try {
    let quantityToSend = parseFloat(new_quantity_in_stock.value) || 0;

    // Convert to sale units before sending
    if (selectedItem.value?.conversion_factor > 1 && stockInputMode.value === 'purchase') {
      quantityToSend = quantityToSend * parseFloat(selectedItem.value.conversion_factor);
    }

    const response = await api.post('/item/update/stock', {
      new_quantity: quantityToSend,
      item_id: item_id.value,
    });

    if (response.data.success) {
      showUpdateStockModal.value = false;
      selectedItem.value = null;
      toast.success(response.data.message);
      fetchItems();
    }
  } catch (error) {
    handleFormErrors(error);
  } finally {
    isLoading.value = false;
  }
};

// ===================== MOUNTED =====================
onMounted(async () => {
  category_id.value = route.params.id || '';
  category_name.value = route.params.category_name || '';
  form.category_id = category_id.value;

  await fetchItems();
  await fetchItemCategories();
  await fetchUnits();
});
</script>