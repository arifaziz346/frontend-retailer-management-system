<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 p-6 font-mono">

    <!-- ══════════ HEADER ══════════ -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-11 h-11 rounded-xl bg-blue-950 border border-blue-800/40 flex items-center justify-center text-blue-400">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
            <path d="M12 12h.01M8 12h.01M16 12h.01"/>
            <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <div>
          <h1 class="text-xl font-bold tracking-tight text-white">Backup System</h1>
          <p class="text-xs text-gray-500">Database protection &amp; recovery centre</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="loadAll"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all"
        >
          <RefreshCw :size="14" /> Refresh
        </button>
        <button
          @click="triggerManualBackup"
          :disabled="manualLoading"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <VueSpinnerDots v-if="manualLoading" size="15" color="#fff" />
          <Database v-else :size="14" />
          {{ manualLoading ? 'Backing up…' : 'Backup Now' }}
        </button>
      </div>
    </div>

    <!-- ══════════ DRIVES BAR ══════════ -->
    <div class="flex flex-wrap gap-3 mb-5">
      <div
        v-for="d in drives" :key="d.letter"
        @click="toggleDrive(d.path)"
        :class="[
          'min-w-[120px] bg-gray-900 border rounded-xl p-3 cursor-pointer transition-all',
          selectedDrives.includes(d.path)
            ? 'border-blue-500 bg-blue-950/40 shadow-[0_0_0_2px_rgba(79,142,247,0.12)]'
            : 'border-gray-800 hover:border-blue-600'
        ]"
      >
        <div class="flex items-center gap-2 text-gray-400 text-xs mb-2">
          <HardDrive :size="16" />
          <span class="font-bold text-sm text-white">{{ d.letter }}:</span>
          <span v-if="selectedDrives.includes(d.path)" class="ml-auto text-green-400">
            <CheckCircle2 :size="13" />
          </span>
        </div>
        <div class="h-1 bg-gray-800 rounded-full overflow-hidden mb-1.5">
          <div
            class="h-full rounded-full transition-all"
            :style="{ width: (100 - (d.free_pct ?? 50)) + '%' }"
            :class="{
              'bg-green-400':  (100 - (d.free_pct ?? 50)) <= 60,
              'bg-orange-400': (100 - (d.free_pct ?? 50)) > 60 && (100 - (d.free_pct ?? 50)) <= 85,
              'bg-red-400':    (100 - (d.free_pct ?? 50)) > 85
            }"
          />
        </div>
        <div class="flex justify-between text-[10px] text-gray-500">
          <span>{{ d.free_gb ?? '?' }} GB free</span>
          <span>{{ d.total_gb ?? '?' }} GB</span>
        </div>
      </div>

      <button
        @click="showPathModal = true"
        class="flex flex-col items-center justify-center gap-1.5 min-w-[100px] border border-dashed border-gray-700 rounded-xl px-5 py-3 text-gray-500 text-xs bg-transparent hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer"
      >
        <PlusCircle :size="18" />
        <span>Add Path</span>
      </button>
    </div>

    <!-- ══════════ STATS ROW ══════════ -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <div class="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-400">
        <Archive :size="20" />
        <div>
          <div class="text-2xl font-bold text-white leading-none">{{ backups.all.length }}</div>
          <div class="text-[11px] text-gray-500 mt-0.5">Total Backups</div>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-gray-900 border border-green-900/30 rounded-xl p-4 text-gray-400">
        <CalendarDays :size="20" class="text-green-400" />
        <div>
          <div class="text-2xl font-bold text-white leading-none">{{ backups.daily.length }}</div>
          <div class="text-[11px] text-gray-500 mt-0.5">This Month</div>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-gray-900 border border-blue-900/30 rounded-xl p-4 text-gray-400">
        <FolderClock :size="20" class="text-blue-400" />
        <div>
          <div class="text-2xl font-bold text-white leading-none">{{ backups.monthly.length }}</div>
          <div class="text-[11px] text-gray-500 mt-0.5">Monthly Archives</div>
        </div>
      </div>
      <div class="flex items-center gap-3 bg-gray-900 border border-orange-900/30 rounded-xl p-4 text-gray-400">
        <Clock :size="20" class="text-orange-400" />
        <div>
          <div class="text-xl font-bold text-white leading-none">{{ settings.auto_backup_enabled ? settings.backup_time : 'OFF' }}</div>
          <div class="text-[11px] text-gray-500 mt-0.5">Auto Backup</div>
        </div>
      </div>
    </div>

    <!-- ══════════ MAIN GRID ══════════ -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 items-start">

      <!-- ─── LEFT: Backup Table ─── -->
      <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">

        <!-- Tabs -->
        <div class="flex border-b border-gray-800 bg-gray-900/80">
          <button
            @click="activeTab = 'daily'"
            :class="[
              'flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all',
              activeTab === 'daily'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            ]"
          >
            <Sun :size="13" /> Daily (This Month)
            <span :class="['text-[10px] px-1.5 py-0.5 rounded-full', activeTab === 'daily' ? 'bg-blue-950 text-blue-400' : 'bg-gray-800 text-gray-500']">
              {{ backups.daily.length }}
            </span>
          </button>
          <button
            @click="activeTab = 'monthly'"
            :class="[
              'flex items-center gap-2 px-5 py-3 text-xs font-semibold border-b-2 transition-all',
              activeTab === 'monthly'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            ]"
          >
            <Layers :size="13" /> Monthly Archives
            <span :class="['text-[10px] px-1.5 py-0.5 rounded-full', activeTab === 'monthly' ? 'bg-blue-950 text-blue-400' : 'bg-gray-800 text-gray-500']">
              {{ backups.monthly.length }}
            </span>
          </button>
        </div>

        <!-- Filter bar -->
        <div class="flex gap-2 px-4 py-3 border-b border-gray-800">
          <div class="flex-1 flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 text-gray-500">
            <Search :size="13" />
            <input
              v-model="search"
              placeholder="Search backups…"
              class="flex-1 bg-transparent border-none outline-none text-gray-100 text-xs py-2 font-mono"
            />
          </div>
          <select
            v-model="filterDrive"
            class="bg-gray-800 border border-gray-700 rounded-lg text-gray-200 text-xs px-3 py-2 outline-none font-mono"
          >
            <option value="">All Drives</option>
            <option v-for="d in drives" :key="d.letter" :value="d.letter + ':'">{{ d.letter }}:</option>
          </select>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="bg-gray-900/60">
                <th class="text-left text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-4 py-2.5 border-b border-gray-800">File</th>
                <th class="text-left text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-4 py-2.5 border-b border-gray-800">Drive</th>
                <th class="text-left text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-4 py-2.5 border-b border-gray-800">Size</th>
                <th class="text-left text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-4 py-2.5 border-b border-gray-800">Type</th>
                <th class="text-left text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-4 py-2.5 border-b border-gray-800">Date</th>
                <th class="text-left text-[10px] uppercase tracking-widest text-gray-500 font-semibold px-4 py-2.5 border-b border-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredBackups.length === 0">
                <td colspan="6" class="text-center py-12 text-gray-500">
                  <HardDriveDownload :size="30" class="mx-auto mb-2 opacity-40" />
                  <p class="text-xs">No backups found</p>
                </td>
              </tr>
              <tr
                v-for="b in filteredBackups" :key="b.id"
                class="border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors"
              >
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-2 text-gray-200 max-w-[200px]">
                    <FileText :size="13" class="text-gray-500 shrink-0" />
                    <span class="truncate">{{ b.file_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-2.5">
                  <span class="bg-blue-950 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {{ driveLetter(b.storage) }}
                  </span>
                </td>
                <td class="px-4 py-2.5 text-gray-500">{{ b.size }}</td>
                <td class="px-4 py-2.5">
                  <span
                    :class="[
                      'text-[10px] font-bold uppercase px-2 py-0.5 rounded border',
                      b.type === 'manual' ? 'bg-blue-950/30 text-blue-400 border-blue-800/40'   :
                      b.type === 'auto'   ? 'bg-green-950/30 text-green-400 border-green-800/40' :
                                            'bg-orange-950/30 text-orange-400 border-orange-800/40'
                    ]"
                  >{{ b.type }}</span>
                </td>
                <td class="px-4 py-2.5 text-gray-500 whitespace-nowrap">{{ formatDate(b.created_at) }}</td>
                <td class="px-4 py-2.5">
                  <div class="flex items-center gap-1.5">
                    <button
                      @click="downloadBackup(b)"
                      title="Download"
                      class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 text-gray-400 hover:text-blue-400 hover:border-blue-500 transition-all cursor-pointer"
                    >
                      <Download :size="12" />
                    </button>
                    <button
                      @click="confirmDelete(b)"
                      title="Delete"
                      class="w-7 h-7 flex items-center justify-center rounded-md border border-gray-700 bg-gray-800 text-gray-400 hover:text-red-400 hover:border-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 :size="12" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── RIGHT: Settings Panel ─── -->
      <div class="flex flex-col gap-4">

        <!-- Auto Backup -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <Timer :size="15" class="text-gray-400" />
            <span>Auto Backup</span>
            <label class="ml-auto relative inline-block w-10 h-5 cursor-pointer">
              <input type="checkbox" v-model="settings.auto_backup_enabled" @change="saveSettings" class="sr-only peer" />
              <span class="absolute inset-0 bg-gray-700 rounded-full transition-colors peer-checked:bg-blue-600"></span>
              <span class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
            </label>
          </div>

          <div v-if="settings.auto_backup_enabled" class="flex flex-col gap-1 mb-3">
            <label class="text-[11px] text-gray-500">Daily Time</label>
            <input type="time" v-model="settings.backup_time"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-xs px-3 py-2 outline-none focus:border-blue-500 transition-colors font-mono" />
          </div>

          <div class="flex flex-col gap-1 mb-3">
            <label class="text-[11px] text-gray-500">Interval (minutes)</label>
            <input type="number" v-model.number="settings.interval" min="5"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-xs px-3 py-2 outline-none focus:border-blue-500 transition-colors font-mono" />
          </div>

          <div class="flex flex-col gap-1 mb-3">
            <label class="text-[11px] text-gray-500">mysqldump.exe Path <span class="text-gray-600">(leave blank to auto-detect)</span></label>
            <input type="text" v-model="settings.mysqldump_path"
              placeholder="C:\wamp64\bin\mysql\mysql8.0.31\bin\mysqldump.exe"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-xs px-3 py-2 outline-none focus:border-blue-500 transition-colors font-mono" />
          </div>

          <button
            @click="saveSettings"
            :disabled="settingsLoading"
            class="flex items-center justify-center gap-2 w-full bg-blue-950 text-blue-400 border border-blue-800/40 rounded-lg py-2.5 text-xs font-semibold hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <VueSpinnerDots v-if="settingsLoading" size="13" color="currentColor" />
            <Save v-else :size="13" />
            Save Settings
          </button>
        </div>

        <!-- Backup Paths -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-white mb-4">
            <FolderOpen :size="15" class="text-gray-400" />
            <span>Backup Paths</span>
          </div>

          <div v-for="(path, i) in settings.paths" :key="i" class="flex gap-2 mb-2">
            <input
              v-model="settings.paths[i]"
              class="flex-1 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-xs px-3 py-2 outline-none focus:border-blue-500 transition-colors font-mono"
            />
            <button
              v-if="settings.paths.length > 1"
              @click="removePath(i)"
              class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-500 hover:text-red-400 hover:border-red-500 transition-all cursor-pointer"
            >
              <X :size="12" />
            </button>
          </div>

          <button
            @click="addPath"
            class="flex items-center justify-center gap-2 w-full border border-dashed border-gray-700 rounded-lg py-2 text-xs text-gray-500 hover:text-blue-400 hover:border-blue-500 transition-all cursor-pointer mt-1 bg-transparent"
          >
            <PlusCircle :size="13" /> Add Drive Path
          </button>
        </div>

        <!-- Import / Restore -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-white mb-2">
            <Upload :size="15" class="text-gray-400" />
            <span>Import / Restore</span>
          </div>
          <p class="text-[11px] text-gray-500 mb-3">Restore a .sql file to the current database.</p>

          <div
            @dragover.prevent="dragging = true"
            @dragleave="dragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-xl p-5 text-center text-gray-500 text-xs cursor-pointer transition-all',
              dragging
                ? 'border-blue-500 bg-blue-950/20'
                : 'border-gray-700 hover:border-blue-600 hover:bg-gray-800/30'
            ]"
          >
            <UploadCloud :size="26" class="mx-auto mb-2 opacity-60" />
            <p class="mb-2">Drop .sql file here or</p>
            <label class="inline-block bg-gray-800 border border-gray-700 rounded-md px-3 py-1 text-blue-400 text-[11px] hover:bg-blue-950 hover:border-blue-500 cursor-pointer transition-all">
              Browse
              <input type="file" accept=".sql" @change="handleFileInput" class="hidden" />
            </label>
          </div>

          <div v-if="importFile" class="flex items-center gap-2 text-[11px] text-green-400 bg-green-950/20 border border-green-800/30 rounded-lg px-3 py-2 mt-2">
            <FileCheck :size="13" />
            <span class="truncate flex-1">{{ importFile.name }}</span>
            <button @click="importFile = null" class="text-gray-500 hover:text-gray-300 bg-transparent border-none cursor-pointer">
              <X :size="11" />
            </button>
          </div>

          <button
            @click="importBackup"
            :disabled="!importFile || importLoading"
            class="flex items-center justify-center gap-2 w-full bg-red-950/20 text-red-400 border border-red-800/30 rounded-lg py-2.5 text-xs font-semibold hover:bg-red-950/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-3"
          >
            <VueSpinnerDots v-if="importLoading" size="13" color="currentColor" />
            <HardDriveDownload v-else :size="13" />
            Restore Database
          </button>
        </div>

      </div>
    </div>

    <!-- ══════════ DELETE CONFIRM MODAL ══════════ -->
    <VModal v-if="deleteTarget" @close="deleteTarget = null">
      <template #header>
        <div class="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle :size="18" class="text-yellow-400" />
          Confirm Delete
        </div>
      </template>
      <p class="text-sm text-gray-400 leading-relaxed">
        Are you sure you want to permanently delete
        <strong class="text-white">{{ deleteTarget.file_name }}</strong>?
        This will also remove it from disk.
      </p>
      <template #footer>
        <button
          @click="deleteTarget = null"
          class="px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="deleteBackup"
          :disabled="deleteLoading"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 disabled:opacity-50 cursor-pointer transition-all"
        >
          <VueSpinnerDots v-if="deleteLoading" size="13" color="#fff" />
          <span v-else>Delete</span>
        </button>
      </template>
    </VModal>

    <!-- ══════════ ADD PATH MODAL ══════════ -->
    <VModal v-if="showPathModal" @close="showPathModal = false">
      <template #header>Add Backup Path</template>
      <div class="flex flex-col gap-1.5">
        <label class="text-xs text-gray-500">Drive Path (e.g. D:\Backups)</label>
        <input
          v-model="newPath"
          placeholder="D:\MyBackups"
          class="w-full bg-gray-800 border border-gray-700 rounded-lg text-gray-100 text-sm px-3 py-2.5 outline-none focus:border-blue-500 transition-colors font-mono"
        />
      </div>
      <template #footer>
        <button
          @click="showPathModal = false"
          class="px-4 py-2 text-sm font-semibold bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-400 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          @click="confirmAddPath"
          class="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all cursor-pointer"
        >
          Add Path
        </button>
      </template>
    </VModal>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import api from '@/plugins/axios';
