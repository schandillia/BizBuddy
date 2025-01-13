// SignInButton.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { AuthForm } from "@/components/auth-form"

const SignInButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div>
      <Button onClick={openModal}>Get Started</Button>
      <Modal
        showModal={isModalOpen}
        setShowModal={setIsModalOpen}
        onClose={closeModal}
        className="z-[200]"
      >
        <AuthForm onClose={closeModal} />
      </Modal>
    </div>
  )
}

export default SignInButton
