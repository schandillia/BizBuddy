"use client"

import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useState } from "react"

export const AuthButton = () => {
  const [showModal, setShowModal] = useState(false)

  const onClick = () => setShowModal(true)

  return (
    <>
      <Button onClick={onClick}>Get Started</Button>

      {showModal && (
        <Modal showModal={showModal} setShowModal={setShowModal}>
          <AuthForm />
        </Modal>
      )}
    </>
  )
}
