import { createContext, useState } from 'react'
import themeConfig from '../configs/themeConfig'

const initialSettings = {
    themeColor: 'primary',
    mode: themeConfig.mode,
    contentWidth: themeConfig.contentWidth
}

//hook ???
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

export const SettingsConsumer = SettingsContext.Consumer
