import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { css } from '@styled-system/css'
import { Grid } from '@styled-system/jsx'

export default function TextareaWithTextDemo() {
  return (
    <Grid width="full" gap="1.5">
      <Label htmlFor="message-2">Email</Label>
      <Textarea id="message-2" placeholder="Type your message here." />
      <p className={css({ fontSize: 'sm', color: 'text.tertiary' })}>
        Your message will be copied to the support team.
      </p>
    </Grid>
  )
}