import { formatDate } from '@/utils/formatDate';
import { toast } from '@/utils/toast';
import { VueSpinnerDots } from 'vue3-spinners';
import VModal from '@/components/VModal.vue';
import {
  HardDrive, Database, RefreshCw, CheckCircle2, PlusCircle,
  Archive, CalendarDays, FolderClock, Clock, Sun, Layers, Search,
  Download, Trash2, FileText, HardDriveDownload, Timer, Save, FolderOpen,
  Upload, UploadCloud, FileCheck, X, AlertTriangle,
} from 'lucide-vue-next';

// ── State ──────────────────────────────────────────────────────
const drives         = ref([]);
const selectedDrives = ref([]);
const backups        = reactive({ all: [], daily: [], monthly: [] });
const settings       = reactive({
  paths: ['C:\\DB_Backups'],
  interval: 60,
  auto_backup_enabled: false,
  backup_time: '02:00',
  mysqldump_path: '',
  google_drive: false,
});
const activeTab     = ref('daily');
const search        = ref('');
const filterDrive   = ref('');
const deleteTarget  = ref(null);
const importFile    = ref(null);
const newPath       = ref('');
const dragging      = ref(false);
const showPathModal = ref(false);

const manualLoading   = ref(false);
const settingsLoading = ref(false);
const importLoading   = ref(false);
const deleteLoading   = ref(false);

