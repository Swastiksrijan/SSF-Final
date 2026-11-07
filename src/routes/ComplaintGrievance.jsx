import { createFileRoute } from '@tanstack/react-router';
import ComplaintGrievance from '../pages/ComplaintGrievance';

export const Route = createFileRoute('/ComplaintGrievance')({
  component: ComplaintGrievance,
});
