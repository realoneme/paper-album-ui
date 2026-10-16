import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Alert', group: 'Feedback', height: 440 };

export default function AlertDemo() {
  return (
    <div className="pa-stack" style={{ maxWidth: 600, gap: 14, paddingTop: 6 }}>
      <Alert variant="info">
        <AlertTitle>Your site is in preview</AlertTitle>
        <AlertDescription>Only people with the link can see these albums until you publish.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Album published</AlertTitle>
        <AlertDescription>“Winter in Hokkaido” is live on your site.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Storage almost full</AlertTitle>
        <AlertDescription>You have used 9.4 of 10 GB. Archive old albums or upgrade your plan.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>The card was declined. Ask the client to try another card.</AlertDescription>
      </Alert>
      <Alert>
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>Drag photos between albums to reorder your portfolio.</AlertDescription>
      </Alert>
    </div>
  );
}
