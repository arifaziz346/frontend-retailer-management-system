<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50"
    >
      <div class="flex flex-col items-center space-y-3">
        <VueSpinnerDots size="48px" color="#3B82F6" />
        <p class="text-blue-600 text-sm font-medium animate-pulse">
          Loading invoice details...
        </p>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <nav class="flex items-center space-x-2 text-sm">
            <router-link
              to="/admin/Supplier"
              class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <i class="pi pi-home text-base"></i>
              <span class="font-medium">Suppliers</span>
            </router-link>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <button
              @click="$router.back()"
              class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Supplier Detail
            </button>
            <i class="pi pi-chevron-right text-gray-400 text-xs"></i>
            <span class="text-gray-900 font-semibold">Stock Invoice</span>
          </nav>

          <!-- Action Buttons -->
          <div class="flex items-center gap-3">
            <button
              @click="printInvoice"
              :disabled="isGeneratingPDF"
              class="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-all shadow-sm"
              title="Download Invoice PDF"
            >
              <i :class="isGeneratingPDF ? 'pi pi-spin pi-spinner' : 'pi pi-download'" class="text-sm"></i>
              <span class="hidden sm:inline">{{ isGeneratingPDF ? 'Generating...' : 'Download PDF' }}</span>
            </button>

            <button
              @click="openAddItemModal"
              class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm"
            >
              <i class="pi pi-plus text-sm"></i>
              <span class="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <!-- Invoice Summary Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <i class="pi pi-file-invoice"></i>
            Invoice Summary
          </h2>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column -->
            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-building text-blue-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Supplier</p>
                  <p class="text-base font-semibold text-gray-900">{{ state.supplier?.name || 'N/A' }}</p>
                  <p class="text-sm text-gray-600">{{ state.supplier?.company_name || '' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-phone text-green-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                  <p class="text-base font-semibold text-gray-900">{{ state.supplier?.contact_person || 'N/A' }}</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <i class="pi pi-map-marker text-purple-600"></i>
                </div>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                  <p class="text-base text-gray-900">{{ state.supplier?.address || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-4">
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-500 uppercase tracking-wide">Invoice ID</span>
                  <span class="text-base font-bold text-gray-900">#{{ invoiceOrderId }}</span>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-xs text-gray-500 uppercase tracking-wide">Invoice No</span>
                  <span class="text-base font-semibold text-blue-600">{{ invoiceNumber }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-gray-500 uppercase tracking-wide">Date</span>
                  <span class="text-base text-gray-900">{{ formatDate(invoiceDate) }}</span>
                </div>
              </div>

              <!-- Costs Summary -->
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-orange-50 rounded-lg p-3 border border-orange-200">
                  <p class="text-xs text-orange-600 font-medium mb-1">Transport Cost</p>
                  <p class="text-base font-bold text-orange-900">Rs. {{ formatCurrency(invoiceData.transport_cost) }}</p>
                </div>
                <div class="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <p class="text-xs text-indigo-600 font-medium mb-1">Labour Cost</p>
                  <p class="text-base font-bold text-indigo-900">Rs. {{ formatCurrency(invoiceData.labour_cost) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Items Table -->
      <div ref="invoiceRef" class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between print:bg-white print:border-b print:border-gray-300">
          <h3 class="text-lg font-bold text-white flex items-center gap-2 print:text-gray-900">
            <i class="pi pi-list"></i>
            Invoice Items
          </h3>
          <span class="text-sm text-gray-300 print:text-gray-600">{{ state.supplier_order_items.length }} items</span>
        </div>

        <!-- Items Table -->
        <div v-if="state.supplier_order_items && state.supplier_order_items.length" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Item Name
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Cost Price
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Sale Price
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Quantity
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Total Cost
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Total Sale
                </th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Profit
                </th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider print:hidden">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="item in state.supplier_order_items"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="text-sm font-medium text-gray-900">{{ item.id }}</span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <i class="pi pi-box text-blue-600 text-xs"></i>
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ item.name || 'N/A' }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm text-gray-900">Rs. {{ formatCurrency(item.cost_price) }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm text-gray-900">Rs. {{ formatCurrency(item.sale_price) }}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ item.quantity || 0 }}
                  </span>
                </td>
                <!-- Total Cost = cost_price * quantity -->
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm font-semibold text-gray-900">
                    Rs. {{ formatCurrency(item.cost_price * item.quantity) }}
                  </span>
                </td>
                <!-- Total Sale = sale_price * quantity -->
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span class="text-sm font-semibold text-green-700">
                    Rs. {{ formatCurrency(item.sale_price * item.quantity) }}
                  </span>
                </td>
                <!-- Profit = (sale_price - cost_price) * quantity -->
                <td class="px-4 py-3 whitespace-nowrap print:hidden">
                  <span
                    class="text-sm font-semibold"
                    :class="itemProfit(item) >= 0 ? 'text-emerald-600' : 'text-red-600'"
                  >
                    Rs. {{ formatCurrency(itemProfit(item)) }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right print:hidden">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="editItem(item)"
                      class="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-all"
                      title="Edit Item"
                    >
                      <i class="pi pi-pencil text-xs"></i>
                    </button>
                    <button
                      @click="deleteItem(item.id)"
                      class="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                      title="Delete Item"
                    >
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>

            <!-- Totals Footer Row -->
            <tfoot class="bg-gray-50 border-t-2 border-gray-300">
              <tr>
                <td colspan="4" class="px-4 py-3 text-right">
                  <span class="text-sm font-bold text-gray-900 uppercase">Totals:</span>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white">
                    {{ totalQuantity }}
                  </span>
                </td>
                <!-- Total Items Cost -->
                <td class="px-4 py-3 print:hidden">
                  <span class="text-sm font-bold text-gray-900">
                    Rs. {{ formatCurrency(totalItemsCost) }}
                  </span>
                </td>
                <!-- Total Items Sale -->
                <td class="px-4 py-3 print:hidden">
                  <span class="text-sm font-bold text-green-700">
                    Rs. {{ formatCurrency(totalItemsSale) }}
                  </span>
                </td>
                <!-- Total Profit (items only) -->
                <td class="px-4 py-3 print:hidden">
                  <span
                    class="text-sm font-bold"
                    :class="totalItemsProfit >= 0 ? 'text-emerald-600' : 'text-red-600'"
                  >
                    Rs. {{ formatCurrency(totalItemsProfit) }}
                  </span>
                </td>
                <td class="print:hidden"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-16 px-6">
          <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <i class="pi pi-inbox text-gray-400 text-5xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Items Found</h3>
          <p class="text-gray-600 text-center mb-6">
            This invoice doesn't have any items yet. Add items to get started.
          </p>
          <button
            @click="openAddItemModal"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg"
          >
            <i class="pi pi-plus"></i>
            <span>Add First Item</span>
          </button>
        </div>

        <!-- ─── Financial Summary Section (shown only when items exist) ─── -->
        <div v-if="state.supplier_order_items && state.supplier_order_items.length" class="border-t-2 border-gray-200 px-6 py-6 bg-gray-50">
          <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <i class="pi pi-calculator text-gray-500"></i>
            Financial Summary
          </h4>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <!-- Labour Cost -->
            <div class="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center gap-3">
              <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-users text-indigo-600"></i>
              </div>
              <div>
                <p class="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Labour Cost</p>
                <p class="text-base font-bold text-indigo-900">Rs. {{ formatCurrency(invoiceData.labour_cost) }}</p>
              </div>
            </div>

            <!-- Transport Cost -->
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
              <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-truck text-orange-600"></i>
              </div>
              <div>
                <p class="text-xs text-orange-600 font-semibold uppercase tracking-wide">Transport Cost</p>
                <p class="text-base font-bold text-orange-900">Rs. {{ formatCurrency(invoiceData.transport_cost) }}</p>
              </div>
            </div>

            <!-- Total Profit (Sale - TotalCost where TotalCost includes transport+labour) -->
            <div
              class="rounded-lg p-4 flex items-center gap-3 border"
              :class="totalNetProfit >= 0
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'"
            >
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                :class="totalNetProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'"
              >
                <i
                  class="pi"
                  :class="totalNetProfit >= 0
                    ? 'pi-trending-up text-emerald-600'
                    : 'pi-trending-down text-red-600'"
                ></i>
              </div>
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-wide"
                  :class="totalNetProfit >= 0 ? 'text-emerald-600' : 'text-red-600'"
                >Total Profit</p>
                <p
                  class="text-base font-bold"
                  :class="totalNetProfit >= 0 ? 'text-emerald-900' : 'text-red-900'"
                >Rs. {{ formatCurrency(totalNetProfit) }}</p>
                <p class="text-xs text-gray-500 mt-0.5">(Sale − Total Cost incl. overheads)</p>
              </div>
            </div>

            <!-- Total Items Cost (pure items, no overheads) -->
            <div class="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-box text-gray-600"></i>
              </div>
              <div>
                <p class="text-xs text-gray-600 font-semibold uppercase tracking-wide">Total Items Cost</p>
                <p class="text-base font-bold text-gray-900">Rs. {{ formatCurrency(totalItemsCost) }}</p>
                <p class="text-xs text-gray-500 mt-0.5">(cost price × qty per item)</p>
              </div>
            </div>

            <!-- Total Sale -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-dollar text-green-600"></i>
              </div>
              <div>
                <p class="text-xs text-green-600 font-semibold uppercase tracking-wide">Total Sale</p>
                <p class="text-base font-bold text-green-900">Rs. {{ formatCurrency(totalItemsSale) }}</p>
                <p class="text-xs text-gray-500 mt-0.5">(sale price × qty per item)</p>
              </div>
            </div>

            <!-- Grand Total Cost (items + transport + labour) -->
            <div class="bg-blue-600 rounded-lg p-4 flex items-center gap-3 shadow-md">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <i class="pi pi-wallet text-white"></i>
              </div>
              <div>
                <p class="text-xs text-blue-100 font-semibold uppercase tracking-wide">Grand Total Cost</p>
                <p class="text-base font-bold text-white">Rs. {{ formatCurrency(grandTotalCost) }}</p>
                <p class="text-xs text-blue-200 mt-0.5">(items + transport + labour)</p>
              </div>
            </div>

          </div>
        </div>
        <!-- ─── End Financial Summary ─── -->
      </div>
    </main>

    <!-- Add/Edit Item Modal -->
    <BaseModal
      v-model="showModal"
      :title="isEditMode ? 'Update Item' : 'Add Item to Invoice'"
      @save="saveItem"
      :disableSaveBtn="isSaveLoading"
      size="lg"
    >
      <div class="space-y-4">
        <!-- Item Selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Select Item <span class="text-red-500">*</span>
          </label>
          <div class="relative" ref="dropdownRef">
            <input
              type="text"
              v-model="form.name"
              @click="toggleDropdown"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Select an item"
              readonly
            />
            <button
              type="button"
              @click="toggleDropdown"
              class="absolute right-0 top-0 h-full w-10 flex items-center justify-center text-gray-400 hover:text-gray-600"
            >
              <i :class="isDropdownOpen ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
            </button>

            <!-- Dropdown -->
            <Transition name="slide-fade">
              <div
                v-if="isDropdownOpen"
                class="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl max-h-64 overflow-hidden"
              >
                <!-- Search Bar -->
                <div class="p-3 border-b border-gray-200 bg-gray-50">
                  <div class="relative">
                    <i class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                    <input
                      type="text"
                      v-model="searchItem"
                      @input="handleSearchInput"
                      placeholder="Search items..."
                      class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <!-- Items List -->
                <ul class="max-h-48 overflow-y-auto">
                  <li
                    v-for="item in state.items"
                    :key="item.id"
                    @click="selectItem(item)"
                    class="px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div class="flex items-center justify-between">
                      <span class="font-medium">{{ item.name }}</span>
                      <span class="text-xs text-gray-500">{{ item.unit }}</span>
                    </div>
                  </li>
                  <li v-if="state.items.length === 0" class="px-4 py-6 text-center text-sm text-gray-500">
                    No items found
                  </li>
                </ul>
              </div>
            </Transition>
          </div>
          <p v-if="errors.name" class="text-red-600 text-xs mt-1">{{ cleanError(errors.name) }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Quantity -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Quantity <span class="text-red-500">*</span>
            </label>
            <FormInput
              id="quantity"
              type="number"
              v-model="form.quantity"
              @input="calculateCostPrice"
              :error="errors.quantity"
              :disabled="isSaveLoading"
              placeholder="0"
            />
          </div>

          <!-- Total Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Total Price <span class="text-red-500">*</span>
            </label>
            <FormInput
              id="total_price"
              type="number"
              v-model="form.total_price"
              @input="calculateCostPrice"
              :error="errors.total_price"
              :disabled="isSaveLoading"
              placeholder="0.00"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Cost Price (auto-calculated) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Cost Price (Auto-calculated)
            </label>
            <FormInput
              id="cost_price"
              type="number"
              v-model="form.cost_price"
              :error="errors.cost_price"
              :disabled="true"
              placeholder="0.00"
            />
          </div>

          <!-- Sale Price -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Sale Price
            </label>
            <FormInput
              id="sale_price"
              type="number"
              v-model="form.sale_price"
              :error="errors.sale_price"
              :disabled="isSaveLoading"
              placeholder="0.00"
            />
          </div>
        </div>

        <!-- Info Box — shows how cost_price is derived including overheads -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div class="flex items-start gap-3">
            <i class="pi pi-info-circle text-blue-600 mt-0.5"></i>
            <div class="text-sm text-blue-800 w-full">
              <p class="font-medium mb-2">Cost Price Calculation (including overheads)</p>
              <p class="mb-1">
                Cost Price = (Total Price + Transport Cost + Labour Cost) ÷ Quantity
              </p>

              <!-- Live breakdown -->
              <div v-if="form.quantity && form.total_price" class="mt-3 bg-white rounded border border-blue-200 p-3 text-xs space-y-1 text-blue-900">
                <div class="flex justify-between">
                  <span>Total Price entered:</span>
                  <span class="font-semibold">Rs. {{ formatCurrency(form.total_price) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>+ Transport Cost:</span>
                  <span class="font-semibold">Rs. {{ formatCurrency(invoiceData.transport_cost) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>+ Labour Cost:</span>
                  <span class="font-semibold">Rs. {{ formatCurrency(invoiceData.labour_cost) }}</span>
                </div>
                <div class="flex justify-between border-t border-blue-200 pt-1 mt-1">
                  <span>= Combined Total:</span>
                  <span class="font-semibold">Rs. {{ formatCurrency(modalCombinedTotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span>÷ Quantity ({{ form.quantity }}):</span>
                  <span class="font-bold text-blue-700">Cost Price = Rs. {{ form.cost_price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <!-- Hidden PDF Component -->
    <SupplierOrderPrint ref="pdfRef" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VueSpinnerDots } from 'vue3-spinners';
import api from '@/plugins/axios';
import { toast } from '@/utils/toast';
import { useFormErrors } from '@/composables/admin/useFormErrors';
import { usePrint } from '@/composables/admin/usePrint';
import { cleanError } from '@/utils/stringHelpers';
import { round } from '@/utils/helper';
import BaseModal from '@/components/BaseModal.vue';
import FormInput from '@/components/admin/FormInput.vue';
import Button from '@/components/admin/Button.vue';
import SupplierOrderPrint from '@/components/SupplierOrderPrint.vue';

const route = useRoute();
const router = useRouter();
const invoiceRef = ref(null);
const dropdownRef = ref(null);
const pdfRef = ref(null);
const isGeneratingPDF = ref(false);
const { printElement } = usePrint();

// ─── State ────────────────────────────────────────────────────────────────────
const isLoading = ref(true);
const isSaveLoading = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);
const isDropdownOpen = ref(false);
const searchItem = ref('');

const state = reactive({
  supplier: {},
  supplier_order: [],
  supplier_order_items: [],
  items: [],
});

const form = reactive({
  id: null,
  supplier_order_id: '',
  item_id: '',
  name: '',
  quantity: '',
  cost_price: '',
  sale_price: '',
  total_price: '',
  unit: '',
});

const errors = reactive({
  name: '',
  quantity: '',
  cost_price: '',
  sale_price: '',
  total_price: '',
});

const handleFormErrors = useFormErrors(errors);

// ─── Computed ─────────────────────────────────────────────────────────────────
const supplierOrderId = computed(() => route.params.id);
const supplierId = computed(() => route.params.supplier_id);

const invoiceData = computed(() => {
  return state.supplier_order.length > 0 ? state.supplier_order[0] : {};
});

const invoiceOrderId  = computed(() => invoiceData.value.id || '-');
const invoiceNumber   = computed(() => invoiceData.value.supplier_invoice_number || 'N/A');
const invoiceDate     = computed(() => invoiceData.value.supplier_invoice_date || '');

// Overhead figures from the invoice
const transportCost = computed(() => parseFloat(invoiceData.value.transport_cost || 0));
const labourCost    = computed(() => parseFloat(invoiceData.value.labour_cost    || 0));

// ── Table totals ──────────────────────────────────────────────────────────────
const totalQuantity = computed(() =>
  state.supplier_order_items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
);

// Sum of (cost_price × qty) for all items
const totalItemsCost = computed(() =>
  state.supplier_order_items.reduce(
    (sum, item) => sum + Number(item.cost_price || 0) * Number(item.quantity || 0),
    0
  )
);

// Sum of (sale_price × qty) for all items
const totalItemsSale = computed(() =>
  state.supplier_order_items.reduce(
    (sum, item) => sum + Number(item.sale_price || 0) * Number(item.quantity || 0),
    0
  )
);

// Profit per item helper
const itemProfit = (item) =>
  (Number(item.sale_price || 0) - Number(item.cost_price || 0)) * Number(item.quantity || 0);

// Total profit across all items (before overheads)
const totalItemsProfit = computed(() =>
  state.supplier_order_items.reduce((sum, item) => sum + itemProfit(item), 0)
);

// Grand Total Cost = items cost + transport + labour
const grandTotalCost = computed(() =>
  totalItemsCost.value + transportCost.value + labourCost.value
);

// Net Profit = Total Sale − Grand Total Cost (overheads deducted)
const totalNetProfit = computed(() =>
  totalItemsSale.value - grandTotalCost.value
);

// ── Modal live breakdown ──────────────────────────────────────────────────────
// Combined total used in modal info box
const modalCombinedTotal = computed(() => {
  const tp = parseFloat(form.total_price || 0);
  return tp + transportCost.value + labourCost.value;
});

// ─── Format helpers ───────────────────────────────────────────────────────────
const formatCurrency = (value) => {
  if (!value && value !== 0) return '0.00';
  return parseFloat(value).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// ─── Cost Price Calculation ───────────────────────────────────────────────────
// cost_price per unit = (total_price + transport_cost + labour_cost) / quantity
const calculateCostPrice = () => {
  const qty = parseFloat(form.quantity);
  const totalPrice = parseFloat(form.total_price);

  if (qty && totalPrice && qty > 0) {
    const combinedTotal = totalPrice + transportCost.value + labourCost.value;
    form.cost_price = (combinedTotal / qty).toFixed(2);
  } else {
    form.cost_price = '';
  }
};

// ─── Dropdown handlers ────────────────────────────────────────────────────────
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
  form.name       = item.name;
  form.item_id    = item.id;
  form.sale_price = item.sale_price;
  form.unit       = item.unit;
  form.quantity   = '';
  form.total_price = '';
  form.cost_price = '';
  isDropdownOpen.value = false;
};

const handleClickOutside = (event) => {
  if (
    isDropdownOpen.value &&
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target)
  ) {
    isDropdownOpen.value = false;
  }
};

const handleSearchInput = () => {
  fetchItems();
};

// ─── API Calls ────────────────────────────────────────────────────────────────
const loadAllData = async () => {
  try {
    isLoading.value = true;

    const [supplierRes, orderRes, orderItemsRes] = await Promise.all([
      api.get(`/suppliers/${supplierId.value}`),
      api.get(`/supplier-orders/order/${supplierOrderId.value}`),
      api.get(`/supplier-order-items/by-supplier-order/${supplierOrderId.value}`),
    ]);

    state.supplier            = supplierRes.data.data;
    state.supplier_order      = orderRes.data.data ? [orderRes.data.data] : [];
    state.supplier_order_items = orderItemsRes.data.data || [];
  } catch (error) {
    console.error('Error loading data:', error);
    toast.error('Failed to load invoice details');
  } finally {
    isLoading.value = false;
  }
};

const fetchItems = async () => {
  try {
    const response = await api.get('/supplier-order-items/items', {
      params: { search: searchItem.value || null },
    });
    state.items = response.data.data.data || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    toast.error('Failed to fetch items');
  }
};

const saveItem = async () => {
  try {
    isSaveLoading.value = true;

    if (isEditMode.value) {
      // eslint-disable-next-line no-unused-vars
      const { total_price, ...dataToSend } = form;
      await api.put(`/supplier-order-items/${form.id}`, dataToSend);
      toast.success('Item updated successfully');
    } else {
      // eslint-disable-next-line no-unused-vars
      const { id, total_price, ...dataToSend } = form;
      await api.post('/supplier-order-items', dataToSend);
      toast.success('Item added successfully');
    }

    await loadAllData();
    resetForm();
  } catch (error) {
    if (error.response?.status === 422) {
      handleFormErrors(error);
    } else {
      toast.error('Failed to save item');
    }
  } finally {
    isSaveLoading.value = false;
  }
};

const deleteItem = async (id) => {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    isLoading.value = true;
    await api.delete(`/supplier-order-items/${id}`);
    toast.success('Item deleted successfully');
    await loadAllData();
  } catch (error) {
    console.error('Error deleting item:', error);
    toast.error('Failed to delete item');
  } finally {
    isLoading.value = false;
  }
};

// ─── Modal handlers ───────────────────────────────────────────────────────────
const openAddItemModal = () => {
  resetForm();
  isEditMode.value = false;
  showModal.value  = true;
  fetchItems();
};

const editItem = (item) => {
  isEditMode.value  = true;
  form.id           = item.id;
  form.name         = item.name;
  form.item_id      = item.item_id;
  form.quantity     = item.quantity;
  form.cost_price   = item.cost_price;
  form.sale_price   = item.sale_price;
  form.unit         = item.unit;
  // Reconstruct total_price from cost_price (before overheads were added)
  // total_price stored as cost_price * qty; recalculate as
  // total_price = cost_price * qty − transport − labour
  // so editing shows the original item total without overheads
  const rawTotal = (parseFloat(item.cost_price) * parseFloat(item.quantity))
    - transportCost.value
    - labourCost.value;
  form.total_price = rawTotal > 0 ? rawTotal.toFixed(2) : (parseFloat(item.cost_price) * parseFloat(item.quantity)).toFixed(2);
  showModal.value   = true;
  fetchItems();
};

const resetForm = () => {
  isEditMode.value  = false;
  form.id           = null;
  form.name         = '';
  form.item_id      = '';
  form.quantity     = '';
  form.cost_price   = '';
  form.sale_price   = '';
  form.total_price  = '';
  form.unit         = '';
  Object.keys(errors).forEach((key) => (errors[key] = ''));
  showModal.value = false;
};

// ─── PDF ──────────────────────────────────────────────────────────────────────
const downloadPDF = async () => {
  if (!pdfRef.value) {
    toast.error('PDF component not loaded');
    return;
  }

  if (!state.supplier_order_items || state.supplier_order_items.length === 0) {
    toast.error('No items to generate PDF');
    return;
  }

  try {
    isGeneratingPDF.value = true;

    const orderData = {
      id: invoiceOrderId.value,
      order_date: invoiceDate.value,
      status: 'Completed',
      supplier: {
        name: state.supplier?.name || 'N/A',
        phone: state.supplier?.contact_person || 'N/A',
      },
      items: state.supplier_order_items.map((item) => ({
        id:         item.id,
        name:       item.name       || 'N/A',
        quantity:   item.quantity   || 0,
        cost_price: item.cost_price || 0,
        sale_price: item.sale_price || 0,
      })),
      transport_cost: invoiceData.value.transport_cost || 0,
      labour_cost:    invoiceData.value.labour_cost    || 0,
    };

    await pdfRef.value.downloadPDF(orderData);
    toast.success('PDF generated successfully!');
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.error('Failed to generate PDF');
  } finally {
    isGeneratingPDF.value = false;
  }
};

const printInvoice = () => {
  downloadPDF();
};

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  if (!supplierOrderId.value || !supplierId.value) {
    toast.error('Invalid invoice ID');
    router.push('/admin/Supplier');
    return;
  }

  form.supplier_order_id = supplierOrderId.value;
  document.addEventListener('click', handleClickOutside);
  await loadAllData();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Slide-fade transition for dropdown */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Print styles */
@media print {
  .print\:hidden {
    display: none !important;
  }

  .print\:bg-white {
    background-color: white !important;
  }

  .print\:text-gray-900 {
    color: #111827 !important;
  }

  .print\:border-b {
    border-bottom: 1px solid #e5e7eb;
  }

  .print\:border-gray-300 {
    border-color: #d1d5db !important;
  }
}
</style>