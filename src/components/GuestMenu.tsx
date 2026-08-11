"use client";

import { useState, ReactNode } from "react";
import { HamburgerMenu, MenuButton } from "./HamburgerMenu";
import { Modal } from "./Modal";

interface GuestMenuProps {
  historyNode: ReactNode;
  dishRequestNode: ReactNode;
  profileNode: ReactNode;
}

export function GuestMenu({ historyNode, dishRequestNode, profileNode }: GuestMenuProps) {
  const [activeModal, setActiveModal] = useState<"history" | "request" | "profile" | null>(null);

  return (
    <>
      <HamburgerMenu>
        <MenuButton icon="📜" label="Order History" onClick={() => setActiveModal("history")} />
        <MenuButton icon="✨" label="Request a Dish" onClick={() => setActiveModal("request")} />
        <MenuButton icon="👤" label="My Profile" onClick={() => setActiveModal("profile")} />
      </HamburgerMenu>

      <Modal id="history-modal" title="Order History" isOpen={activeModal === "history"} onClose={() => setActiveModal(null)}>
        {historyNode}
      </Modal>

      <Modal id="request-modal" title="Craving Something Else?" isOpen={activeModal === "request"} onClose={() => setActiveModal(null)}>
        {dishRequestNode}
      </Modal>

      <Modal id="profile-modal" title="My Profile" isOpen={activeModal === "profile"} onClose={() => setActiveModal(null)}>
        {profileNode}
      </Modal>
    </>
  );
}
