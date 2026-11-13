import ImsLayout from "../ImsLayout";
import OrganizationStructureContent from "../../components/OrganizationStructureContent";

export default function ImsOrganizationStructure() {
  return (
    <ImsLayout active="organisation_dashboard">
      <OrganizationStructureContent mode="ims" />
    </ImsLayout>
  );
}
