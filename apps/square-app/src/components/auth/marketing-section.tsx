import Heading from '@/components/uii/typography/heading'
import Paragraph from '@/components/uii/typography/paragraph'
import { VStack } from '@styled-system/jsx'

export function MarketingSection() {
  return (
    <VStack
      gap="gap.component.md"
      align="flex-start"
      justify="center"
      maxW="600px"
      p="layout.internal.lg"
    >
      <Heading 
        level={2} 
        css={{ color: 'bgSolid.text' }}
      >
        Transform Your Business
      </Heading>
      <Paragraph 
        color="secondary" 
        textStyle="bold"
        css={{ color: 'bgSolid.text', maxW: '500px' }}
      >
        Streamline operations, boost efficiency, and unlock growth with our powerful Square integration platform.
      </Paragraph>
    </VStack>
  )
} 