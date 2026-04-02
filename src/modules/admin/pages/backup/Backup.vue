<template>
  <div class="backup-root">
    <!-- ══════════ HEADER ══════════ -->
    <div class="page-header">
      <div class="header-left">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Z"/>
            <path d="M12 12h.01M8 12h.01M16 12h.01"/>
            <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Backup System</h1>
          <p class="page-sub">Database protection &amp; recovery centre</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="loadAll">
          <RefreshCw :size="15" />
          Refresh
        </button>
        <button class="btn-primary" @click="triggerManualBackup" :disabled="manualLoading">
          <VueSpinnerDots v-if="manualLoading" size="16" color="#fff" />
          <DatabaseBackup v-else :size="15" />
          <span>{{ manualLoading ? 'Backing up…' : 'Backup Now' }}</span>
        </button>
      </div>
    </div>

    <!-- ══════════ DRIVE STATUS BAR ══════════ -->
    <div class="drives-bar">
      <div v-for="d in drives" :key="d.letter" class="drive-card"
           :class="{ selected: selectedDrives.includes(d.path) }"
           @click="toggleDrive(d.path)">
        <div class="drive-top">
          <HardDrive :size="18" />
          <span class="drive-letter">{{ d.letter }}:</span>
          <span class="drive-check" v-if="selectedDrives.includes(d.path)">
            <CheckCircle2 :size="14" />
          </span>
        </div>
        <div class="drive-bar-wrap">
          <div class="drive-bar-fill"
               :style="{ width: (100 - (d.free_pct ?? 50)) + '%' }"
               :class="usageClass(100 - (d.free_pct ?? 50))">
          </div>
        </div>
        <div class="drive-meta">
          <span>{{ d.free_gb ?? '?' }} GB free</span>
          <span>{{ d.total_gb ?? '?' }} GB</span>
        </div>
      </div>

      <button class="drive-add-btn" @click="showPathModal = true">
        <PlusCircle :size="20" />
        <span>Add Path</span>
      </button>
    </div>

    <!-- ══════════ STATS ROW ══════════ -->
    <div class="stats-row">
      <div class="stat-card">
        <Archive :size="20" />
        <div>
          <div class="stat-num">{{ backups.all.length }}</div>
          <div class="stat-label">Total Backups</div>
        </div>
      </div>
      <div class="stat-card accent-green">
        <CalendarDays :size="20" />
        <div>
          <div class="stat-num">{{ backups.daily.length }}</div>
          <div class="stat-label">This Month</div>
        </div>
      </div>
      <div class="stat-card accent-blue">
        <FolderArchive :size="20" />
        <div>
          <div class="stat-num">{{ backups.monthly.length }}</div>
          <div class="stat-label">Monthly Archives</div>
        </div>
      </div>
      <div class="stat-card accent-orange">
        <Clock :size="20" />
        <div>
          <div class="stat-num">{{ settings.auto_backup_enabled ? settings.backup_time : 'OFF' }}</div>
          <div class="stat-label">Auto Backup</div>
        </div>
      </div>
    </div>

    <!-- ══════════ MAIN GRID ══════════ -->
    <div class="main-grid">

      <!-- ─── LEFT: backup tables ─── -->
      <div class="tables-col">

        <!-- Tabs -->
        <div class="tab-bar">
          <button class="tab-btn" :class="{ active: activeTab === 'daily' }" @click="activeTab = 'daily'">
            <Sun :size="14" /> Daily (This Month)
            <span class="badge">{{ backups.daily.length }}</span>
          </button>
          <button class="tab-btn" :class="{ active: activeTab === 'monthly' }" @click="activeTab = 'monthly'">
            <Layers :size="14" /> Monthly Archives
            <span class="badge">{{ backups.monthly.length }}</span>
          </button>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <div class="search-wrap">
            <Search :size="14" />
            <input v-model="search" placeholder="Search backups…" class="filter-input" />
          </div>
          <select v-model="filterDrive" class="filter-select">
            <option value="">All Drives</option>
            <option v-for="d in drives" :key="d.letter" :value="d.letter + ':'">{{ d.letter }}:</option>
          </select>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="backup-table">
            <thead>
              <tr>
                <th>File</th>
                <th>Drive</th>
                <th>Size</th>
                <th>Type</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredBackups.length === 0">
                <td colspan="6" class="empty-row">
                  <Zap :size="32" />
                  <p>No backups found</p>
                </td>
              </tr>
              <tr v-for="b in filteredBackups" :key="b.id" class="backup-row">
                <td>
                  <div class="file-name-cell">
                    <Database :size="14" />
                    <span>{{ b.file_name }}</span>
                  </div>
                </td>
                <td>
                  <span class="drive-badge">{{ driveLetter(b.storage) }}</span>
                </td>
                <td class="size-cell">{{ b.size }}</td>
                <td>
                  <span class="type-badge" :class="'type-' + b.type">{{ b.type }}</span>
                </td>
                <td class="date-cell">{{ formatDate(b.created_at) }}</td>
                <td>
                  <div class="row-actions">
                    <button class="row-btn download" @click="downloadBackup(b)" title="Download">
                      <Download :size="13" />
                    </button>
                    <button class="row-btn danger" @click="confirmDelete(b)" title="Delete">
                      <Trash2 :size="13" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ─── RIGHT: settings panel ─── -->
      <div class="settings-panel">

        <!-- Auto Backup -->
        <div class="panel-section">
          <div class="section-head">
            <Timer :size="16" />
            <span>Auto Backup</span>
            <label class="toggle-wrap">
              <input type="checkbox" v-model="settings.auto_backup_enabled" @change="saveSettings" />
              <span class="toggle-track">
                <span class="toggle-thumb"></span>
              </span>
            </label>
          </div>

          <div class="setting-row" v-if="settings.auto_backup_enabled">
            <label>Daily Time</label>
            <input type="time" v-model="settings.backup_time" class="input-field" />
          </div>

          <div class="setting-row">
            <label>Interval (min)</label>
            <input type="number" v-model.number="settings.interval" min="5" class="input-field" />
          </div>

          <div class="setting-row">
            <label>MySQL Dump Path</label>
            <div class="path-input-group">
              <input type="text" v-model="settings.mysqldump_path" class="input-field" placeholder="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" />
              <button class="btn-compact" @click="detectMysqldump" :disabled="settingsLoading" title="Auto-detect mysqldump">
                <RefreshCw :size="14" />
              </button>
            </div>
            <p class="hint-text" v-if="autoMysqldump">
              <span v-if="autoMysqldump === settings.mysqldump_path" class="text-green-600">✓ Found: {{ autoMysqldump }}</span>
              <span v-else class="text-blue-600">Detected: {{ autoMysqldump }}</span>
            </p>
          </div>

          <button class="btn-save" @click="saveSettings" :disabled="settingsLoading">
            <VueSpinnerDots v-if="settingsLoading" size="14" color="#fff" />
            <Save v-else :size="14" />
            Save Settings
          </button>
        </div>

        <!-- Backup Paths -->
        <div class="panel-section">
          <div class="section-head">
            <FolderOpen :size="16" />
            <span>Backup Paths</span>
          </div>

          <div v-for="(path, i) in settings.paths" :key="i" class="path-row">
            <input v-model="settings.paths[i]" class="input-field path-input" />
            <button class="path-remove" @click="removePath(i)" v-if="settings.paths.length > 1">
              <X :size="13" />
            </button>
          </div>

          <button class="btn-ghost add-path-btn" @click="addPath">
            <PlusCircle :size="14" />
            Add Drive Path
          </button>
        </div>

        <!-- Import / Restore -->
        <div class="panel-section">
          <div class="section-head">
            <Upload :size="16" />
            <span>Import / Restore</span>
          </div>
          <p class="hint-text">Restore a .sql file to the current database.</p>

          <div class="drop-zone"
               :class="{ 'drag-over': dragging }"
               @dragover.prevent="dragging = true"
               @dragleave="dragging = false"
               @drop.prevent="handleDrop">
            <UploadCloud :size="28" />
            <p>Drop .sql file here or</p>
            <label class="pick-file-btn">
              Browse
              <input type="file" accept=".sql" @change="handleFileInput" style="display:none" />
            </label>
          </div>

          <div v-if="importFile" class="import-file-name">
            <FileCheck :size="14" />
            {{ importFile.name }}
            <button @click="importFile = null"><X :size="12" /></button>
          </div>

          <button class="btn-danger-outline" @click="importBackup" :disabled="!importFile || importLoading">
            <VueSpinnerDots v-if="importLoading" size="14" color="currentColor" />
            <Zap v-else :size="14" />
            Restore Database
          </button>
        </div>

      </div>
    </div>

    <!-- ══════════ DELETE CONFIRM MODAL ══════════ -->
    <VModal v-if="deleteTarget" @close="deleteTarget = null">
      <template #header>
        <div class="modal-header-row">
          <AlertTriangle :size="20" class="warn-icon" />
          Confirm Delete
        </div>
      </template>
      <p class="modal-body-text">
        Are you sure you want to permanently delete
        <strong>{{ deleteTarget.file_name }}</strong>?
        This will also remove it from disk.
      </p>
      <template #footer>
        <button class="btn-secondary" @click="deleteTarget = null">Cancel</button>
        <button class="btn-danger" @click="deleteBackup" :disabled="deleteLoading">
          <VueSpinnerDots v-if="deleteLoading" size="14" color="#fff" />
          <span v-else>Delete</span>
        </button>
      </template>
    </VModal>

    <!-- ══════════ ADD PATH MODAL ══════════ -->
    <VModal v-if="showPathModal" @close="showPathModal = false">
      <template #header>Add Backup Path</template>
      <div class="modal-form">
        <label class="form-label">Drive Path (e.g. D:\Backups)</label>
        <input v-model="newPath" class="input-field" placeholder="D:\MyBackups" />
      </div>
      <template #footer>
        <button class="btn-secondary" @click="showPathModal = false">Cancel</button>
        <button class="btn-primary" @click="confirmAddPath">Add Path</button>
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
  HardDrive, DatabaseBackup, RefreshCw, CheckCircle2, PlusCircle,
  Archive, CalendarDays, FolderArchive, Clock, Sun, Layers, Search,
  Download, Trash2, Database, Zap, Timer, Save, FolderOpen,
  Upload, UploadCloud, FileCheck, X, AlertTriangle,
} from 'lucide-vue-next';


