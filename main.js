console.log("Electron - Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron')

let win
const createWindow = () => {
  nativeTheme.themeSource = 'light'

  win = new BrowserWindow({
    width: 1010,
    height: 720,
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  win.loadFile('./src/views/index.html')
}

let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    about = new BrowserWindow({
      width: 320,
      height: 280,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      parent: mainWindow,
      modal: true
    })
  }
  about.loadFile('./src/views/sobre.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.commandLine.appendSwitch('log-level', '3')

const template = [
  {
    label: 'Cadastro',
    submenu: [
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Relatório',
    submenu: [
      {
        type: 'separator'
      },
      {
        label: 'Clientes',
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplicar zoom',
        role: 'zoomIn'
      },
      {
        label: 'Reduzir',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/GabrielYago10/cadastro-.git')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]

// Ouvir o evento de cadastro de cliente do processo de renderização
ipcMain.on('cadastrar-cliente', (event, dados) => {
  console.log('Cliente cadastrado:', dados)

  // Aqui você pode adicionar a lógica para salvar os dados em um banco de dados ou arquivo
  // Exemplo:
  // fs.appendFileSync('clientes.json', JSON.stringify(dados) + '\n')
})
