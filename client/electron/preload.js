import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu actions
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-new-sale', callback);
    ipcRenderer.on('menu-add-flower', callback);
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },

  // Platform info
  platform: process.platform,
  
  // App info
  getVersion: () => process.versions.electron,
  getAppVersion: () => process.env.npm_package_version || '1.0.0'
});
