import { createContext, useState } from 'react'
import themeConfig from '../configs/themeConfig'

const initialSettings = {
    themeColor: 'primary',
    mode: themeConfig.mode,
    contentWidth: themeConfig.contentWidth
}

// 共享一个组件树的全局数据 如主题，语言
export const SettingsContext = createContext({
    savaSettings: () => null,
    settings: initialSettings
})

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({ ...initialSettings })

    const saveSettings = updatedSettings => {
        setSettings(updatedSettings)
    }

    return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}


//订阅 context 的变更
export const SettingsConsumer = SettingsContext.Consumer