// ── Computed ───────────────────────────────────────────────────
const filteredBackups = computed(() => {
  const list = activeTab.value === 'daily' ? backups.daily : backups.monthly;
  return list.filter(b => {
    const matchSearch = !search.value ||
      b.file_name.toLowerCase().includes(search.value.toLowerCase());
    const matchDrive = !filterDrive.value || b.storage.startsWith(filterDrive.value);
    return matchSearch && matchDrive;
  });
});

// ── API ────────────────────────────────────────────────────────
async function loadAll() {
  await Promise.all([loadDrives(), loadSettings(), loadBackups()]);
}

async function loadDrives() {
  try {
    const res = await api.get('/backup/drives');
    drives.value = res.data.data ?? [];
  } catch { toast.error('Could not load drives.'); }
}

async function loadSettings() {
  try {
    const res = await api.get('/backup/settings');
    const d = res.data.data;
    Object.assign(settings, {
      paths: Array.isArray(d.paths) ? d.paths : (d.paths ? JSON.parse(d.paths) : ['C:\\DB_Backups']),
      interval: d.interval,
      auto_backup_enabled: d.auto_backup_enabled,
      backup_time: d.backup_time ?? '02:00',
      mysqldump_path: d.mysqldump_path ?? '',
      google_drive: d.google_drive ?? false,
    });
    selectedDrives.value = [...settings.paths];
  } catch { toast.error('Could not load settings.'); }
}

