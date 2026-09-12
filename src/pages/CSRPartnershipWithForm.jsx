import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CSRPartnership from "./CSRPartnership";
import CSRProposalForm from "../components/CSRProposalForm";

export default function CSRPartnershipWithForm() {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    const findForm = () => {
      const form = document.querySelector("#partner-form form");
      if (form) setTarget(form);
    };
    findForm();
    const observer = new MutationObserver(findForm);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <CSRPartnership />
      {target && createPortal(<CSRProposalForm />, target)}
    </>
  );
}
