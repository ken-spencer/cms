import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import Dialog from "../Dialog";
import Button from "@mui/material/Button";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import useAdmin from "./useAdmin";
import useForm from "@thaumazo/forms/useForm";
import useConfirm from "@thaumazo/forms/useConfirm";

const confirmMessage = "Exit without saving changes?";
export default function AdminConfirm() {
  useConfirm(confirmMessage);
  const router = useRouter();
  const pathName = usePathname();
  const { confirm, setConfirm } = useAdmin();
  const form = useForm();
  const focusButton = useRef();

  useEffect(() => {
    if (confirm) {
      // Give the dialog time to render
      setTimeout(() => {
        if (focusButton.current) {
          focusButton.current.focus();
        }
      }, 100);
      // focusButton.current.focus();
    }
  }, [confirm]);

  if (!confirm) {
    return null;
  }

  const close = () => {
    setConfirm(false);
  };

  const handleCorrect = () => {
    const input = form.ref.current.querySelector(":invalid");
    if (input) {
      // closing the dialog sets a focus. A delay here lets us set a custom one
      setTimeout(() => {
        input.focus();
      }, 100);
    }

    setConfirm(false);
  };

  const handleExit = () => {
    if (confirm === pathName && pathName.endsWith("/new")) {
      form.reset();
    } else {
      router.push(confirm);
    }

    setConfirm(false);
  };

  const buttons = (
    <>
      <Button
        ref={focusButton}
        color="primary"
        variant="contained"
        autoFocus
        onClick={handleCorrect}
        startIcon={<CheckCircleOutlineIcon />}
      >
        Correct Errors
      </Button>

      <Button
        color="error"
        variant="contained"
        onClick={handleExit}
        startIcon={<DeleteForeverIcon />}
      >
        Don&lsquo;t save
      </Button>
    </>
  );

  return (
    <Dialog
      open={confirm ? true : false}
      close={close}
      title="Unsaved changes"
      actions={buttons}
    >
      Your form has been updated, but it contains validation errors. Please
      review and correct these errors to proceed. If you wish to exit without
      saving your changes, select &ldquo;Don&lsquo;t Save&rdquo;.
    </Dialog>
  );
}