async function loadBackups() {
  try {
    const res = await api.get('/backup');
    Object.assign(backups, res.data.data);
  } catch { toast.error('Could not load backups.'); }
}

async function saveSettings() {
  settingsLoading.value = true;
  try {
    await api.post('/backup/settings', {
      paths: settings.paths,
      interval: settings.interval,
      auto_backup_enabled: settings.auto_backup_enabled,
      backup_time: settings.backup_time,
      mysqldump_path: settings.mysqldump_path,
      google_drive: settings.google_drive,
    });
    toast.success('Settings saved.');
  } catch { toast.error('Failed to save settings.'); }
  finally { settingsLoading.value = false; }
}

async function triggerManualBackup() {
  if (selectedDrives.value.length === 0) {
    toast.warning('Select at least one drive to backup to.');
    return;
  }
  manualLoading.value = true;
  try {
    const res = await api.post('/backup/create', { paths: selectedDrives.value });
    toast.success(res.data.message);
    if (res.data.errors?.length) res.data.errors.forEach(e => toast.warning(`${e.path}: ${e.error}`));
    await loadBackups();
  } catch (e) {
    toast.error(e.response?.data?.message ?? 'Backup failed.');
  } finally { manualLoading.value = false; }
}

async function downloadBackup(b) {
  try {
    const res = await api.get(`/backup/export/${b.id}`, { responseType: 'blob' });
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url; a.download = b.file_name; a.click();
    URL.revokeObjectURL(url);
  } catch { toast.error('Download failed.'); }
}

