"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { signInWithGoogle } from "@/app/actions/auth"

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
      >
        <form action={signInWithGoogle}>
          <Button type="submit">Sign In with Google</Button>
        </form>
      </Modal>
    </div>
  )
}

export default SignInButton
