import { createFileRoute } from "@tanstack/react-router";
import UserPortal from "../pages/UserPortal";
import JoinSSFHub from "../components/JoinSSFHub";

function UserPortalWithJoin() {
  return (
    <>
      <JoinSSFHub />
      <UserPortal />
    </>
  );
}

export const Route = createFileRoute("/UserPortal")({
  component: UserPortalWithJoin,
});
