<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import api from '@/plugins/axios';
import { VueSpinnerDots } from 'vue3-spinners';

// --- STATE MANAGEMENT ---
const isCreating = ref(false);
const isEditing = ref(false); // Track if we are in Edit mode
const isLoading = ref(false);
const isSaving = ref(false);
const selectedYearIndex = ref(0);
const yearlyRecords = ref([]);
const errors = ref({});

// Form for Entry (Used for both New and Edit)
const form = reactive({
    id: null,
    year: new Date().getFullYear(),
    self_investment: 0,
    receivable: 0,
    payable: 0,
    assets: 0,
    liabilities: 0,
    business_withdrawals: [],
    shareholder_injections: [],
    shareholder_withdrawals: []
});

// --- API METHODS ---

const fetchRecords = async () => {
    isLoading.value = true;
    try {
        const { data } = await api.get('/biography/summaries');
        yearlyRecords.value = data;
        if (data.length > 0) selectedYearIndex.value = 0;
    } catch (err) {
        console.error("Fetch Error:", err);
    } finally {
        isLoading.value = false;
    }
};

const saveYearlyData = async () => {
    isSaving.value = true;
    errors.value = {}; 
    
    try {
        // Determine URL and Method based on mode
        const url = isEditing.value ? `/biography/summaries/${form.id}` : '/biography/summaries';
        const method = isEditing.value ? 'put' : 'post';
        
        const { data } = await api[method](url, form);
        
        if (isEditing.value) {
            // Update the record in the local array
            const index = yearlyRecords.value.findIndex(r => r.id === form.id);
            if (index !== -1) yearlyRecords.value[index] = data.data;
        } else {
            // Add new record to top of list
            yearlyRecords.value.unshift(data.data);
            selectedYearIndex.value = 0;
        }

        cancelAction(); // Reset state and go back to report view
    } catch (err) {
        if (err.response && err.response.status === 422) {
            errors.value = err.response.data.errors;
        } else {
            alert("An unexpected error occurred.");
        }
    } finally {
        isSaving.value = false;
    }
};

// --- EDIT LOGIC ---
const editCurrentYear = () => {
    const data = activeData.value;
    if (!data) return;

    // Load active data into form
    Object.assign(form, {
        id: data.id,
        year: data.year,
        self_investment: data.self_investment,
        receivable: data.receivable,
        payable: data.payable,
        assets: data.assets,
        liabilities: data.liabilities,
        // Clone arrays to prevent direct mutation before saving
        business_withdrawals: JSON.parse(JSON.stringify(data.business_withdrawals || [])),
        shareholder_injections: JSON.parse(JSON.stringify(data.shareholder_injections || [])),
        shareholder_withdrawals: JSON.parse(JSON.stringify(data.shareholder_withdrawals || []))
    });

    isEditing.value = true;
    isCreating.value = true;
};

const cancelAction = () => {
    isCreating.value = false;
    isEditing.value = false;
    resetForm();
};

const resetForm = () => {
    Object.assign(form, {
        id: null,
        year: new Date().getFullYear(),
        self_investment: 0,
        receivable: 0,
        payable: 0,
        assets: 0,
        liabilities: 0,
        business_withdrawals: [],
        shareholder_injections: [],
        shareholder_withdrawals: []
    });
};

// --- DYNAMIC INPUT METHODS ---
const addBusinessWithdrawal = () => form.business_withdrawals.push({ reason: '', amount: 0 });
const addShareholderInjection = () => form.shareholder_injections.push({ name: '', amount: 0 });
const addShareholderWithdrawal = () => form.shareholder_withdrawals.push({ name: '', amount: 0 });
const removeItem = (list, index) => list.splice(index, 1);

// --- COMPUTED ---
const activeData = computed(() => yearlyRecords.value[selectedYearIndex.value] || null);
const netInvestment = computed(() => {
    if (!activeData.value) return 0;
    return Number(activeData.value.self_investment) + Number(activeData.value.receivable) - Number(activeData.value.payable);
});

const formatCurrency = (val) => new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(val || 0);

