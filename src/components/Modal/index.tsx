import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";

export default function CreateModal({
                                        isOpen,
                                        onOpenChange,
                                        modalTitle,
                                        modalBody,
                                        onConfirm = () => {
                                        },
                                        footer = true,
                                    }) {


    return (
        <div className="flex flex-col gap-2">

            <Modal
                isOpen={isOpen}
                placement="auto"
                onOpenChange={onOpenChange}
            >
                <ModalContent>
                    {(onClose) => {
                        const onPressConfirm = async () => {
                            console.log("Confirm");
                            await onConfirm();
                            onClose();
                        };
                        return (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h4>{modalTitle}</h4>
                                </ModalHeader>
                                <ModalBody>
                                    {modalBody}
                                </ModalBody>
                                {
                                    footer ?
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onPress={onClose}>
                                                Close
                                            </Button>
                                            <Button color="primary" onPress={onPressConfirm}>
                                                Ok
                                            </Button>
                                        </ModalFooter>
                                        : null
                                }

                            </>
                        );
                    }}
                </ModalContent>
            </Modal>
        </div>
    );
}

