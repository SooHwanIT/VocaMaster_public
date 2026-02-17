import { app, BrowserWindow, ipcMain, Menu, session } from 'electron'
import path from 'path'

// 개발 환경인지 확인 (VITE_DEV_SERVER_URL은 플러그인이 주입함)
const isDev = process.env.VITE_DEV_SERVER_URL !== undefined

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
    },
  })

  win.setMenuBarVisibility(false)

  // 마이크 권한 자동 허용
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ['media', 'microphone', 'audioCapture']
    if (allowedPermissions.includes(permission)) {
      callback(true)
    } else {
      callback(false)
    }
  })

  // 마이크 장치 선택 권한 허용
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    const allowedPermissions = ['media', 'microphone', 'audioCapture']
    return allowedPermissions.includes(permission)
  })

  if (isDev) {
    // 개발 모드: Vite 서버 URL 로드
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools() // 개발자 도구 자동 열기
  } else {
    // 빌드 모드: 로컬 파일 로드
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

ipcMain.on('window:minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize()
})

ipcMain.on('window:toggle-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  if (win.isMaximized()) {
    win.unmaximize()
  } else {
    win.maximize()
  }
})

ipcMain.on('window:close', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close()
})

app.whenReady().then(createWindow)
Menu.setApplicationMenu(null)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})