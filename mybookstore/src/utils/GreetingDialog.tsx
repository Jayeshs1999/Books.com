import React from "react";
import { Button, Image, Modal } from "react-bootstrap";
import greetingImage from "../assets/congratulation.png";
import { t } from "i18next";

interface GreetingDialogProps {
  message: any;
  handleDialog: any;
}

const GreetingDialog = ({ message, handleDialog }: GreetingDialogProps) => {
  const handleClosePopup = () => {
    handleDialog(false);
  };

  return (
    <Modal show={true} onHide={handleClosePopup}>
      <Modal.Body>
        <div style={{ color: "green" }} className="text-center pt-5">
          <Image style={{ width: "20%" }} src={greetingImage} alt="" />
          <h1 className="pt-3">{message}</h1>
        </div>
      </Modal.Body>
      <Button
        type="button"
        variant="outlined"
        style={{ color: "#050572" }}
        onClick={handleClosePopup}
      >
        <u>{t("go_to_profile_to_view_your_order_details")}</u>
      </Button>
    </Modal>
  );
};

export default GreetingDialog;
