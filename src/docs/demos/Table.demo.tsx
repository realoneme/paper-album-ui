import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Table', group: 'Data display', height: 290 };

const prints = [
  { size: 'A4', paper: '21 × 29.7 cm', price: '$60' },
  { size: 'Square', paper: '30 × 30 cm', price: '$80' },
  { size: 'A3', paper: '29.7 × 42 cm', price: '$95' },
];

export default function TableDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 520 }}>
      <Table>
        <TableCaption>All prints are archival cotton rag, signed.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Size</TableHead>
            <TableHead>Paper</TableHead>
            <TableHead numeric>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prints.map((p) => (
            <TableRow key={p.size}>
              <TableCell><b>{p.size}</b></TableCell>
              <TableCell className="pa-muted">{p.paper}</TableCell>
              <TableCell numeric>{p.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
