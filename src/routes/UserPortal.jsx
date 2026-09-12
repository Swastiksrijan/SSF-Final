import { createFileRoute } from "@tanstack/react-router";
import UserPortal from "../pages/UserPortal";
import JoinSSFHub from "../components/JoinSSFHub";

function UserPortalWithJoin() {
  return (
    <>
      <UserPortal />
      <JoinSSFHub />
    </>
  );
}

export const Route = createFileRoute("/UserPortal")({
  component: UserPortalWithJoin,
});