// ── State ──────────────────────────────────────────────────────
const drives       = ref([]);
const selectedDrives = ref([]);
const backups      = reactive({ all: [], daily: [], monthly: [] });
const settings     = reactive({
  paths: ['C:\\Backups'],
  interval: 60,
  auto_backup_enabled: false,
  backup_time: '02:00',
  mysqldump_path: null,
});
const autoMysqldump = ref(null);
const activeTab    = ref('daily');
const search       = ref('');
const filterDrive  = ref('');
const deleteTarget = ref(null);
const importFile   = ref(null);
const newPath      = ref('');
const dragging     = ref(false);
const showPathModal = ref(false);

const manualLoading  = ref(false);
const settingsLoading = ref(false);
const importLoading  = ref(false);
const deleteLoading  = ref(false);

// ── Computed ───────────────────────────────────────────────────
const filteredBackups = computed(() => {
  const list = activeTab.value === 'daily' ? backups.daily : backups.monthly;
  return list.filter(b => {
    const matchSearch = !search.value ||
      b.file_name.toLowerCase().includes(search.value.toLowerCase());
    const matchDrive  = !filterDrive.value ||
      b.storage.startsWith(filterDrive.value);
    return matchSearch && matchDrive;
  });
});

// ── API Calls ──────────────────────────────────────────────────
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
      paths: Array.isArray(d.paths) ? d.paths : (d.paths ? JSON.parse(d.paths) : ['C:\\Backups']),
      interval: d.interval,
      auto_backup_enabled: d.auto_backup_enabled,
      backup_time: d.backup_time ?? '02:00',
      mysqldump_path: d.mysqldump_path ?? null,
    });
    autoMysqldump.value = res.data.auto_mysqldump ?? null;
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
    });
    toast.success('Settings saved.');
  } catch (e) { 
    toast.error(e.response?.data?.message || 'Failed to save settings.'); 
  }
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
    if (res.data.errors?.length) {
      res.data.errors.forEach(e => toast.warning(`${e.path}: ${e.error}`));
    }
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
  fd.append('file', importFile.value);
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

