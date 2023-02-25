import { useModalStore } from "lib/stores/ModalStore";
import { observer } from "mobx-react";
import React, { FC } from "react";
import Modal, { ModalProps } from "./Modal";

export type ConfirmModalProps = ModalProps & {
  onYes?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
};

const ConfirmModal: FC<ConfirmModalProps> = observer(
  ({
    confirmButtonText = "Confirm",
    cancelButtonText = "Cancel",
    children,
    onYes = () => {},
    heading,
  }) => {
    const modalStore = useModalStore();
    const confirm = () => {
      onYes();
      modalStore.closeModal();
    };
    return (
      <Modal heading={heading} showCloseButton={false} centerHeadingText={true}>
        {children}
        <div className="flex">
          <button
            className="rounded-zul-10 h-zul-50 center bg-zul-blue text-white w-full h-zul-40 mr-zul-15  font-medium text-zul-16-150 focus:outline-none"
            onClick={() => confirm()}
          >
            {confirmButtonText}
          </button>
          <button
            className="rounded-zul-10 h-zul-50 center bg-border-light dark:bg-sky-700 text-white w-full h-zul-40  font-medium text-zul-16-150 focus:outline-none"
            onClick={() => modalStore.closeModal()}
          >
            {cancelButtonText}
          </button>
        </div>
      </Modal>
    );
  },
);

export default ConfirmModal;
