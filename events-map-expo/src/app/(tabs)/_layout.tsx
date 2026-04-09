import { Tabs } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

export default function TabsRoutesLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="home" size={size} color={color} />
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name="person" size={size} color={color} />
          },
        }}
      />
    </Tabs>
  )
}
