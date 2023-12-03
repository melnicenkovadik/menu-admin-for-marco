import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import useTranslation from "../../hooks/useTranslation";

export default function CreateModal({
                                        isOpen,
                                        onOpenChange,
                                        modalTitle,
                                        modalBody,
                                        onConfirm = () => {
                                        },
                                        footer = true,
                                    }) {
    const {t} = useTranslation();

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
                                              {t('close')}
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

