import { Box, HStack } from '@styled-system/jsx';
import { header } from '@styled-system/recipes';
import { pill } from '@styled-system/recipes';
import Heading from '@/components/primitives/ui/typography/heading';
import { SignOutButton } from '@/components/composites/buttons/SignOutButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function Header() {
  const session = await getServerSession(authOptions);
  const merchantName = session?.user?.name || 'Merchant';
  const { root, container } = header();

  return (
    <Box className={root}>
      <HStack className={container}>
        <Box className={pill({ variant: 'layout' })}>
          <Heading level={5}>{merchantName}</Heading>
        </Box>
        <SignOutButton />
      </HStack>
    </Box>
  );
}