function usageClass(pct) {
  if (pct > 85) return 'usage-red';
  if (pct > 60) return 'usage-orange';
  return 'usage-green';
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

async function detectMysqldump() {
  if (autoMysqldump.value) {
    settings.mysqldump_path = autoMysqldump.value;
    toast.success('mysqldump path auto-detected and set.');
  } else {
    toast.warning('Could not auto-detect mysqldump. Please specify the path manually.');
  }
}

onMounted(loadAll);
</script>

<style scoped>
/* ──────────────────────────────────────────────
   Root & Tokens
────────────────────────────────────────────── */
.backup-root {
  --bg:         #0f1117;
  --surface:    #161b27;
  --surface2:   #1c2233;
  --border:     #252d42;
  --text:       #e2e8f5;
  --muted:      #6b7a99;
  --accent:     #4f8ef7;
  --accent-h:   #6ba3ff;
  --green:      #34d399;
  --orange:     #fb923c;
  --red:        #f87171;
  --yellow:     #fbbf24;
  font-family:  'JetBrains Mono', 'Fira Code', monospace, sans-serif;
  background:   var(--bg);
  color:        var(--text);
  min-height:   100vh;
  padding:      24px;
}

/* ──────────────────────────────────────────────
   Header
────────────────────────────────────────────── */
.page-header {
  display:         flex;
  align-items:     center;
  justify-content: space-between;
  margin-bottom:   24px;
}
.header-left  { display: flex; align-items: center; gap: 14px; }
.header-icon  {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #1e3a6e, #2563eb22);
  border: 1px solid #2563eb44;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent);
}
.header-icon svg { width: 22px; height: 22px; }
.page-title   { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; margin: 0; }
.page-sub     { font-size: .75rem; color: var(--muted); margin: 0; }
.header-actions { display: flex; gap: 10px; }

/* ──────────────────────────────────────────────
   Drives Bar
────────────────────────────────────────────── */
.drives-bar {
  display:       flex;
  gap:           12px;
  margin-bottom: 20px;
  flex-wrap:     wrap;
}
.drive-card {
  background:  var(--surface);
  border:      1px solid var(--border);
  border-radius: 10px;
  padding:     12px 14px;
  min-width:   120px;
  cursor:      pointer;
  transition:  border-color .2s, box-shadow .2s;
  position:    relative;
}
.drive-card:hover { border-color: var(--accent); }
.drive-card.selected {
  border-color: var(--accent);
  background:   #1a2540;
  box-shadow:   0 0 0 2px #4f8ef722;
}
.drive-top {
  display:     flex;
  align-items: center;
  gap:         6px;
  color:       var(--muted);
  font-size:   .8rem;
  margin-bottom: 8px;
}
.drive-letter { font-weight: 700; color: var(--text); font-size: .9rem; }
.drive-check  { margin-left: auto; color: var(--green); }
.drive-bar-wrap {
  height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; margin-bottom: 6px;
}
.drive-bar-fill { height: 100%; border-radius: 4px; transition: width .4s; }
.usage-green  { background: var(--green); }
.usage-orange { background: var(--orange); }
.usage-red    { background: var(--red); }
.drive-meta   { display: flex; justify-content: space-between; font-size: .68rem; color: var(--muted); }

.drive-add-btn {
  display:      flex;
  flex-direction: column;
  align-items:  center;
  justify-content: center;
  gap:          6px;
  border:       1px dashed var(--border);
  border-radius: 10px;
  padding:      12px 20px;
  background:   transparent;
  color:        var(--muted);
  cursor:       pointer;
  font-size:    .75rem;
  transition:   all .2s;
}
.drive-add-btn:hover { border-color: var(--accent); color: var(--accent); }

/* ──────────────────────────────────────────────
   Stats Row
────────────────────────────────────────────── */
.stats-row {
  display:       grid;
  grid-template-columns: repeat(4, 1fr);
  gap:           12px;
  margin-bottom: 24px;
}
.stat-card {
  background:  var(--surface);
  border:      1px solid var(--border);
  border-radius: 10px;
  padding:     14px 18px;
  display:     flex;
  align-items: center;
  gap:         14px;
  color:       var(--muted);
}
.stat-card.accent-green { border-color: #34d39922; }
.stat-card.accent-blue  { border-color: #4f8ef722; }
.stat-card.accent-orange{ border-color: #fb923c22; }
.stat-num   { font-size: 1.4rem; font-weight: 700; color: var(--text); line-height: 1; }
.stat-label { font-size: .7rem; color: var(--muted); margin-top: 2px; }

/* ──────────────────────────────────────────────
   Main Grid
────────────────────────────────────────────── */
.main-grid {
  display:               grid;
  grid-template-columns: 1fr 320px;
  gap:                   20px;
  align-items:           start;
}

/* ──────────────────────────────────────────────
   Tables Column
────────────────────────────────────────────── */
.tables-col {
  background:   var(--surface);
  border:       1px solid var(--border);
  border-radius: 12px;
  overflow:     hidden;
}
.tab-bar {
  display:      flex;
  border-bottom: 1px solid var(--border);
  background:   var(--surface2);
}
.tab-btn {
  display:      flex;
  align-items:  center;
  gap:          6px;
  padding:      12px 18px;
  font-size:    .78rem;
  color:        var(--muted);
  background:   transparent;
  border:       none;
  border-bottom: 2px solid transparent;
  cursor:       pointer;
  transition:   all .2s;
}
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
.badge {
  background: var(--border);
  color:      var(--muted);
  font-size:  .65rem;
  padding:    1px 6px;
  border-radius: 10px;
}
.tab-btn.active .badge { background: #1e3a6e; color: var(--accent); }

.filter-bar {
  display:      flex;
  gap:          10px;
  padding:      12px 16px;
  border-bottom: 1px solid var(--border);
}
.search-wrap {
  flex: 1;
  display:     flex;
  align-items: center;
  gap:         8px;
  background:  var(--surface2);
  border:      1px solid var(--border);
  border-radius: 7px;
  padding:     0 10px;
  color:       var(--muted);
}
.filter-input {
  flex: 1; background: transparent; border: none; outline: none;
  color: var(--text); font-size: .8rem; font-family: inherit; padding: 7px 0;
}
.filter-select {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 7px; color: var(--text); font-size: .78rem;
  padding: 7px 10px; outline: none; font-family: inherit;
}

.table-wrap { overflow-x: auto; }
.backup-table { width: 100%; border-collapse: collapse; font-size: .78rem; }
.backup-table th {
  padding:      10px 14px;
  text-align:   left;
  color:        var(--muted);
  font-weight:  600;
  font-size:    .7rem;
  text-transform: uppercase;
  letter-spacing: .06em;
  border-bottom: 1px solid var(--border);
  background:   var(--surface2);
}
.backup-row td {
  padding:      10px 14px;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.backup-row:last-child td { border-bottom: none; }
.backup-row:hover td { background: var(--surface2); }

.empty-row {
  text-align: center; padding: 40px 0 !important;
  color: var(--muted);
}
.empty-row p { margin: 8px 0 0; font-size: .8rem; }

.file-name-cell {
  display: flex; align-items: center; gap: 7px; color: var(--text);
  max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.drive-badge {
  background: #1e2d4d; color: var(--accent);
  padding: 2px 8px; border-radius: 5px; font-size: .7rem; font-weight: 700;
}
.size-cell { color: var(--muted); }
.date-cell { color: var(--muted); white-space: nowrap; }
.type-badge {
  padding: 2px 8px; border-radius: 5px; font-size: .68rem; font-weight: 700; text-transform: uppercase;
}
.type-manual { background: #1e3a6e22; color: var(--accent); border: 1px solid #4f8ef733; }
.type-auto   { background: #34d39922; color: var(--green);  border: 1px solid #34d39933; }
.type-import { background: #fb923c22; color: var(--orange); border: 1px solid #fb923c33; }

.row-actions { display: flex; gap: 6px; }
.row-btn {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  background: var(--surface2); color: var(--muted); cursor: pointer; transition: all .15s;
}
.row-btn.download:hover { color: var(--accent); border-color: var(--accent); }
.row-btn.danger:hover   { color: var(--red);    border-color: var(--red); }

/* ──────────────────────────────────────────────
   Settings Panel
────────────────────────────────────────────── */
.settings-panel { display: flex; flex-direction: column; gap: 16px; }
.panel-section {
  background:   var(--surface);
  border:       1px solid var(--border);
  border-radius: 12px;
  padding:      16px;
}
.section-head {
  display:      flex;
  align-items:  center;
  gap:          8px;
  color:        var(--text);
  font-weight:  600;
  font-size:    .85rem;
  margin-bottom: 14px;
}
.setting-row {
  display:       flex;
  flex-direction: column;
  gap:           4px;
  margin-bottom: 10px;
}
.setting-row label { font-size: .72rem; color: var(--muted); }

/* Toggle */
.toggle-wrap { margin-left: auto; position: relative; cursor: pointer; }
.toggle-wrap input { display: none; }
.toggle-track {
  display:       inline-block;
  width:         38px; height: 20px;
  background:    var(--border);
  border-radius: 10px;
  position:      relative;
  transition:    background .2s;
}
.toggle-wrap input:checked + .toggle-track { background: var(--accent); }
.toggle-thumb {
  position:  absolute; top: 3px; left: 3px;
  width: 14px; height: 14px;
  background: white; border-radius: 50%;
  transition: left .2s;
}
.toggle-wrap input:checked + .toggle-track .toggle-thumb { left: 21px; }

/* Paths */
.path-row { display: flex; gap: 6px; margin-bottom: 8px; }
.path-input { flex: 1; }
.path-remove {
  width: 30px; height: 34px; border-radius: 6px; border: 1px solid var(--border);
  background: var(--surface2); color: var(--muted); display: flex;
  align-items: center; justify-content: center; cursor: pointer;
}
.path-remove:hover { color: var(--red); border-color: var(--red); }
.add-path-btn {
  margin-top: 4px; width: 100%; justify-content: center;
}

/* Import Drop Zone */
.hint-text { font-size: .72rem; color: var(--muted); margin: 0 0 10px; }
.drop-zone {
  border: 2px dashed var(--border); border-radius: 10px;
  padding: 20px 14px; text-align: center;
  color: var(--muted); font-size: .78rem; cursor: pointer;
  transition: border-color .2s, background .2s;
}
.drop-zone:hover, .drop-zone.drag-over {
  border-color: var(--accent); background: #1a2540;
}
.drop-zone p { margin: 6px 0; }
.pick-file-btn {
  display: inline-block; background: var(--surface2); border: 1px solid var(--border);
  border-radius: 6px; padding: 4px 12px; font-size: .72rem; cursor: pointer;
  color: var(--accent); transition: all .15s;
}
.pick-file-btn:hover { background: #1e3a6e; border-color: var(--accent); }

.import-file-name {
  display: flex; align-items: center; gap: 6px;
  font-size: .72rem; color: var(--green);
  background: #34d39911; border: 1px solid #34d39933;
  border-radius: 6px; padding: 6px 10px; margin: 8px 0;
}
.import-file-name button {
  margin-left: auto; background: none; border: none;
  color: var(--muted); cursor: pointer;
}

/* ──────────────────────────────────────────────
   Buttons
────────────────────────────────────────────── */
.input-field {
  background:  var(--surface2); border: 1px solid var(--border);
  border-radius: 7px; color: var(--text); font-size: .8rem;
  padding: 8px 10px; outline: none; width: 100%; font-family: inherit;
  transition: border-color .15s;
}
.input-field:focus { border-color: var(--accent); }

.path-input-group {
  display: flex; gap: 8px; align-items: center;
}
.path-input-group .input-field { flex: 1; }

.btn-compact {
  display: flex; align-items: center; justify-content: center;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 7px; width: 36px; height: 36px;
  cursor: pointer; transition: all .15s; color: var(--text);
}
.btn-compact:hover { border-color: var(--accent); color: var(--accent); }
.btn-compact:disabled { opacity: .55; cursor: not-allowed; }

.hint-text {
  font-size: .75rem; margin-top: 4px; margin-left: 2px;
}
.text-green-600 { color: #16a34a; }
.text-blue-600 { color: #2563eb; }

.btn-primary {
  display:      flex; align-items: center; gap: 7px;
  background:   var(--accent); color: white;
  border:       none; border-radius: 8px;
  padding:      8px 16px; font-size: .8rem; font-weight: 600;
  cursor:       pointer; transition: background .15s;
  font-family:  inherit;
}
.btn-primary:hover    { background: var(--accent-h); }
.btn-primary:disabled { opacity: .55; cursor: not-allowed; }

.btn-secondary {
  display:      flex; align-items: center; gap: 7px;
  background:   var(--surface2); color: var(--text);
  border:       1px solid var(--border); border-radius: 8px;
  padding:      8px 14px; font-size: .8rem; font-weight: 600;
  cursor:       pointer; transition: all .15s;
  font-family:  inherit;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

.btn-save {
  display:      flex; align-items: center; gap: 7px; justify-content: center;
  width:        100%; background: #1e3a6e; color: var(--accent);
  border:       1px solid #2563eb44; border-radius: 8px;
  padding:      9px; font-size: .8rem; font-weight: 600;
  cursor:       pointer; transition: all .15s; margin-top: 4px;
  font-family:  inherit;
}
.btn-save:hover    { background: #253d6e; }
.btn-save:disabled { opacity: .55; cursor: not-allowed; }

.btn-ghost {
  display:      flex; align-items: center; gap: 7px;
  background:   transparent; color: var(--muted);
  border:       1px dashed var(--border); border-radius: 8px;
  padding:      7px 12px; font-size: .78rem;
  cursor:       pointer; transition: all .15s; font-family: inherit;
}
.btn-ghost:hover { color: var(--accent); border-color: var(--accent); }

.btn-danger {
  display:      flex; align-items: center; gap: 7px;
  background:   var(--red); color: white;
  border:       none; border-radius: 8px;
  padding:      8px 16px; font-size: .8rem; font-weight: 600;
  cursor:       pointer; transition: all .15s; font-family: inherit;
}
.btn-danger:disabled { opacity: .55; cursor: not-allowed; }

.btn-danger-outline {
  display:      flex; align-items: center; gap: 7px; justify-content: center;
  width:        100%; background: #f8717111; color: var(--red);
  border:       1px solid #f8717133; border-radius: 8px;
  padding:      9px; font-size: .8rem; font-weight: 600;
  cursor:       pointer; transition: all .15s; margin-top: 8px;
  font-family:  inherit;
}
.btn-danger-outline:hover    { background: #f8717122; }
.btn-danger-outline:disabled { opacity: .55; cursor: not-allowed; }

/* ──────────────────────────────────────────────
   Modal
────────────────────────────────────────────── */
.modal-header-row {
  display: flex; align-items: center; gap: 8px; font-size: .95rem; font-weight: 600;
}
.warn-icon { color: var(--yellow); }
.modal-body-text { font-size: .85rem; color: var(--muted); line-height: 1.6; }
.modal-form { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: .75rem; color: var(--muted); }

/* ──────────────────────────────────────────────
   Responsive
────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .main-grid  { grid-template-columns: 1fr; }
  .stats-row  { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .backup-root { padding: 12px; }
  .stats-row   { grid-template-columns: 1fr 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>