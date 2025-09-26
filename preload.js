// preload.js

const { contextBridge } = require('electron');

// Safely expose APIs or variables to the renderer
contextBridge.exposeInMainWorld('electronAPI', {
  appLoaded: () => {
    console.log('✅ Electron App Loaded via preload.js');
  }
});

// Optionally log once DOM is ready (like your original)
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron DOM Loaded ✅');
});
