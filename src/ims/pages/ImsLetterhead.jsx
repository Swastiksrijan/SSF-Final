// SSF-IMS — Letterhead page intentionally cleared at the owner's request.
// Keep the IMS layout and route protection; the page content is blank.
import ImsLayout from '../ImsLayout';

export default function ImsLetterhead() {
  return (
    <ImsLayout active="letterhead">
      <main aria-label="Blank letterhead workspace" className="min-h-[70vh]" />
    </ImsLayout>
  );
}
