// Contacts.js
import React from "react";
import { useNavigate } from "react-router-dom";
import ContactFormModal from "../../GlobalComponents/ContactFormModal";

const Contacts = () => {
  const navigate = useNavigate();

  return (
    <ContactFormModal isOpen={true} onClose={() => navigate('/')} />
  );
};

export default Contacts;