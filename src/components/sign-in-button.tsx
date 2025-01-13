"use client" // Ensure this component is treated as client-side only

import { useState } from "react" // Import useState hook
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal" // Import the Modal component
import SignInWithGoogle from "@/components/sign-in-with-google" // Import the SignIn component

const SignInButton = () => {
  // State for managing modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Open and close modal functions
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div>
      <Button onClick={openModal}>Get Started</Button>{" "}
      {/* Button to open modal */}
      {/* Modal that contains the Google Sign-In button */}
      <Modal
        showModal={isModalOpen}
        setShowModal={setIsModalOpen}
        onClose={closeModal}
      >
        {/* Credentials sign-in/up form */}
        <SignInWithGoogle />
      </Modal>
    </div>
  )
}

export default SignInButton
