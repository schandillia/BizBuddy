"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { useRouter } from "next/navigation"
import { LoginModalForm } from "@/components/auth/login-modal-form"
// import { LoginModal } from "@/components/auth/login-modal"

interface LoginButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  const onClick = () => {
    if (mode === "modal") {
      setShowModal(true)
    } else {
      router.push("/auth/login")
    }
  }

  if (mode === "modal") {
    return (
      <>
        <span onClick={onClick} className="cursor-pointer">
          {children}
        </span>
        {showModal && (
          <Modal showModal={showModal} setShowModal={setShowModal}>
            <LoginModalForm />
          </Modal>
        )}
      </>
    )
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  )
}
