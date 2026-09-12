import { createFileRoute } from "@tanstack/react-router";
import UserPortal from "../pages/UserPortal";
import JoinSSFHub from "../components/JoinSSFHub";
import UserApplicationStatus from "../components/UserApplicationStatus";

function UserPortalWithJoin() {
  return (
    <>
      <JoinSSFHub />
      <UserApplicationStatus />
      <UserPortal />
    </>
  );
}

export const Route = createFileRoute("/UserPortal")({
  component: UserPortalWithJoin,
});