function confirmDelete(b) { deleteTarget.value = b; }

async function deleteBackup() {
  deleteLoading.value = true;
  try {
    await api.delete(`/backup/${deleteTarget.value.id}`);
    toast.success('Backup deleted.');
    deleteTarget.value = null;
    await loadBackups();
  } catch { toast.error('Delete failed.'); }
  finally { deleteLoading.value = false; }
}

async function importBackup() {
  if (!importFile.value) return;
  importLoading.value = true;
  const fd = new FormData();
  // Force .sql MIME type — browsers often send text/plain for .sql files
  const sqlFile = new File([importFile.value], importFile.value.name, { type: 'application/sql' });
  fd.append('file', sqlFile);
  try {
    const res = await api.post('/backup/import', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.success(res.data.message);
    importFile.value = null;
    await loadBackups();
  } catch (e) {
    toast.error(e.response?.data?.message ?? 'Import failed.');
  } finally { importLoading.value = false; }
}

// ── Helpers ────────────────────────────────────────────────────
function toggleDrive(path) {
  const i = selectedDrives.value.indexOf(path);
  if (i === -1) selectedDrives.value.push(path);
  else selectedDrives.value.splice(i, 1);
}

function driveLetter(storagePath) {
  return storagePath ? storagePath.charAt(0).toUpperCase() + ':' : '?';
}

function addPath() {
  settings.paths.push('');
  saveSettings();
}

function removePath(i) {
  settings.paths.splice(i, 1);
  saveSettings();
}

function confirmAddPath() {
  if (!newPath.value.trim()) return;
  settings.paths.push(newPath.value.trim());
  selectedDrives.value.push(newPath.value.trim());
  newPath.value = '';
  showPathModal.value = false;
  saveSettings();
}

function handleFileInput(e) {
  importFile.value = e.target.files[0] ?? null;
}

function handleDrop(e) {
  dragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file && file.name.endsWith('.sql')) importFile.value = file;
  else toast.warning('Please drop a .sql file.');
}

onMounted(loadAll);
</script>