onMounted(fetchRecords);
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen font-sans">
        <div class="max-w-4xl mx-auto">
            
            <div class="flex justify-between items-center bg-white p-4 rounded shadow-sm border">
                <div>
                    <h1 class="text-xl font-bold text-gray-800">Chitral Steel Center</h1>
                    <p class="text-xs text-blue-600 font-bold uppercase tracking-widest">Financial Records</p>
                </div>
                <div class="flex gap-3 items-center">
                    <VueSpinnerDots v-if="isLoading" size="20" color="#2563eb" />
                    <template v-else>
                        <select v-if="!isCreating" v-model="selectedYearIndex" class="border p-2 rounded text-sm bg-gray-50 font-bold">
                            <option v-for="(record, index) in yearlyRecords" :key="record.id" :value="index">Year {{ record.year }}</option>
                        </select>
                        
                        <button v-if="activeData && !isCreating" @click="editCurrentYear" class="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-bold hover:bg-gray-300 transition">
                            Edit Year
                        </button>

                        <button @click="isCreating ? cancelAction() : isCreating = true" class="bg-black text-white px-5 py-2 rounded text-sm font-bold hover:bg-gray-800 transition">
                            {{ isCreating ? '← Back' : '+ Create New Year' }}
                        </button>
                    </template>
                </div>
            </div>

            <div v-if="isCreating" class="bg-white p-8 rounded-lg shadow-xl border-t-4 border-blue-600 space-y-8 animate-in fade-in duration-300 mt-4">
                <h2 class="text-xl font-bold border-b pb-2">
                    {{ isEditing ? 'Edit Financial Year ' + form.year : 'New Entry for Year ' + form.year }}
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="space-y-1">
                        <label class="text-xs font-black uppercase text-gray-500">Statement Year</label>
                        <input v-model="form.year" type="number" class="w-full border-2 p-2 rounded focus:border-blue-500 outline-none" :class="{'border-red-400': errors.year}">
                        <p v-if="errors.year" class="text-red-500 text-[10px] font-bold">{{ errors.year[0] }}</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-black uppercase text-gray-500">Self Investment</label>
                        <input v-model="form.self_investment" type="number" class="w-full border-2 p-2 rounded" :class="{'border-red-400': errors.self_investment}">
                        <p v-if="errors.self_investment" class="text-red-500 text-[10px] font-bold">{{ errors.self_investment[0] }}</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-black uppercase text-gray-500">Receivables</label>
                        <input v-model="form.receivable" type="number" class="w-full border-2 p-2 rounded" :class="{'border-red-400': errors.receivable}">
                        <p v-if="errors.receivable" class="text-red-500 text-[10px] font-bold">{{ errors.receivable[0] }}</p>
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-black uppercase text-gray-500">Payables</label>
                        <input v-model="form.payable" type="number" class="w-full border-2 p-2 rounded" :class="{'border-red-400': errors.payable}">
                        <p v-if="errors.payable" class="text-red-500 text-[10px] font-bold">{{ errors.payable[0] }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-8">
                    <div class="border p-4 rounded bg-gray-50">
                        <div class="flex justify-between mb-4"><h3 class="font-bold text-sm uppercase">Business Withdrawals</h3><button @click="addBusinessWithdrawal" class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-bold">+ Add Row</button></div>
                        <div v-for="(item, i) in form.business_withdrawals" :key="i" class="flex flex-col gap-1 mb-3">
                            <div class="flex gap-2">
                                <input v-model="item.reason" placeholder="Reason" class="flex-1 border p-2 rounded text-sm">
                                <input v-model="item.amount" type="number" placeholder="Amount" class="w-32 border p-2 rounded text-sm">
                                <button @click="removeItem(form.business_withdrawals, i)" class="text-red-500 px-2 font-bold">×</button>
                            </div>
                        </div>
                    </div>

                    <div class="border p-4 rounded bg-green-50/50">
                        <div class="flex justify-between mb-4"><h3 class="font-bold text-sm uppercase text-green-800">Investment Injected</h3><button @click="addShareholderInjection" class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-bold">+ Add Person</button></div>
                        <div v-for="(item, i) in form.shareholder_injections" :key="i" class="flex flex-col gap-1 mb-3">
                            <div class="flex gap-2">
                                <input v-model="item.name" placeholder="Shareholder Name" class="flex-1 border p-2 rounded text-sm">
                                <input v-model="item.amount" type="number" placeholder="Amount" class="w-32 border p-2 rounded text-sm">
                                <button @click="removeItem(form.shareholder_injections, i)" class="text-red-500 px-2">×</button>
                            </div>
                        </div>
                    </div>

                    <div class="border p-4 rounded bg-red-50/50">
                        <div class="flex justify-between mb-4"><h3 class="font-bold text-sm uppercase text-red-800">Investment Withdrawal</h3><button @click="addShareholderWithdrawal" class="text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-bold">+ Add Person</button></div>
                        <div v-for="(item, i) in form.shareholder_withdrawals" :key="i" class="flex flex-col gap-1 mb-3">
                            <div class="flex gap-2">
                                <input v-model="item.name" placeholder="Shareholder Name" class="flex-1 border p-2 rounded text-sm">
                                <input v-model="item.amount" type="number" placeholder="Amount" class="w-32 border p-2 rounded text-sm">
                                <button @click="removeItem(form.shareholder_withdrawals, i)" class="text-red-500 px-2">×</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="text-xs font-black uppercase text-gray-500">Total Assets</label>
                        <input v-model="form.assets" type="number" class="w-full border-2 p-2 rounded border-blue-200" :class="{'border-red-400': errors.assets}">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-black uppercase text-gray-500">Total Liabilities</label>
                        <input v-model="form.liabilities" type="number" class="w-full border-2 p-2 rounded border-red-200" :class="{'border-red-400': errors.liabilities}">
                    </div>
                </div>

                <button @click="saveYearlyData" :disabled="isSaving" class="w-full bg-blue-600 text-white py-4 rounded-lg font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg flex justify-center items-center gap-3">
                    <span v-if="!isSaving" class="text-xl">
                        {{ isEditing ? 'Update Report' : 'Save Financial Year Report' }}
                    </span>
                    <VueSpinnerDots v-else size="20" color="#ffffff" />
                </button>
            </div>

            <div v-else-if="activeData" class="bg-white p-12 shadow-2xl border-x border-b animate-in zoom-in-95 duration-500 mt-4">
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-black uppercase tracking-tighter text-gray-900">Biography of Chitral Steel Center</h2>
                    <p class="text-sm font-bold text-gray-500 mt-2">Established (Computerized) January 01, 2026</p>
                </div>

                <table class="w-full text-[13px]">
                    <thead>
                        <tr class="border-b-4 border-black">
                            <th class="text-left py-3 uppercase font-black">Particulars</th>
                            <th class="text-right py-3 uppercase font-black">Amount</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr><td class="py-4 uppercase font-medium">Self Investment as on Jan 01, {{ activeData.year }}</td><td class="text-right font-mono text-base font-bold">{{ formatCurrency(activeData.self_investment) }}</td></tr>
                        <tr><td class="py-4 uppercase font-medium">Receivable as on Jan 01, {{ activeData.year }}</td><td class="text-right font-mono text-base font-bold text-blue-600">{{ formatCurrency(activeData.receivable) }}</td></tr>
                        <tr><td class="py-4 uppercase font-medium text-red-600 font-bold">Payable as on Jan 01, {{ activeData.year }}</td><td class="text-right font-mono text-base text-red-600 font-bold">({{ formatCurrency(activeData.payable) }})</td></tr>
                        
                        <tr class="bg-blue-50/50 font-black border-y-2 border-blue-100"><td class="py-4 px-2 text-blue-900">NET INVESTMENT AS ON JAN 01, {{ activeData.year }}</td><td class="text-right text-lg text-blue-700 px-2">{{ formatCurrency(netInvestment) }}</td></tr>
                        
                        <tr v-for="(bw, idx) in activeData.business_withdrawals" :key="'bw'+idx" class="text-gray-600 italic">
                            <td class="py-3 pl-6">Investment Withdrawal ({{ bw.reason }}) During {{ activeData.year }}</td>
                            <td class="text-right font-semibold text-orange-700">- {{ formatCurrency(bw.amount) }}</td>
                        </tr>

                        <tr v-for="(sh, idx) in activeData.shareholder_injections" :key="'in'+idx">
                            <td class="py-3 pl-6 font-semibold uppercase text-green-800">Shareholder Investment Injected ({{ sh.name }}) In {{ activeData.year }}</td>
                            <td class="text-right font-bold text-green-700 font-mono text-base">+ {{ formatCurrency(sh.amount) }}</td>
                        </tr>

                        <tr v-for="(sh, idx) in activeData.shareholder_withdrawals" :key="'out'+idx">
                            <td class="py-3 pl-6 font-semibold uppercase text-red-800">Shareholder Investment Withdrawal ({{ sh.name }}) In {{ activeData.year }}</td>
                            <td class="text-right font-bold text-red-600 font-mono text-base">- {{ formatCurrency(sh.amount) }}</td>
                        </tr>

                        <tr class="font-black border-t-4 border-black"><td class="py-6 text-base uppercase">Total Assets</td><td class="text-right py-6 text-xl">{{ formatCurrency(activeData.assets) }}</td></tr>
                        <tr class="font-black bg-red-50 border-b-4 border-black"><td class="py-6 text-base uppercase">Total Liabilities</td><td class="text-right py-6 text-xl text-red-600 font-bold">{{ formatCurrency(activeData.liabilities) }}</td></tr>
                    </tbody>
                </table>
            </div>

            <div v-else class="text-center py-20 text-gray-400">
                <p v-if="isLoading">Loading data, please wait...</p>
                <p v-else>No financial records found. Create one to get started.</p>
            </div>
        </div>
    </div>
</template>