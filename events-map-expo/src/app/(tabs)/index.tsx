import { Link } from 'expo-router'
import { Button, Text, View } from 'react-native'

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-red-200">Home</Text>
      <Link href="/profile" asChild>
        <Button title="Go to Profile" />
      </Link>
    </View>
  )
}
