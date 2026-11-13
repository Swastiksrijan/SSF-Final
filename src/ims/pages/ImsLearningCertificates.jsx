import ImsLayout from '../ImsLayout';
import AdminLearningCertificates from '../../components/AdminLearningCertificates';

/** Learning Certificates — issue and verify certificates for completed learning records. */
export default function ImsLearningCertificates() {
  return (
    <ImsLayout active="learning_certificates">
      <AdminLearningCertificates titleTag="h1" />
    </ImsLayout>
  );
}
