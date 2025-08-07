import { VStack } from '@styled-system/jsx';
import { HomeContainer } from '@/containers/home/HomeContainer';

export default function HomePage() {
  return (
    <VStack h="100vh" p="padding.block.md" position="relative" w="100%" gap="layout.section.sm">
      <HomeContainer />
    </VStack>
  );
}
