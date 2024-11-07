import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

function DrawerIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} {...props} />;
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        drawerPosition: 'left',
        headerShown: false,
      }}>
      <Drawer.Screen
        name="index"
        options={{
          title: 'Papers',
          drawerIcon: ({ color }) => <DrawerIcon name="book" color={color} />,
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'Explore',
          drawerIcon: ({ color }) => <DrawerIcon name="search" color={color} />,
        }}
      />
    </Drawer>
  );
}
